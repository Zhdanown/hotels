import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ColoredButton = styled.button`
  background-color: ${props => props.bgColor};
`;

function Button({ children, onClick }) {
  const config = useSelector(state => state.config);
  const primaryColor = config.hotel_style_config.primary_color;

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
