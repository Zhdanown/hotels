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
} from "../utils/validationHelpers";
import { changeParams, getBlocks } from "../redux/booking";
import { Select } from "../components/Select";

function filterByFieldName(fields) {
  return fields.filter(x => fieldNames.includes(x.name));
}

const fieldNames = ["first_name", "last_name", "email", "phone"];
const fields = filterByFieldName(userFields);

function FormNoRegistration({ guest, onSubmit }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        ...guest,
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        const { block, ...guest } = values;

        dispatch(changeParams({ guest, block }));
        const filledInValues = filterFalsyObjectKeys(guest);
        onSubmit(filledInValues);
        setSubmitting(false);
      }}
    >
      <FormShowingServerErrors />
    </Formik>
  );
}

export default FormNoRegistration;

function FormShowingServerErrors() {
  const registerError = useSelector(getRegisterError);
  const { setErrors, setFieldValue, values } = useFormikContext();
  const blocks = useSelector(getBlocks);

  useEffect(() => {
    if (registerError) {
      setErrors(mapServerErrors(registerError));
    }
  }, [registerError, setErrors]);

  const onBlockChange = id => {
    setFieldValue("block", id.id);
  };

  return (
    <FormikForm id="no-registration">
      <div style={{ margin: "1.5rem 0" }}>
        <Select options={blocks} value={values?.block} onChange={onBlockChange} label="Блок"/>
        {/* <Input {...field} {...props} /> */}
        {/* {touched && error ? <Error>{error}</Error> : null} */}
      </div>
      {fields.map(field => (
        <FormikInput key={field.name} {...field} />
      ))}
    </FormikForm>
  );
}

function validate(values) {
  const errors = {};

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
