import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  submitOrder,
  getRoom,
  getRate,
  getBookingState,
  getBookingResponse,
} from "../reservation";

const fields = [
  { type: "text", label: "Имя", name: "firstName" },
  { type: "text", label: "Фамилия", name: "lastName" },
  { type: "email", label: "Email", name: "email" },
  { type: "text", label: "Телефон", name: "tel" },
];

function Confirm() {
  const dispatch = useDispatch();

  const room = useSelector(getRoom);
  const rate = useSelector(getRate);
  const isBooking = useSelector(getBookingState);

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
        <form action="" onSubmit={onSubmit}>
          {fields.map(field => (
            <InputField
              key={field.name}
              type={field.type}
              label={field.label}
              name={field.name}
              value={guest[field.name]}
              onChange={onGuestChange}
            />
          ))}

          <button type="submit">Продолжить</button>
        </form>
      </div>
    );
  }
}

export default Confirm;

function InputField({ type, label, name, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: ".5rem",
      }}
    >
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
