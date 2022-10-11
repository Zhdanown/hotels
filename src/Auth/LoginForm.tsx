import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import { useParams } from "react-router-dom";

import { AuthLink, Form, FormTitle, Greetings } from "./components";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { Error } from "../components/Input";
import { FormikInput } from "../components/Input";
import { getIsLoginPending, getLoginError, getUser } from "./authReducer";
import { login } from "./authReducer";
import { SberIcon } from "../components/CustomIcons";
import LayoutContext from "../Layout/LayoutContext";
import { Guest } from "../Profile/GuestList";
import { Centered } from "../components/Centered";
import styled from "styled-components";

function validate(values: any) {
  const errors = {} as any;

  if (!values.username) {
    errors.username = "Это поле не должно быть пустым";
  }
  if (!values.password) {
    errors.password = "Это поле не должно быть пустым";
  }

  return errors;
}

type User = {
  email: string;
  first_name: string;
  groups: { id: number; name: string };
  id: number;
  is_hotel_guest: boolean;
  last_name: string;
  middle_name: string;
  phone: string;
  sber_info: { department: string; is_company_employee: boolean };
  teamID_info: {
    organization_name: string;
    subdivision_name: string;
    oraganization_id: string;
    is_active: boolean;
  };
  user_guests: Guest[];
  username: string;
};

const WarningMessage = styled.div`
  max-width: 750px;

  h3 {
    font-size: 40px;
  }
  p {
    font-size: 24px;
  }
  @media screen and (max-width: 800px) {
    max-width: 450px;
    h3 {
      font-size: 28px;
    }
    p {
      font-size: 16px;
    }
  }

  @media screen and (max-width: 500px) {
    max-width: 400px;
  }
  @media screen and (max-width: 410px) {
    max-width: 300px;
  }
`;

const WarningForSberUser = ({ close }: { close: () => void }) => (
  <Centered column>
    <WarningMessage className="p-3">
      <h3 className="has-text-centered">Внимание!</h3>
      <p className="has-text-justified">
        После создания бронирования с Вами свяжется сотрудник СКК
      </p>
      <p className="has-text-justified">
        "МРИЯ" направляет письмо сотруднику (на почту, указанную при
        бронировании путевки) о необходимости подтвердить статус "Близкий член
        семьи сотрудника". Сотруднику необходимо предоставить копии документов,
        подтверждающих его родство с близкими членам семьи (свидетельство о
        заключении брака, свидетельство о рождении, свидетельство о перемене
        имени) в ответном письме
      </p>
    </WarningMessage>

    <Button className="mt-5" onClick={close}>
      Понятно
    </Button>
  </Centered>
);

export default function LoginForm({ close }: { close: () => void }) {
  const user = useSelector(getUser) as User;
  const isSberEmployee = user?.teamID_info?.is_active;

  const isPending = useSelector(getIsLoginPending);
  const loginError = useSelector(getLoginError);
  const dispatch = useDispatch();

  const { setStep } = useContext(LayoutContext);

  const api = process.env.REACT_APP_API;

  let { slug: hotelAlias } = useParams<{ slug?: string }>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (user && !isSberEmployee) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, isSberEmployee, close]);

  if (isSberEmployee) {
    return <WarningForSberUser close={close} />;
  }

  if (user) {
    return (
      <Greetings>
        С Возвращением, <br />
        {user.first_name}!
      </Greetings>
    );
  }

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(login(values));
        setSubmitting(false);
        setStep(1);
      }}
    >
      <Form as={FormikForm}>
        <FormTitle>Авторизация</FormTitle>

        <FormikInput label="Логин" name="username" type="text" />
        <FormikInput label="Пароль" name="password" type="password" />

        {loginError && loginError.non_field_errors ? (
          <Error style={{ margin: "1rem", textAlign: "center" }}>
            {loginError.non_field_errors}
          </Error>
        ) : null}
        {isPending ? (
          <div className="has-text-centered">
            <Loader />
          </div>
        ) : null}
        {!user && !isPending && (
          <Button block type="submit">
            Войти
          </Button>
        )}
        <hr />
        <a
          href={`${api}api/v1/users/teamID-login-form?hotel_alias=${hotelAlias}`}
        >
          <Button block>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SberIcon style={{ marginRight: 8 }} />
              Войти по TeamId
            </span>
          </Button>
        </a>
        <AuthLink to="/register">зарегистрироваться</AuthLink>
      </Form>
    </Formik>
  );
}
