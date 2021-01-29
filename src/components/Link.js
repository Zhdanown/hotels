import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../reservation";

const Anchor = styled.a`
  color: green;
  text-decoration: underline;
`;

function Link({ href, children }) {
  const color = useSelector(getPrimaryColor);

  return (
    <Anchor color={color} href={href}>
      {children}
    </Anchor>
  );
}

export default Link;
