import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Router, Route, Switch, useRouteMatch } from "react-router-dom";

import Layout from "./Layout/Layout";
import Step1 from "./Step1/Step1";
import Rooms from "./Step2";
import Step3 from "./Step3/Step3";
import { LayoutContextProvider } from "./Layout/LayoutContext";
import history from "./history";
import AuthRoutes from "./Auth/AuthRoutes";
import { startSession } from "./Auth/authReducer";
import { useQueryParams } from "./useQueryParams";
import { changeParams } from "./redux/booking";
import { Toast } from "./components/Toast";
import { Suspense } from "react";
import HotelConfigLoader from "./HotelConfigLoader";

const Profile = React.lazy(() => import("./Profile"));

export default App;

function App() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();

  useEffect(() => {
    dispatch(changeParams(queryParams));
  }, [queryParams, dispatch]);

  useEffect(() => {
    dispatch(startSession());
  }, [dispatch]);

  return (
    <Router history={history}>
      <Route path="/:slug?">
        <HotelConfigLoader>
          <Routes />
        </HotelConfigLoader>
        <Toast />
      </Route>
    </Router>
  );
}

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
          <Layout>
            <Step1 />
            <Rooms />
            <Step3 />
          </Layout>
          <AuthRoutes />
        </LayoutContextProvider>
      </Route>
    </Switch>
  );
}
