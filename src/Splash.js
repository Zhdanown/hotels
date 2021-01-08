import React, { useState, useEffect } from "react";
import splash from "./splash.svg";
const csspath = "splash";
require(`./${csspath}.css`);
require("./splash_logo.css");

const displayTimeS = 0;
const transitionTimeS = 0.5;
const fadeOutDelayMs = displayTimeS * 1000;
const totalDisplayTimeMs = (displayTimeS + transitionTimeS) * 1000;

function Splash() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startFadeOut = setTimeout(() => {
      setFadeOut(true);
    }, fadeOutDelayMs);

    const hideCompletely = setTimeout(() => {
      setVisible(false);
    }, totalDisplayTimeMs);
    return () => {
      clearTimeout(startFadeOut);
      clearTimeout(hideCompletely);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={"splash" + (fadeOut ? " out" : "")}
      style={{ animationDuration: transitionTimeS + "s" }}
    >
      <div id="logo">
        <img src={splash} alt="" />
      </div>
    </div>
  );
}

export function withSplash(Component) {
  return props => {
    return (
      <>
        <Component {...props} />
        <Splash></Splash>
      </>
    );
  };
}
