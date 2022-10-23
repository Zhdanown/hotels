import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormikInput } from "../components/Input";
import { changeParams, getParams } from "../redux/booking";

type FormValues = {
  promo_code: string;
};

const validate = (values: FormValues) => {
  const errors: { [P in keyof FormValues]?: string } = {};

  if (values.promo_code?.length < 7) {
    errors.promo_code = "Длина должна быть не менее 7 символов";
  }

  if (!/^\d*$/.test(values.promo_code)) {
    errors.promo_code = "Промокод должен содержать только цифры";
  }

  return errors;
};

export default function Promocode() {
  const params = useSelector(getParams);
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ promo_code: params.promo_code?.toUpperCase() }}
      validate={validate}
      onSubmit={values => {
        const { promo_code } = values;
        dispatch(changeParams({ promo_code }));
      }}
    >
      <Form id="promocode_form">
        <FormikInput
          type="text"
          label="Промокод"
          name="promo_code"
          style={{ marginBottom: "1rem" }}
        />
      </Form>
    </Formik>
  );
}
