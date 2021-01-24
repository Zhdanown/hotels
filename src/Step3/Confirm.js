import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  submitOrder,
  getRoom,
  getRate,
  getBookingState,
  getBookingResponse,
} from "../reservation";
import Modal from "../components/Modal";
import FormNewGuest from "./FormNewGuest";
import FormHasAccount from "./FormHasAccount";
import Button from "../components/Button";
import FormNoRegistration from "./FormNoRegistration";

const fields = [
  { type: "text", label: "Имя", name: "firstName" },
  { type: "text", label: "Фамилия", name: "lastName" },
  { type: "email", label: "Email", name: "email" },
  { type: "text", label: "Телефон", name: "tel" },
];

const forms = [
  { id: "have-account", label: "Есть аккаунт" },
  { id: "new-guest", label: "Новый гость" },
  { id: "no-registration", label: "Без регистрации" },
];

function Confirm() {
  const dispatch = useDispatch();

  const room = useSelector(getRoom);
  const rate = useSelector(getRate);
  const isBooking = useSelector(getBookingState);

  const [curForm, setForm] = useState(forms[2]);
  const [modal, setModal] = useState(false);

  const [guest, setGuest] = useState({
    firstName: "John",
    lastName: "McClane",
    email: "die@hard.com",
    tel: "555-911",
  });

  const onGuestChange = ({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    // dispatch(submitOrder(guest));
    console.log("Book room", guest);
  };

  const selectForm = formName => {
    setForm(formName);
  };

  const openModal = () => {
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

        <div className="buttons has-addons is-centered mt-4">
          {forms.map(form => (
            <button
              key={form.id}
              className={
                "button is-small" +
                (curForm.id === form.id ? " is-selected is-success" : "")
              }
              onClick={() => selectForm(form)}
            >
              {form.label}
            </button>
          ))}
        </div>

        {curForm.id === "new-guest" && (
          <FormNewGuest
            guest={guest}
            onSubmit={onSubmit}
            onGuestChange={onGuestChange}
          />
        )}

        {curForm.id === "have-account" && (
          <FormHasAccount
            guest={guest}
            onSubmit={onSubmit}
            onGuestChange={onGuestChange}
          />
        )}
        {curForm.id === "no-registration" && (
          <FormNoRegistration
            guest={guest}
            onSubmit={onSubmit}
            onGuestChange={onGuestChange}
          />
        )}
        <div className="mt-6" style={{ textAlign: "center" }}>
          <Button block onClick={openModal}>
            Продолжить
          </Button>
        </div>

        <Modal open={modal} toggle={setModal}>
          <h1 className="is-size-4">Варианты бронирования</h1>
          <div className="mt-3">
            <Button block>Оплатить картой</Button>
          </div>

          <div className="mt-3">
            <Button block>Забронировать</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Confirm;
