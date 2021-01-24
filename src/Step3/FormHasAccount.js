import React from "react";
import Button from "../components/Button";
import InputField from './InputField'

const fields = [
    { type: "text", label: "Логин", name: "login" },
    { type: "password", label: "Пароль", name: "password" },
  ];

function FormHasAccount({ guest, onSubmit, onGuestChange }) {
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
      <Button block type="submit">Войти</Button>
    </form>
  );
}

export default FormHasAccount;
