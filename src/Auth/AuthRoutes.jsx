import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import LoginForm from "./LoginForm";
import Overlay from "../components/Overlay";
import RegisterForm from "./RegisterForm";

function AuthRoutes() {
  const { path } = useRouteMatch();
  const history = useHistory();

  const closeOverlay = () => {
    const newUrl = history.location.pathname.replace(/(\/\w+\/?$)/, "");
    history.replace(newUrl);
  };

  return (
    <Switch>
      <Redirect from={`${path}//login`} to={`${path}/login`} />

      <Route path={`${path}/login`}>
        <Overlay close={closeOverlay}>
          <LoginForm close={closeOverlay} />
        </Overlay>
      </Route>

      <Route path={`${path}/register`}>
        <Overlay close={closeOverlay}>
          <RegisterForm close={closeOverlay} />
        </Overlay>
      </Route>
    </Switch>
  );
}

export default AuthRoutes;
