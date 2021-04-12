import React from "react";
import styled from "styled-components";

export const Greetings = ({ children }) => (
  <h3 className="has-text-centered is-size-4">{children}</h3>
);

export const Form = styled.form`
  width: 350px;
  max-width: 90%;
`;

export const FormTitle = ({ children }) => (
  <h3 className="is-size-4 has-text-centered">{children}</h3>
);
