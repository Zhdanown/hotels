import { LeftOutlined } from "@ant-design/icons";
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { mediumMobileWidth } from "../Layout/MediaQueries";
import { getPrimaryColor, getHoverColor } from "../redux/hotelConfig";
import AntIcon from "@ant-design/icons";

const ColoredButton = styled.button<{
  bgColor: string;
  block?: boolean;
  outline?: boolean;
  hoverColor: string;
}>`
  background-color: ${props => props.bgColor};
  width: ${props => (props.block ? "100%" : "unset")};
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;

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
  color: ${p.bgColor};
  border: 1px solid  ${p.bgColor};
  &:hover {
    color: white;
  }`}

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 0.8rem;
  }<
`;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  small?: boolean;
  outline?: boolean;
  block?: boolean;
};

function Button({ children, onClick, disabled, style, ...props }: ButtonProps) {
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
      style={style}
      {...props}
    >
      {children}
    </ColoredButton>
  );
}

export default Button;

export function BackButton({
  children,
  outline,
  ...props
}: ButtonProps & {
  children: ReactNode;
  outline?: boolean;
}) {
  return (
    <Button small outline {...props}>
      <LeftOutlined />
      {children}
    </Button>
  );
}

export const ButtonWithIcon = ({
  Icon,
  children,
  ...props
}: ButtonProps & { Icon: typeof AntIcon }) => (
  <Button {...props}>
    <Icon style={{ marginRight: "0.5rem" }} />
    {children}
  </Button>
);
