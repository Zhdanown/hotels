import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../redux/hotelConfig";

const Anchor = styled.a`
  color: ${p => p.color};
  text-decoration: ${p => (p.underlined ? "underline" : "none")};
`;

function Link({ href, color, children, ...props }) {
  const primaryColor = useSelector(getPrimaryColor);

  return (
    <Anchor color={color || primaryColor} href={href} {...props}>
      {children}
    </Anchor>
  );
}

export default Link;
