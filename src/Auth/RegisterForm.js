import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form, FormTitle, Greetings } from "./components";
import Button from "../components/Button";
import userFields from "../Step3/userFields";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import Loader from "../components/Loader";
import {
  getIsRegistrationPending,
  getRegisterError,
  getUser,
} from "./authReducer";
import { register } from "./authReducer";
import { FormikInput } from "../components/Input";
import {
  usernameIsValid,
  emailIsValid,
  phoneIsValid,
  passwordIsInvalid,
  mapServerErrors,
} from "../utils/validationHelpers";
import { Centered } from "../components/Centered";
import { Link } from "react-router-dom";
import CustomLink from "../components/Link";

function RegisterForm({ guest, close }) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    let timeout;
    if (user) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, close]);

  if (user) {
    return (
      <Greetings>
        Добро пожаловать, <br />
        {user.first_name}!
      </Greetings>
    );
  }

  return (
    <Formik
      initialValues={{
        ...guest,
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(register(values));
        setSubmitting(false);
      }}
    >
      <FormWithServerErrors />
    </Formik>
  );
}

export default RegisterForm;

function FormWithServerErrors() {
  const registerError = useSelector(getRegisterError);
  const isPending = useSelector(getIsRegistrationPending);
  const { setErrors } = useFormikContext();

  useEffect(() => {
    if (registerError) {
      setErrors(mapServerErrors(registerError));
    }
  }, [registerError, setErrors]);

  return (
    <Form as={FormikForm}>
      <FormTitle>Регистрация</FormTitle>

      {userFields.map(field => (
        <FormikInput key={field.name} {...field} />
      ))}

      {isPending ? (
        <div className="has-text-centered">
          <Loader />
        </div>
      ) : null}
      <Button block type="submit">
        Зарегистрироваться
      </Button>
      <Centered style={{ marginTop: "1rem" }}>
        <CustomLink as={Link} to={`/welna_kaluga/login`}>
          Войти
        </CustomLink>
      </Centered>
    </Form>
  );
}

function validate(values) {
  const errors = {};

  if (!values.username) {
    errors.username = "Это поле не должно быть пустым";
  } else if (!usernameIsValid(values.username)) {
    errors.username = "Недопустимые символы";
  }
  if (!values.first_name) {
    errors.first_name = "Это поле не должно быть пустым";
  }
  if (!values.last_name) {
    errors.last_name = "Это поле не должно быть пустым";
  }
  if (!values.middle_name) {
    errors.middle_name = "Это поле не должно быть пустым";
  }
  if (!values.email) {
    errors.email = "Это поле не должно быть пустым";
  } else if (!emailIsValid(values.email)) {
    errors.email = "Недопустимые символы";
  }
  if (!values.phone) {
    errors.phone = "Это поле не должно быть пустым";
  } else if (!phoneIsValid(values.phone)) {
    errors.phone = "Недопустимый формат номера";
  }

  if (!values.password) {
    errors.password = "Это поле не должно быть пустым";
  } else if (passwordIsInvalid(values.password)) {
    errors.password = passwordIsInvalid(values.password);
  }
  if (!values.password_confirm) {
    errors.password_confirm = "Это поле не должно быть пустым";
  } else if (values.password !== values.password_confirm) {
    errors.password_confirm = "Пароли должны совпадать";
  }

  return errors;
}
