import React, { useEffect } from "react";
import { FormikInput } from "../components/Input";
import { Formik, Form as FormikForm, useFormikContext } from "formik";

import userFields from "./userFields";
import { useDispatch, useSelector } from "react-redux";
import { getRegisterError } from "../Auth/authReducer";
import {
  emailIsValid,
  filterFalsyObjectKeys,
  mapServerErrors,
  phoneIsValid,
  usernameIsValid,
} from "../utils/validationHelpers";
import { changeParams } from "../redux/booking";

function filterByFieldName(fields) {
  return fields.filter(x => fieldNames.includes(x.name));
}

const fieldNames = ["first_name", "last_name", "email", "phone"];
const fields = filterByFieldName(userFields);

function FormNoRegistration({ guest, onSubmit, onGuestChange }) {
  const dispatch = useDispatch();

  const onValuesChange = values => {
    console.log(values);
    dispatch(changeParams({ guest: values }));
  };

  return (
    <Formik
      initialValues={{
        ...guest,
      }}
      validate={validate}
      handleChange={e => {
        console.log(e);
      }}
    >
      <FormShowingServerErrors onValuesChange={onValuesChange} />
    </Formik>
  );
}

export default FormNoRegistration;

function FormShowingServerErrors({ onValuesChange }) {
  const registerError = useSelector(getRegisterError);
  const { setErrors, values } = useFormikContext();

  useEffect(() => {
    const filledValues = filterFalsyObjectKeys(values);
    onValuesChange(filledValues);
  }, [values, onValuesChange]);

  useEffect(() => {
    if (registerError) {
      setErrors(mapServerErrors(registerError));
    }
  }, [registerError, setErrors]);

  return (
    <FormikForm>
      {fields.map(field => (
        <FormikInput
          key={field.name}
          type={field.type}
          label={field.label}
          name={field.name}
        />
      ))}
    </FormikForm>
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

  return errors;
}
