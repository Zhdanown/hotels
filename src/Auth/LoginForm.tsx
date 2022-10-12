import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import { useParams } from "react-router-dom";

import { AuthLink, Form, FormTitle } from "./components";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { Error } from "../components/Input";
import { FormikInput } from "../components/Input";
import { getIsLoginPending, getLoginError, getUser } from "./authReducer";
import { login } from "./authReducer";
import { SberIcon } from "../components/CustomIcons";
import LayoutContext from "../Layout/LayoutContext";
import { Guest } from "../Profile/GuestList";

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

export default function LoginForm({ close }: { close: () => void }) {
  const user = useSelector(getUser) as User;

  const isPending = useSelector(getIsLoginPending);
  const loginError = useSelector(getLoginError);
  const dispatch = useDispatch();

  const { setStep } = useContext(LayoutContext);

  const api = process.env.REACT_APP_API;

  let { slug: hotelAlias } = useParams<{ slug?: string }>();

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
