import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import { useParams } from "react-router-dom";

import { AuthLink, Form, FormTitle, Greetings } from "./components";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { Error } from "../components/Input";
import { FormikInput } from "../components/Input";
import {
  getIsLoginPending,
  getLoginError,
  getUser,
} from "./authReducer";
import { login } from "./authReducer";
import { SberIcon } from "../components/CustomIcons";

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

export default function LoginForm({ close }: { close: () => void }) {
  const user = useSelector(getUser);
  const isPending = useSelector(getIsLoginPending);
  const loginError = useSelector(getLoginError);
  const dispatch = useDispatch();

  const api = process.env.REACT_APP_API

  let { slug: hotelAlias } = useParams<{ slug?: string }>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (user) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, close]);

  if (user) {
    return (
      <Greetings>
        C Возвращением, <br />
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
        <a href={`${api}api/v1/users/teamID-login-form?hotel_alias=${hotelAlias}`}>
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
