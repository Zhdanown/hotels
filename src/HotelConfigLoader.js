import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getConfig,
  getConfigError,
  getConfigLoading,
} from "./redux/hotelConfig";
import { loadConfig } from "./redux/hotelConfig";
import SplashScreen from "./Splash";
import { Centered } from "./components/Centered";

function HotelConfigLoader({ children }) {
  let { slug } = useParams();

  const dispatch = useDispatch();
  const config = useSelector(getConfig);
  const configLoading = useSelector(getConfigLoading);
  const configError = useSelector(getConfigError);

  useEffect(() => {
    if (slug && !config) {
      dispatch(loadConfig(slug));
    }
  }, [dispatch, slug, config]);

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
      <SplashScreen hasConfig={Boolean(config)}>{getMessage()}</SplashScreen>
      {config ? children : null}
    </>
  );
}

export default HotelConfigLoader;
