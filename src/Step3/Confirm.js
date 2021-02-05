import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRoom,
  getRate,
  getBookingState,
  changeParams,
} from "../reservation";
import Tabs from "../components/Tabs";
import Modal from "../components/Modal";
import FormNewGuest from "./FormNewGuest";
import FormHasAccount from "./FormHasAccount";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";

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

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  } else {
    return (
      <div>
        <h3>Подтверждение бронирования</h3>
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
