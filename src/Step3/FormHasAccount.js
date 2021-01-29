import React from "react";

import Button from "../components/Button";
import Input from "../components/Input";

const fields = [
  { type: "text", label: "Логин", name: "login" },
  { type: "password", label: "Пароль", name: "password" },
];

function FormHasAccount({ guest, onSubmit, onGuestChange }) {
  return (
    <form action="" onSubmit={onSubmit}>
      {fields.map(field => (
        <div key={field.name} style={{ margin: "1.5rem 0" }}>
          <Input
            type={field.type}
            label={field.label}
            name={field.name}
            value={guest[field.name]}
            onChange={onGuestChange}
          />
        </div>
      ))}
      <Button block type="submit">
        Войти
      </Button>
    </form>
  );
}

export default FormHasAccount;
