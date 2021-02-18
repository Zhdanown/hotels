import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { getPrimaryColor } from "../redux/hotelConfig";

const SPEED = 0.4 // in seconds

const InputContainer = styled.div`
  position: relative;
  height: 2rem;
`;

const LabelContainer = styled.div`
  position: absolute;
  bottom: 100%;
  width: 100%;
  overflow: hidden;
  height: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  border: 1px solid ${p => p.color};
  border-radius: 3px;

  &::placeholder {
    transition: transform ${SPEED}s;
  }

  &:focus {
    outline: none;
    border-width: 2px;

    &::placeholder {
      transform: translateY(-25px);
    }
  }
`;

const Label = styled.label`
  position: absolute;
  left: 0;
  top: 100%;
  color: ${p => p.color};
  font-size: 0.8rem;
  transition: top ${SPEED}s;

  ${StyledInput}:focus + ${LabelContainer} > & {
    top: -2px;
  }
  ${p => p.hasValue && `top: -2px;`}
`;

function Input({ type, label, name, value, onChange, ...props }) {
  const color = useSelector(getPrimaryColor);

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    onChange({ target: { name, value: inputValue } });
  }, [name, inputValue, onChange]);

  return (
    <InputContainer color={color}>
      <StyledInput
        style={props.inputStyles}
        placeholder={label}
        color={color}
        type={type}
        name={name}
        id={name}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <LabelContainer>
        <Label color={color} hasValue={value}>
          {label}
        </Label>
      </LabelContainer>
    </InputContainer>
  );
}

export default Input;

Input.defaultProps = {
  onChange: value => console.log(value),
};
