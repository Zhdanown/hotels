import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/Button";
import Loader from "../components/Loader";
import InputWithError, { Error } from "../components/InputWithError";
import { getIsLoginPending, getLoginError, getUser } from "./authReducer";
import { login } from "./authReducer";

const fields = [
  { type: "text", label: "Логин", name: "username" },
  { type: "password", label: "Пароль", name: "password" },
];

export default function LoginForm({ onSubmit, close }) {
  const user = useSelector(getUser);
  const isPending = useSelector(getIsLoginPending);
  const loginError = useSelector(getLoginError);

  const [guest, setGuest] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    let timeout;
    if (user) {
      timeout = setTimeout(close, 1500);
    }
    return () => clearTimeout(timeout);
  }, [user, close]);

  const onGuestChange = useCallback(({ target }) => {
    setGuest(user => ({
      ...user,
      [target.name]: target.value,
    }));
  }, []);

  const dispatch = useDispatch();

  const loginUser = e => {
    e.preventDefault();
    dispatch(login(guest));
  };

  if (user) {
    return <Greetings name={user.first_name} />;
  }

  return (
    <form action="" onSubmit={onSubmit} style={{ width: 250 }}>
      <h3 className="is-size-4 has-text-centered">Авторизация</h3>
      {fields.map(field => (
        <div key={field.name} style={{ margin: "1.5rem 0" }}>
          <InputWithError
            type={field.type}
            label={field.label}
            name={field.name}
            value={guest[field.name]}
            onChange={onGuestChange}
            error={loginError}
          />
        </div>
      ))}

      {loginError && loginError.non_field_errors ? (
        <Error style={{ margin: "1rem", textAlign: "center" }}>
          {loginError.non_field_errors}
        </Error>
      ) : null}
      {isPending ? (
        <div className="has-text-centered">
          <Loader />
        </div>
      ) : null}
      {!user && !isPending && (
        <Button block type="submit" onClick={loginUser}>
          Войти
        </Button>
      )}
    </form>
  );
}

const Greetings = ({ name }) => (
  <h3 className="has-text-centered is-size-4">
    Добро пожаловать, <br />
    {name}!
  </h3>
);
