import React, { useCallback, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Link from "./Link";

const fields = [
  { type: "text", label: "Логин", name: "login" },
  { type: "password", label: "Пароль", name: "password" },
];

export default function LoginForm({ onSubmit }) {
  const [guest, setGuest] = useState({
    login: "",
    password: "",
  });

  const onGuestChange = useCallback(({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  }, []);

  return (
    <form action="" onSubmit={onSubmit}>
      <h3 className="is-size-4 has-text-centered">Авторизация</h3>
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
      <div className="mt-4">
        Не зарегистрированы? <Link underlined>Создать аккаунт</Link>
      </div>
    </form>
  );
}
