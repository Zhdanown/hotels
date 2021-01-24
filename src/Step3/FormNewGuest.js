import React from "react";
import Button from "../components/Button";
import InputField from './InputField'

const fields = [
    { type: "text", label: "Имя", name: "firstName" },
    { type: "text", label: "Фамилия", name: "lastName" },
    { type: "email", label: "Email", name: "email" },
    { type: "text", label: "Телефон", name: "tel" },
  ];

function FormNewGuest({ guest, onSubmit, onGuestChange }) {
  return (
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
      <Button block type="submit">Зарегистрироваться</Button>
    </form>
  );
}

export default FormNewGuest;
