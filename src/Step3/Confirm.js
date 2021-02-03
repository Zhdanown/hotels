import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRoom,
  getRate,
  getBookingState,
  changeParams,
} from "../reservation";
import Modal from "../components/Modal";
import FormNewGuest from "./FormNewGuest";
import FormHasAccount from "./FormHasAccount";
import FormNoRegistration from "./FormNoRegistration";
import PaymentOptions from "./PaymentOptions";

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

  const selectForm = formName => {
    setForm(formName);
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

        <Modal open={modal} toggle={setModal}>
          <PaymentOptions />
        </Modal>
      </div>
    );
  }
}

export default Confirm;
