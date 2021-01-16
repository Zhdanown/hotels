import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadConfig, getConfig } from "./reservation";
import { withSplash } from "./Splash";

import Layout, { Navbar } from "./Layout/Layout";
import Step1 from "./Step1/Step1";
import Rooms from "./rooms/Rooms";
import Step3 from "./Step3";
import { LayoutContextProvider } from "./Layout/LayoutContext";

function App() {
  const dispatch = useDispatch();
  const config = useSelector(getConfig);

  useEffect(() => {
    dispatch(loadConfig("welna_kaluga"));
  }, [dispatch]);

  if (!config) {
    return <p>loading...</p>;
  } else {
    return (
      <>
        {false && <Navbar />}
        <LayoutContextProvider>
          <Layout>
            <Step1 />
            <Rooms />
            <Step3 />
          </Layout>
        </LayoutContextProvider>
      </>
    );
  }
}

export default withSplash(App);
