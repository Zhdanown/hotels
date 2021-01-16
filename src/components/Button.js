import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../reservation";

const ColoredButton = styled.button`
  background-color: ${props => props.bgColor};
`;

function Button({ children, onClick }) {
  const primaryColor = useSelector(getPrimaryColor);

  return (
    <ColoredButton
      type="button"
      className="btn"
      bgColor={primaryColor}
      onClick={onClick}
    >
      {children}
    </ColoredButton>
  );
}

export default Button;
