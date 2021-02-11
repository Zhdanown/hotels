import React, { useState } from "react";
import { Collapse } from "react-collapse";
import styled, { createGlobalStyle } from "styled-components";

import { CaretDownFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getPrimaryColor } from "../redux/hotelConfig";

const SPEED = 500;

const Transition = createGlobalStyle`
  .ReactCollapse--collapse {
    transition: height ${SPEED}ms;
  }
`;

export default function Accordion({
  children,
  opened = false,
  renderTitle,
  renderTitleAfter,
}) {
  const [isOpened, setIsOpened] = useState(opened);
  const toggle = () => {
    setIsOpened(state => !state);
  };

  return (
    <>
      <Transition />
      {renderTitle && renderTitle(toggle, isOpened)}
      <Collapse isOpened={isOpened}>{children}</Collapse>
      {renderTitleAfter && renderTitleAfter(toggle, isOpened)}
    </>
  );
}

const StyledTitle = styled.p`
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    color: ${p => p.color};
  }
`;

export const Title = ({ children, ...props }) => {
  const color = useSelector(getPrimaryColor);
  return (
    <StyledTitle color={color} {...props}>
      {children}
    </StyledTitle>
  );
};

export const Icon = styled(CaretDownFilled)`
  margin-left: 0.5rem;
  transition: transform ${SPEED}ms ease;
  ${p => (p.open ? "transform: rotate(180deg);" : "")}
`;
