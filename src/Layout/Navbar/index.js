import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import SPEED from "./MENU_SPEED";
import FullScreenMenu from "./FullScreenMenu";
import { getHotelName, getPrimaryColor } from "../../redux/hotelConfig";
import AuthNavButton, { NavbarLink } from "../../Auth/AuthNavButton";

const NavbarWrapper = styled.div`
  transform: translateY(0);
  ${p => p.mobile && `position: fixed;`}
  top: 0;
  width: 100%;
  z-index: 1;
  background: white;
`;

const NavbarContainer = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 0 7px 0 #dddddd;
  z-index: 1;
  justify-content: space-between;
  font-size: 1.4rem;
`;

const MenuIconStyles = css`
  font-size: 1.8rem;
  padding: 0.15rem;
  transition: opacity ${SPEED}s, transform ${SPEED}s;

  &:focus {
    outline: none;
  }
`;

const StyledMenuOutlined = styled(MenuOutlined)`
  ${MenuIconStyles}

  color: ${props => props.color};
  opacity: 1;
  transform: rotate(0);

  &:hover {
    color: ${p => p.color};
  }

  ${p =>
    p.open &&
    `
    opacity: 0;
    transform: rotate(135deg);
  `}
`;
const StyledCloseOutlined = styled(CloseOutlined)`
  ${MenuIconStyles}

  color: white;
  opacity: 0;
  transform: rotate(-135deg) scale(0);
  position: absolute;
  z-index: 11;
  top: 11px;
  left: 15px;

  &:hover {
    color: #363636;
  }

  ${p =>
    p.open &&
    `
    opacity: 1;
    transform: rotate(0) scale(1);
  `}
`;

const LogoTitle = styled.div`
  z-index: 11;
  color: ${p => (p.open ? "white" : "unset")};
  transition: color ${SPEED}s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default function Navbar() {
  const [isMenuOpen, toggleMenu] = useState(false);
  const hotelName = useSelector(getHotelName);
  const color = useSelector(getPrimaryColor);

  return (
    <>
      <NavbarWrapper>
        <NavbarContainer id="navbar">
          <LogoTitle open={isMenuOpen}>{hotelName}</LogoTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AuthNavButton />

            <NavbarLink as="button">
              <StyledMenuOutlined
                open={isMenuOpen}
                onClick={() => toggleMenu(true)}
                color={color}
              />
              <StyledCloseOutlined
                open={isMenuOpen}
                onClick={() => toggleMenu(false)}
              />
            </NavbarLink>
          </div>
        </NavbarContainer>
        <FullScreenMenu isOpen={isMenuOpen} close={() => toggleMenu(false)} />
      </NavbarWrapper>
    </>
  );
}
