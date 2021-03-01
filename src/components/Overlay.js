import React from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

import useNavbarHeight from "../Layout/hooks/useNavbarHeight";
import { useSelector } from "react-redux";
import { getPrimaryColor } from "../redux/hotelConfig";

const StyledOverlay = styled.div`
  position: absolute;
  top: ${p => p.offsetTop}px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const CloseIcon = styled(CloseOutlined)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: ${p => p.color};
  }
`;

function Overlay({ children, close }) {
  const navbarHeight = useNavbarHeight();
  const color = useSelector(getPrimaryColor);

  return (
    <StyledOverlay offsetTop={navbarHeight}>
      <CloseIcon onClick={close} color={color} />
      {children}
    </StyledOverlay>
  );
}

export default Overlay;
