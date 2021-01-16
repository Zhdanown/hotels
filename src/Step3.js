import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  submitOrder,
  getRoom,
  getRate,
  getBookingState,
  getBookingResponse,
} from "./reservation";

function Step3() {
  const dispatch = useDispatch();

  const room = useSelector(getRoom);
  const rate = useSelector(getRate);
  const isBooking = useSelector(getBookingState);
  const bookingResponse = useSelector(getBookingResponse);

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
  });

  const onGuestChange = ({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  };

  const onSubmit = e => {
    e.preventDefault();
    dispatch(submitOrder(guest));
    console.log("Book room", guest);
  };

  if (isBooking) {
    return <h4>Идёт обработка заказа...</h4>;
  } else if (bookingResponse) {
    const { guest_num, profile, room, rate } = bookingResponse;
    return (
      <div>
        <p>
          Номер гостя: <b>{guest_num}</b>
        </p>
        <p>
          ID профиля: <b>{profile}</b>
        </p>
        <p>
          Код Номер: <b>{room}</b>
        </p>
        <p>
          Код тарифа: <b>{rate}</b>
        </p>
      </div>
    );
  }

  const fields = [
    { type: "text", label: "Имя", name: "firstName" },
    { type: "text", label: "Фамилия", name: "lastName" },
    { type: "email", label: "Email", name: "email" },
    { type: "text", label: "Телефон", name: "tel" },
  ];

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

        <button type="submit">Забронировать</button>
      </form>
    </div>
  );
}

export default Step3;

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
