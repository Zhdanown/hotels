import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import SPEED from "./MENU_SPEED";
import FullScreenMenu from "./FullScreenMenu";
import { getHotelName, getPrimaryColor } from "../../redux/hotelConfig";

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
  font-size 1.4rem;
`;

const StyledMenuOutlined = styled(MenuOutlined)`
  opacity: 1;
  transform: rotate(0);
  &:hover {
    color: ${p => p.color};
  }
`;
const StyledCloseOutlined = styled(CloseOutlined)`
  color: white;
  opacity: 0;
  transform: rotate(-135deg) scale(0);
  &:hover {
    color: #363636;
  }
`;

const MenuIcon = styled.span`
  z-index: 11;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  ${StyledMenuOutlined}, ${StyledCloseOutlined} {
    position: absolute;
    right: 0;
    top: -10px;
    transition: opacity ${SPEED}s, transform ${SPEED}s;

    &:focus {
      outline: none;
    }
  }

  ${p =>
    p.open &&
    `
    ${StyledMenuOutlined} {
      opacity: 0;
      transform: rotate(135deg);
    }
    ${StyledCloseOutlined} {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    `}
`;

const LogoTitle = styled.div`
  z-index: 11;
  color: ${p => (p.open ? "white" : "unset")};
  transition: color ${SPEED}s;
`;

export default function Navbar() {
  const [isMenuOpen, toggleMenu] = useState(false);
  const hotelName = useSelector(getHotelName);
  const color = useSelector(getPrimaryColor);

  const openMenu = () => {
    toggleMenu(state => !state);
  };

  return (
    <NavbarWrapper>
      <NavbarContainer id="navbar">
        <LogoTitle open={isMenuOpen}>{hotelName}</LogoTitle>
        <MenuIcon open={isMenuOpen}>
          <StyledMenuOutlined onClick={openMenu} color={color} />
          <StyledCloseOutlined onClick={openMenu} />
        </MenuIcon>
      </NavbarContainer>
      <FullScreenMenu open={isMenuOpen} />
    </NavbarWrapper>
  );
}
