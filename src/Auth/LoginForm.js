import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";

import Button from "../components/Button";
import Loader from "../components/Loader";
import { Error } from "../components/Input";
import { FormikInput } from "../components/Input";
import { getIsLoginPending, getLoginError, getUser } from "./authReducer";
import { login } from "./authReducer";

function validate(values) {
  const errors = {};

  if (!values.username) {
    errors.username = "Это поле не должно быть пустым";
  }
  if (!values.password) {
    errors.password = "Это поле не должно быть пустым";
  }

  return errors;
}

export default function LoginForm({ close }) {
  const user = useSelector(getUser);
  const isPending = useSelector(getIsLoginPending);
  const loginError = useSelector(getLoginError);
  const dispatch = useDispatch();

  useEffect(() => {
    let timeout;
    if (user) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, close]);

  if (user) {
    return <Greetings name={user.first_name} />;
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
      <Form style={{ width: 250 }}>
        <h3 className="is-size-4 has-text-centered">Авторизация</h3>

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
      </Form>
    </Formik>
  );
}

const Greetings = ({ name }) => (
  <h3 className="has-text-centered is-size-4">
    Добро пожаловать, <br />
    {name}!
  </h3>
);
