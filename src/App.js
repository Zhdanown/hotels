import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, getConfigError, loadConfig } from "./reservation";
import SplashScreen from "./Splash";

import Layout, { Navbar } from "./Layout/Layout";
import Step1 from "./Step1/Step1";
import Rooms from "./rooms/Rooms";
import Step3 from "./Step3";
import { Centered } from "./components/Centered";
import { LayoutContextProvider } from "./Layout/LayoutContext";
import { BrowserRouter, Route } from "react-router-dom";

import { useParams } from "react-router-dom";

function ConfigLoader({ children }) {
  let { slug } = useParams();

  const dispatch = useDispatch();
  const config = useSelector(getConfig);
  const configError = useSelector(getConfigError);

  useEffect(() => {
    if (slug) {
      dispatch(loadConfig(slug));
    }
  }, [dispatch, slug]);

  const getMessage = () => {
    const text = () => {
      if (!slug) return "Необходим адрес отеля";
      else if (configError) return "Проверьте url адрес";
      else if (!config) return "Загрузка";
      else return null;
    };

    if (!text()) return null;

    return (
      <Centered column fullScreen>
        <h4>{configError}</h4>
        <h6>{text()}</h6>
      </Centered>
    );
  };

  return (
    <>
      <SplashScreen>{getMessage()}</SplashScreen>
      {config ? children : null}
    </>
  );
}

export default App;

function App() {
  return (
    <BrowserRouter>
      <Route path="/:slug?">
        <ConfigLoader>
          {false && <Navbar />}
          <LayoutContextProvider>
            <Layout>
              <Step1 />
              <Rooms />
              <Step3 />
            </Layout>
          </LayoutContextProvider>
        </ConfigLoader>
      </Route>
    </BrowserRouter>
  );
}
