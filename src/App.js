import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Router,
  Route,
  Switch,
  useRouteMatch,
  Redirect,
} from "react-router-dom";

import Layout from "./Layout/Layout";
import Step1 from "./Step1/Step1";
import Rooms from "./Step2";
import Step3 from "./Step3/Step3";
import { LayoutContextProvider } from "./Layout/LayoutContext";
import history from "./history";
import AuthRoutes from "./Auth/AuthRoutes";
import { login, startSession } from "./Auth/authReducer";
import { useQueryParams } from "./hooks/useQueryParams";
import { changeParams } from "./redux/booking";
import { Toast } from "./components/Toast";
import { Suspense } from "react";
import HotelConfigLoader from "./HotelConfigLoader";
import { OnLoginScreen } from "./Auth/OnLoginScreen";

const Profile = React.lazy(() => import("./Profile/ProfileMain"));

export default App;

function App() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const { team_one_time_pass } = queryParams;

  useEffect(() => {
    dispatch(changeParams(queryParams));
  }, [queryParams, dispatch]);

  useEffect(() => {
    dispatch(
      team_one_time_pass
        ? login({ one_time_pass: team_one_time_pass })
        : startSession()
    );
  }, [dispatch, team_one_time_pass]);

  return (
    <Router history={history}>
      <Route path="/:slug?">
        <HotelConfigLoader>
          <Routes />
          <OnLoginScreen />
        </HotelConfigLoader>
        <Toast />
      </Route>
      <RedirectOnNoSlug />
    </Router>
  );
}

const RedirectOnNoSlug = () => (
  <Route
    render={({ location }) =>
      location.pathname === "/" && (
        <Redirect
          to={{
            pathname: "/mriya",
            state: { from: location },
          }}
        />
      )
    }
  />
);

function Routes() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/profile`}>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Profile />
        </Suspense>
      </Route>
      <Route path={path}>
        <LayoutContextProvider>
          <AuthRoutes />
          <Route exact path="/:slug">
            <Layout>
              <Step1 />
              <Rooms />
              <Step3 />
            </Layout>
          </Route>
        </LayoutContextProvider>
      </Route>
    </Switch>
  );
}
