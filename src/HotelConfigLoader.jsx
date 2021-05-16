import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getConfig,
  getConfigError,
  getConfigLoading,
  loadConfig
} from "./redux/hotelConfig";
import SplashScreen from "./Splash";
import { Centered } from "./components/Centered";

function HotelConfigLoader({ children }) {
  const { slug } = useParams();

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
      if (configError) return configError;
      if (configLoading) return "Загрузка";
      return null;
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

export default HotelConfigLoader;
