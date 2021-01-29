import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../reservation";

const InputContainer = styled.div`
  position: relative;
  margin: 20px 0 0;

  & input {
    width: 100%;
    height: 30px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${p => p.color};
    z-index: 1;
    position: relative;

    & + label {
      color: ${p => p.color};
      position: absolute;
      top: 5px;
      left: 3px;
      transition: all 0.2s ease-out;
    }

    &:focus {
      outline: none;
      border-width: 2px;
      border-color: ${p => p.color};
    }

    &:focus + label,
    &.has-value + label {
      top: -15px;
      font-size: 0.8rem;
      color: ${p => p.color};
      font-weight: bold;
    }

    &.has-value:not(:focus) + label {
      color: ${p => p.color};
    }
  }
`;

function Input({ type, label, name, value, onChange, ...props }) {
  const color = useSelector(getPrimaryColor);

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    onChange({ target: { name, value: inputValue } });
  }, [name, inputValue, onChange]);

  return (
    <InputContainer color={color}>
      <input
        style={props.inputStyles}
        className={value ? "has-value" : ""}
        type={type}
        name={name}
        id={name}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <label htmlFor="">{label}</label>
    </InputContainer>
  );
}

export default Input;

Input.defaultProps = {
  onChange: value => console.log(value),
};
