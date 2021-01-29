import React from "react";

import Button from "../components/Button";
import Input from "../components/Input";

const fields = [
  { type: "text", label: "Имя", name: "firstName" },
  { type: "text", label: "Фамилия", name: "lastName" },
  { type: "email", label: "Email", name: "email" },
  { type: "tel", label: "Телефон", name: "tel" },
];

function FormNewGuest({ guest, onSubmit, onGuestChange }) {
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
        Зарегистрироваться
      </Button>
    </form>
  );
}

export default FormNewGuest;
