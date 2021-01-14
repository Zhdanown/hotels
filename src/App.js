import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadConfig } from "./store";
import { withSplash } from "./Splash";

import Layout, { Navbar } from "./Layout/Layout";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { LayoutContextProvider } from "./Layout/LayoutContext";

function App() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config);
  console.log(config);
  useEffect(() => {
    dispatch(loadConfig("welna_kaluga"));
  }, [dispatch]);

  if (!config) return <p>loading...</p>;

  return (
    <>
      {false && <Navbar />}
      <LayoutContextProvider>
        <Layout>
          <Step1 config={config} />
          <Step2 />
          <Step3 />
        </Layout>
      </LayoutContextProvider>
    </>
  );
}

export default withSplash(App);
