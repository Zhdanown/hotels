import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useField } from "formik";

import { getPrimaryColor } from "../redux/hotelConfig";

function Input({ type, label, name, value, onChange, onBlur, ...props }) {
  const color = useSelector(getPrimaryColor);

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    onChange({ target: { name, value: inputValue } });
  }, [name, inputValue, onChange]);

  const isTextarea = type === "textarea";

  return (
    <InputContainer color={color} style={props.style} textarea={isTextarea}>
      <StyledInput
        {...(isTextarea ? { as: "textarea" } : {})}
        style={props.inputStyles}
        placeholder={label}
        color={color}
        type={type}
        name={name}
        id={name}
        value={inputValue}
        onBlur={onBlur}
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
  onChange: value => {},
};

export const FormikInput = props => {
  const [field, meta] = useField(props);
  const { error, touched } = meta;

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <Input {...field} {...props} />
      {touched && error ? <Error>{error}</Error> : null}
    </div>
  );
};

export const Error = styled.p`
  white-space: pre-line;
  ${({ discreet = false }) =>
    !discreet &&
    `  
  font-size: 0.75rem;
  color: red;
  `}
`;

const SPEED = 0.4; // in seconds

const InputContainer = styled.div`
  position: relative;
  height: ${p => (p.textarea ? "5rem" : "2rem")};
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
  resize: none;

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
