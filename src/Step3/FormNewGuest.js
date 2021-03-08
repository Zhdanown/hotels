import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../components/Button";
import InputWithError from "../components/InputWithError";
import userFields from "./userFields";
import Loader from "../components/Loader";
import {
  getIsRegistrationPending,
  getRegisterError,
} from "../Auth/authReducer";
import { register } from "../Auth/authReducer";

function FormNewGuest({ guest, onSubmit, onGuestChange }) {
  const dispatch = useDispatch();

  const registerError = useSelector(getRegisterError);
  const isPending = useSelector(getIsRegistrationPending);

  const registerUser = e => {
    e.preventDefault();

    const bodyRequest = {
      ...guest,
    };

    dispatch(register(bodyRequest));
  };

  return (
    <form action="" onSubmit={onSubmit}>
      {userFields.map(field => (
        <div key={field.name} style={{ margin: "1.5rem 0" }}>
          <InputWithError
            type={field.type}
            label={field.label}
            name={field.name}
            value={guest[field.name]}
            onChange={onGuestChange}
            error={registerError}
          />
        </div>
      ))}
      {isPending ? (
        <div className="has-text-centered">
          <Loader />
        </div>
      ) : null}
      <Button block type="submit" onClick={registerUser}>
        Зарегистрироваться
      </Button>
    </form>
  );
}

export default FormNewGuest;
