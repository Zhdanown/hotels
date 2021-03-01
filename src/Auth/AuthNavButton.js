import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useRouteMatch } from "react-router-dom";

import Button from "../components/Button";
import Loader from "../components/Loader";
import { getIsLoginPending, getUser, logout } from "./authReducer";

function AuthNavButton() {
  let location = useLocation();
  const hideButton = location.pathname.match(/\/[login|register]/);
  let { url } = useRouteMatch();

  const isLoginPending = useSelector(getIsLoginPending);
  const user = useSelector(getUser);

  const dispatch = useDispatch();
  const signOut = () => dispatch(logout());

  if (hideButton) {
    return null;
  } else if (isLoginPending) {
    return <Loader />;
  } else if (user) {
    return <SignInBtn signOut={signOut} />;
  } else {
    return <SignOutBtn url={url} />;
  }
}

export default AuthNavButton;

const SignInBtn = ({ signOut }) => (
  <Button outline small onClick={signOut}>
    Выйти
  </Button>
);

const SignOutBtn = ({ url }) => (
  <Link to={`${url}/login`}>
    <Button outline small>
      Войти
    </Button>
  </Link>
);
