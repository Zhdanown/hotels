import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";

const fields = [
  { type: "text", label: "Имя", name: "firstName" },
  { type: "text", label: "Фамилия", name: "lastName" },
  { type: "email", label: "Email", name: "email" },
  { type: "tel", label: "Телефон", name: "tel" },
  
];

function FormNoRegistration({ guest, onSubmit, onGuestChange }) {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, i) => (
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
      <Button block type="submit">Продолжить</Button>
    </form>
  );
}

export default FormNoRegistration;
