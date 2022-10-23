import { EditOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button, { ButtonWithIcon } from "../components/Button";
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
  const code = params.promo_code;

  const [isInputShown, toggle] = useState(false);

  return (
    <div style={{ marginBottom: "2rem" }}>
      {!isInputShown ? (
        <Button small onClick={() => toggle(true)} style={{ maxWidth: '100%', overflowX: 'auto' }}>
          {!code ? "Ввести промокод" : `Промокод: ${code}`}
        </Button>
      ) : (
        <Formik
          initialValues={{ promo_code: code?.toUpperCase() }}
          validate={validate}
          onSubmit={values => {
            const { promo_code } = values;
            dispatch(changeParams({ promo_code }));
            toggle(false);
          }}
        >
          <Form id="promocode_form">
            <FormikInput type="text" label="Промокод" name="promo_code" autoFocus />
          </Form>
        </Formik>
      )}
    </div>
  );
}
