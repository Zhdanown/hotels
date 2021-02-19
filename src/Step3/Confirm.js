import React, { useCallback, useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  getRoom,
  getRate,
  getBookingState,
  getBookingResponse,
} from "../redux/booking";
import { changeParams } from "../redux/booking";
import FormNewGuest from "./FormNewGuest";
import FormHasAccount from "./FormHasAccount";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";
import Tabs from "../components/Tabs";
import Link from "../components/Link";
import Modal from "../components/Modal";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import FloatingButton from "../components/FloatingButton";
import LayoutContext from "../Layout/LayoutContext";
import useWindowWidth from "../Layout/hooks/useWindowWidth";
import { Centered } from "../components/Centered";
import Input from "../components/Input";

const forms = [
  {
    id: "have-account",
    label: "Есть аккаунт",
    render: props => <FormHasAccount {...props} />,
  },
  {
    id: "new-guest",
    label: "Новый гость",
    render: props => <FormNewGuest {...props} />,
  },
  {
    id: "no-registration",
    label: "Без регистрации",
    render: props => <FormNoRegistration {...props} />,
  },
];

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function Confirm() {
  const dispatch = useDispatch();
  const room = useSelector(getRoom);
  const rate = useSelector(getRate);
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);

  const [modal, setModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const [guest, setGuest] = useState({
    firstName: "John",
    lastName: "McClane",
    email: "die@hard.com",
    tel: "555-911",
    login: "",
    password: "",
    password2: "",
    comment: "",
  });

  const onGuestChange = useCallback(({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    dispatch(changeParams({ guest }));
    setModal(true);
  };

  useEffect(() => {
    if (bookingResponse) {
      setModal(false);
    }
  }, [bookingResponse]);

  const { setStep } = useContext(LayoutContext);

  const goBack = () => {
    setStep(step => --step);
  };
  const [, , isDesktop] = useWindowWidth();

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  } else if (bookingResponse) {
    return <h4>Выполняется переадресация...</h4>;
  } else {
    return (
      <div>
        <ColumnHeader goBack={goBack}>Оплата</ColumnHeader>
        {room && (
          <div style={{ textAlign: "left" }}>
            <span>{room.name.toUpperCase()}</span>
            {rate && <p>{rate.short_description}</p>}
          </div>
        )}

        <Tabs
          tabs={forms}
          preSelected={2}
          guest={guest}
          onSubmit={onSubmit}
          onGuestChange={onGuestChange}
        />

        <Input
          type="text"
          label="Комментарий"
          name="comment"
          value={guest.comment}
          onChange={onGuestChange}
        />

        <Conditions column>
          <Link href="#" underlined>
            Правила и услуги
          </Link>
        </Conditions>

        <input
          type="checkbox"
          name="consent"
          id="consent"
          value={consent}
          onChange={() => setConsent(x => !x)}
        />
        <label htmlFor="consent">
          Я подтверждаю своё согласие с Политикой в отношении обработки
          персональных данныx
        </label>

        {isDesktop ? (
          <Button block onClick={onSubmit}>
            Продолжить
          </Button>
        ) : (
          <FloatingButton onClick={onSubmit} disabled={!consent}>
            {consent ? "Продолжить" : "Необходимо согласие"}
          </FloatingButton>
        )}

        <Modal open={modal} toggle={setModal}>
          <PaymentOptions />
        </Modal>
      </div>
    );
  }
}

export default Confirm;
