import { Form, Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { FormikInput, FormikSelect } from "../components/Input";
import {
  changeParams,
  getBlocks,
  getParams,
  setPromocodeError,
} from "../redux/booking";

type FormValues = {
  promo_code: string;
  promo_block: string;
};

const validate = (values: FormValues) => {
  const errors: { [P in keyof FormValues]?: string } = {};

  if (values.promo_code?.length < 7) {
    //errors.promo_code = "Длина должна быть не менее 7 символов";
    errors.promo_code = ''
  }

  if (!/^\d*$/.test(values.promo_code)) {
    // errors.promo_code = "Промокод должен содержать только цифры";
    errors.promo_code = ''
  }

  if (!values.promo_block) {
    errors.promo_block = "Это поле не может быть пустым"
  }

  return errors;
};

export default function Promocode() {
  const params = useSelector(getParams);
  const dispatch = useDispatch();
  const code = params.promo_code;

  const [isInputShown, toggle] = useState(false);

  const cancelPromocode = () => {
    toggle(false);
    dispatch(setPromocodeError(false));
    dispatch(changeParams({ promo_code: "", block: null }));
  };

  return (
    <div style={{ marginBottom: "2rem", textAlign: "center" }}>
      {!isInputShown ? (
        <Button
          small
          onClick={() => toggle(true)}
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          {!code ? "Ввести промокод" : `Промокод: ${code}`}
        </Button>
      ) : (
        <Formik
          initialValues={{ promo_code: code?.toUpperCase(), promo_block: "" }}
          validate={validate}
          onSubmit={values => {
            const { promo_code, promo_block } = values;
            dispatch(changeParams({ promo_code, promo_block }));
            toggle(false);
          }}
        >
          <>
            <Button small onClick={cancelPromocode}>
              Без промокода
            </Button>
            <Form2 />
          </>
        </Formik>
      )}
    </div>
  );
}

const Form2 = () => {
  const { isValid, values } = useFormikContext<FormValues>();

  const dispatch = useDispatch();

  const blocks = useSelector(getBlocks);

  useEffect(() => {
    dispatch(setPromocodeError(!isValid));

    if (!isValid) {
      dispatch(changeParams({ promo_code: "", block: null }));
      return;
    }

    const { promo_code, promo_block } = values;
    dispatch(changeParams({ promo_code, promo_block }));
  }, [isValid, values, dispatch]);

  return (
    <Form id="promocode_form">
      <FormikInput type="text" label="Промокод" name="promo_code" autoFocus />
      <FormikSelect name="promo_block" label="Территориальный банк" options={blocks} type="text" />
    </Form>
  );
};
