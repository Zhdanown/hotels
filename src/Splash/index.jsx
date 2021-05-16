import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { Centered } from "../components/Centered";
import { getSvgBgColor, getCssUrl, getSvgUrl } from "../redux/hotelConfig";
import useStyledSvg from "./useStyledSVG";

const logDissolve = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const SplashBackground = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  top: 0;
  transition: background 0.5s;
  background: ${props => props.svgBgColor || "white"};

  &.out {
    animation-name: ${logDissolve};
    animation-fill-mode: forwards;
    animation-duration: ${props => props.duration}s;
    animation-delay: ${props => props.delay}s;
  }

  .logo-svg {
    --duration: 1400ms;
    --delay: 2s;
    margin: 50.69px;
    width: 500px;
    height: 375px;
  }
`;

export default function Splash({ children }) {
  const svgBgColor = useSelector(getSvgBgColor);
  const cssUrl = useSelector(getCssUrl);
  const svgUrl = useSelector(getSvgUrl);

  const animationParams = {
    delay: 2.4,
    duration: 0.5,
    svgBgColor,
  };

  const { delay, duration } = animationParams;
  const [visible, setVisible] = useState(true);

  const [svg] = useStyledSvg(cssUrl, svgUrl);

  useEffect(() => {
    if (!svg) return;

    const timeout = (delay + duration) * 1000;
    const timer = setTimeout(() => setVisible(false), timeout);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer);
    };
  }, [delay, duration, svg]);

  if (!visible) {
    return null;
  }

  return (
    <SplashBackground className={svg ? "out" : ""} {...animationParams}>
      {children || <SvgContent svg={svg} />}
    </SplashBackground>
  );
}

function SvgContent({ svg }) {
  if (!svg) {
    return null;
  }

  return (
    <Centered fullScreen>
      <Centered
        className="logo-svg"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </Centered>
  );
}
