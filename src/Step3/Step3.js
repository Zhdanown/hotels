import React from "react";
import { useSelector } from "react-redux";
import { Switch, Redirect, useRouteMatch, Route } from "react-router-dom";
import { getBookingResponse } from "../reservation";
import Confirm from "./Confirm";
import Success from "./Success";

function Step3() {
  const bookingResponse = useSelector(getBookingResponse);

  let { path, url } = useRouteMatch();

  return (
    <>
      {bookingResponse && (
        <Route
          component={() => {
            window.location.replace(bookingResponse.redirect_url);
            return null;
          }}
        />
      )}
      <Switch>
        <Route exact path={path}>
          <Confirm></Confirm>
        </Route>
        <Route path={`${path}/success`}>
          <Success></Success>
        </Route>
        {/* <Route
          path={`${path}/success`}
          component={() => {
            // window.location.href = 'https://example.com/1234';
            window.location.replace(bookingResponse.redirect_url);
            return null;
          }}
        /> */}
      </Switch>
    </>
  );
}

export default Step3;
