import React from "react";
import styled from "styled-components";
import Input from "./Input";

export const Error = styled.p`
  font-size: 0.75rem;
  color: red;
`;

function InputWithError({ error, ...props }) {
  return (
    <>
      <Input {...props} />
      {error && error[props.name] ? <Error>{error[props.name]}</Error> : null}
    </>
  );
}

export default InputWithError;
