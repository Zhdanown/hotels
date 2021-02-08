import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import SPEED from "./MENU_SPEED";
import useWindowWidth from "../hooks/useWindowWidth";
import Link from "../../components/Link";
import { Centered } from "../../components/Centered";
import { getMenuItems, getPrimaryColor } from "../../reservation";

const Backdrop = styled.div`
  position: fixed;
  width: ${p => p.diameter}px;
  height: ${p => p.diameter}px;
  top: -${p => p.diameter / 2}px;
  right: -${p => p.diameter / 2}px;
  border-radius: 50%;
  z-index: 10;
  background: ${p => p.color};
  opacity: 0.8;
  transform: scale(${p => (p.open ? 1 : 0)});
  transition: transform ${SPEED}s;
`;

const MenuWrapper = styled(Centered)`
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  color: white;
  font-size: 1.8rem;
  opacity: 0;
  transform: scale(0);
  transition: transform 0s, opacity ${SPEED}s ${SPEED / 2}s;

  ${p =>
    p.open &&
    `
  transform: scale(1);
  opacity: 1;
  `}
`;

const LinksWrapper = styled(Centered)`
  align-items: flex-start;
`;

export default function FullScreenMenu({ open }) {
  const color = useSelector(getPrimaryColor);
  const menuItems = useSelector(getMenuItems);
  const [w, h] = useWindowWidth();
  const r = Math.ceil(Math.sqrt(w ** 2 + h ** 2));
  const diameter = 2 * r;

  return (
    <>
      <Backdrop diameter={diameter} open={open} color={color} />
      <MenuWrapper open={open}>
        <LinksWrapper column>
          {menuItems.map((item, i) => (
            <Link key={i} color="white" href={item.reference}>
              {item.name}
            </Link>
          ))}
        </LinksWrapper>
      </MenuWrapper>
    </>
  );
}
