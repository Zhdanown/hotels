import React from "react";
import Input, { Error } from "./Input";

function InputWithError({ error, ...props }) {
  return (
    <>
      <Input {...props} />
      {error && error[props.name] ? <Error>{error[props.name]}</Error> : null}
    </>
  );
}

export default InputWithError;
