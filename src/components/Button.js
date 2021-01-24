import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../reservation";

const ColoredButton = styled.button`
  background-color: ${props => props.bgColor};
  width: ${props => props.block ? '100%' : 'unset'}
`;

function Button({ children, onClick, ...props }) {
  const primaryColor = useSelector(getPrimaryColor);

  return (
    <ColoredButton
      type="button"
      className={"button" + (props.small ? ' is-small' : '')}
      bgColor={primaryColor}
      onClick={onClick}
      {...props}
    >
      {children}
    </ColoredButton>
  );
}

export default Button;
