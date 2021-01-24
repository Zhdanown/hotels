import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor, getHoverColor } from "../reservation";

const ColoredButton = styled.button`
  background-color: ${props => props.bgColor};
  width: ${props => (props.block ? "100%" : "unset")};
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background .2s, opacity .2s;

  &:hover {
    background: ${props => props.hoverColor}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Button({ children, onClick, disabled, ...props }) {
  const primaryColor = useSelector(getPrimaryColor);
  const hoverColor = useSelector(getHoverColor)

  return (
    <ColoredButton
      type="button"
      // className={"button" + (props.small ? ' is-small' : '')}
      bgColor={primaryColor}
      hoverColor={hoverColor}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </ColoredButton>
  );
}

export default Button;
