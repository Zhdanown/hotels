import { LeftOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor, getHoverColor } from "../redux/hotelConfig";

const ColoredButton = styled.button`
  background-color: ${props => props.bgColor};
  width: ${props => (props.block ? "100%" : "unset")};
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;

  &.small {
    padding: 0.25rem 0.5rem;
  }

  &:hover {
    background: ${props => props.hoverColor};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${p =>
    p.outline &&
    `
  background: none;
  color: green;
  border: 1px solid green;
  &:hover {
    color: white;
  }`}
`;

function Button({ children, onClick, disabled, ...props }) {
  const primaryColor = useSelector(getPrimaryColor);
  const hoverColor = useSelector(getHoverColor);

  return (
    <ColoredButton
      type="button"
      className={props.small ? "small" : ""}
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

export function BackButton({ children, ...props }) {
  return (
    <Button small outline {...props}>
      <LeftOutlined />
      {children}
    </Button>
  );
}
