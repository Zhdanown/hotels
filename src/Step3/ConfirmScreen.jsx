import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  getBookingState,
  getBookingResponse,
  getParams,
  changeParams,
} from "../redux/booking";
import { getRulesAndServicesFileReference } from "../redux/hotelConfig";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";
import Link from "../components/Link";
import Modal from "../components/Modal";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import LayoutContext from "../Layout/LayoutContext";
import { Centered } from "../components/Centered";
import Input from "../components/Input";
import OrderSummary from "./OrderSummary";
import { getUser } from "../Auth/authReducer";
import { AuthLink } from "../Auth/components";

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function ConfirmScreen() {
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);
  const rulesAndServicesFile = useSelector(getRulesAndServicesFileReference);
  const user = useSelector(getUser);

  const [modal, setModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const [guest] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    date_of_birth: null,
    is_hotel_guest: true,
    password: "",
    password_confirm: "",
  });

  const onSubmit = () => {
    setModal(true);
  };

  useEffect(() => {
    if (bookingResponse) {
      setModal(false);
    }
  }, [bookingResponse]);

  const { setStep } = useContext(LayoutContext);

  const goBack = () => {
    setStep(step => step - 1);
  };

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  }
  if (bookingResponse) {
    return <h4>Выполняется переадресация...</h4>;
  }

  return (
    <div>
      <ColumnHeader goBack={goBack}>Оплата</ColumnHeader>
      <OrderSummary />

      {!user && (
        <>
          <span htmlFor="">Забронировать без регистрации</span>
          <FormNoRegistration guest={guest} onSubmit={onSubmit} />
          <div>
            <span htmlFor="">Или</span>
            <AuthLink style={{ marginTop: 0 }} to="/register">
              зарегистрироваться
            </AuthLink>
          </div>
        </>
      )}

      <CommentField />

      <Conditions column>
        <Link href={rulesAndServicesFile} target="_blank" underlined>
          Правила и услуги
        </Link>
      </Conditions>

      <span className="checkbox">
        <input
          type="checkbox"
          name="consent"
          id="consent"
          value={consent}
          onChange={() => setConsent(x => !x)}
          style={{ marginRight: ".5rem" }}
        />
        Я подтверждаю своё согласие с{" "}
        <Link href="/privacy-policy">Политикой в отношении обработки персональных данныx</Link>
      </span>

      <SubmitButton
        user={user}
        consent={consent}
        onSubmit={onSubmit}
        style={{ marginBottom: "1rem" }}
      >
        {consent ? "Продолжить" : "Необходимо согласие"}
      </SubmitButton>

      <Modal open={modal} toggle={setModal}>
        <PaymentOptions />
      </Modal>
    </div>
  );
}

export default ConfirmScreen;

function CommentField() {
  const params = useSelector(getParams);
  const [comment, setComment] = useState(params.comment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeParams({ comment }));
  }, [comment, dispatch]);

  return (
    <Input
      type="textarea"
      label="Комментарий к заказу"
      name="comment"
      value={comment}
      onChange={({ target }) => setComment(target.value)}
      style={{ marginTop: "2rem" }}
    />
  );
}

function SubmitButton({ user, children, onSubmit, consent, style }) {
  return !user ? (
    <Button
      block
      disabled={!consent}
      style={style}
      type="submit"
      form="no-registration"
    >
      {children}
    </Button>
  ) : (
    <Button block disabled={!consent} onClick={onSubmit} style={style}>
      {children}
    </Button>
  );
}
