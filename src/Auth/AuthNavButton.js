import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useRouteMatch, matchPath } from "react-router-dom";
import styled, { css } from "styled-components";
import { SberIcon } from "../components/CustomIcons";

import Loader from "../components/Loader";
import LayoutContext from "../Layout/LayoutContext";
import { getPrimaryColor } from "../redux/hotelConfig";
import { getIsLoginPending, getUser, getIsSberEmploye, logout } from "./authReducer";

function AuthNavButton() {
  let location = useLocation();
  let { url } = useRouteMatch();

  const { setStep } = useContext(LayoutContext) || {}

  const hideButton = matchPath(location.pathname, {
    path: ["/:slug/login", "/:slug/register"],
  });

  const isLoginPending = useSelector(getIsLoginPending);
  const isSberEmploye = useSelector(getIsSberEmploye);

  const user = useSelector(getUser);

  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(logout());
    setStep(1)
  }

  if (hideButton) {
    return null;
  } else if (isLoginPending) {
    return <Loader />;
  } else if (user) {
    return (
      <SignOutBtn
        signOut={signOut}
        name={user.first_name}
        isSberEmploye={isSberEmploye}
      />
    );
  } else {
    return <SignInBtn url={url} />;
  }
}

export default AuthNavButton;

const SignOutBtn = ({ signOut, name, isSberEmploye }) => {
  const color = useSelector(getPrimaryColor);

  const {
    params: { slug },
  } = useRouteMatch();

  return (
    <Dropdown color={color}>
      <NavbarLink as="button" witharrow color={color}>
        {isSberEmploye && <SberIcon style={{ marginRight: 8 }} />}
        {name}
      </NavbarLink>
      <DropdownMenu color={color}>
        <DropdownItem as={Link} to={`/${slug}/profile`}>
          Личный кабинет
        </DropdownItem>
        <DropdownItem as="button" onClick={signOut}>
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const SignInBtn = ({ url }) => {
  const color = useSelector(getPrimaryColor);

  return (
    <NavbarLink to={`${url}/login`} color={color}>
      Войти
    </NavbarLink>
  );
};

const ArrowStyles = css`
  &::after {
    margin-top: -0.375em;
    right: 0.5em;
    border: 3px solid transparent;
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: 0.625em;
    margin-top: -0.4375em;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: rotate(-45deg);
    transform-origin: center;
    width: 0.625em;
    border-color: ${props => props.color};
  }
`;

export const NavbarLink = styled(Link)`
  color: ${props => props.color};
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  ${props => (props.witharrow ? `padding-right: 2.5rem;` : null)}
  align-items: center;
  display: flex;
  position: relative;
  /* as button */
  border: none;
  background-color: transparent;
  font-size: 1.4rem;

  ${props => props.witharrow && ArrowStyles}

  &:hover {
    background-color: #fafafa;
    color: ${props => props.color};
  }
`;

const DropdownMenu = styled.div`
  display: none;
  background-color: #fff;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 8px 8px rgb(10 10 10 / 10%);
  border-top: 2px solid #dbdbdb;
  font-size: 1rem;
  left: 0;
  min-width: 100%;
  position: absolute;
  top: 100%;
  z-index: 20;
  padding: 0.5rem 0;
  font-size: 1rem;
`;

const DropdownItem = styled.a`
  padding: 0.375rem 1rem;
  white-space: nowrap;
  display: flex;
  color: #4a4a4a;
  /* as button */
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #fafafa;
    color: #0a0a0a;
  }
`;

const Dropdown = styled.div`
  position: relative;

  &:hover ${DropdownMenu} {
    display: block;
  }
`;
