import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRoom,
  getRate,
  getBookingState,
  getBookingResponse,
} from "../redux/booking";
import { changeParams } from "../redux/booking";

import Tabs from "../components/Tabs";
import Modal from "../components/Modal";
import PaymentOptions from "./PaymentOptions";

import FormNewGuest from "./FormNewGuest";
import FormHasAccount from "./FormHasAccount";
import FormNoRegistration from "./FormNoRegistration";
import ColumnHeader from "../components/ColumnHeader";
import { useContext } from "react";
import LayoutContext from "../Layout/LayoutContext";

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

function Confirm() {
  const dispatch = useDispatch();
  const room = useSelector(getRoom);
  const rate = useSelector(getRate);
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);

  const [modal, setModal] = useState(false);

  const [guest, setGuest] = useState({
    firstName: "John",
    lastName: "McClane",
    email: "die@hard.com",
    tel: "555-911",
    login: "",
    password: "",
    password2: "",
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

        <Modal open={modal} toggle={setModal}>
          <PaymentOptions />
        </Modal>
      </div>
    );
  }
}

export default Confirm;
