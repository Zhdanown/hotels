import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getConfig, getConfigError, getConfigLoading } from "./redux/hotelConfig";
import { loadConfig } from "./redux/hotelConfig";

import SplashScreen from "./Splash";
import Layout, { Navbar } from "./Layout/Layout";
import Step1 from "./Step1/Step1";
import Rooms from "./rooms/Rooms";
import Step3 from "./Step3/Step3";
import { Centered } from "./components/Centered";
import { LayoutContextProvider } from "./Layout/LayoutContext";


function ConfigLoader({ children }) {
  let { slug } = useParams();

  const dispatch = useDispatch();
  const config = useSelector(getConfig);
  const configLoading = useSelector(getConfigLoading);
  const configError = useSelector(getConfigError);

  useEffect(() => {
    if (slug) {
      dispatch(loadConfig(slug));
    }
  }, [dispatch, slug]);

  const getMessage = () => {
    const text = () => {
      if (!slug) return "Необходим адрес отеля";
      else if (configError) return configError;
      else if (configLoading) return "Загрузка";
      else return null;
    };

    if (!text()) return null;

    return (
      <Centered column fullScreen>
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
