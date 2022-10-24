import React, { useEffect } from "react";
import { FormikInput } from "../components/Input";
import { Formik, Form as FormikForm, useFormikContext } from "formik";

import userFields from "./userFields";
import { useDispatch, useSelector } from "react-redux";
import { getRegisterError, getUser } from "../Auth/authReducer";
import {
  emailIsValid,
  filterFalsyObjectKeys,
  mapServerErrors,
  phoneIsValid,
} from "../utils/validationHelpers";
import { changeParams } from "../redux/booking";
import { Guest } from "./types";

function filterByFieldName(fields: typeof userFields) {
  return fields.filter(x => fieldNames.includes(x.name));
}

const fieldNames = ["email", "phone"];
const fields = filterByFieldName(userFields);

type SberFormProps = {
  guest: Guest;
  onSubmit: (values: { [k: string]: unknown }) => void;
};

function SberForm({ guest, onSubmit }: SberFormProps) {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const { email, phone } = user || {};

  return (
    <Formik
      initialValues={{ ...guest, email, phone }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(changeParams({ guest: values }));
        const filledInValues = filterFalsyObjectKeys(values);
        onSubmit(filledInValues);
        setSubmitting(false);
      }}
    >
      <FormShowingServerErrors user={user} />
    </Formik>
  );
}

export default SberForm;

function FormShowingServerErrors({ user }: { user: Guest }) {
  const registerError = useSelector(getRegisterError);
  const { setErrors, values, isValid } =
    useFormikContext<Guest>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isValid) {
      dispatch(changeParams({ guest: { phone: null, email: null } }));
      return;
    }

    const { first_name, last_name } = user || {};

    dispatch(changeParams({ guest: { ...values, first_name, last_name  } }));
  }, [isValid, values, user, dispatch]);

  useEffect(() => {
    if (registerError) {
      setErrors(mapServerErrors(registerError));
    }
  }, [registerError, setErrors]);

  return (
    <FormikForm id="no-registration">
      {fields.map(field => (
        <FormikInput key={field.name} {...field} />
      ))}
    </FormikForm>
  );
}

function validate(values: Guest) {
  const errors: Partial<Guest> = {};

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
