import React from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Centered } from "../components/Centered";
import CustomLink from "../components/Link";


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

export const AuthLink = ({ to, children }) => {
  let {
    params: { slug },
  } = useRouteMatch();

  return (
    <Centered style={{ marginTop: "1rem" }}>
      <CustomLink as={Link} to={`/${slug}${to}`}>
        {children}
      </CustomLink>
    </Centered>
  );
};
