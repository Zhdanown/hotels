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
  transition: background .5s;
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
  }
`;

export default function Splash({ children, hasConfig }) {
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
    !hasConfig && visible && setVisible(true);
  }, [hasConfig, visible])

  useEffect(() => {
    if (!svg) return;

    const timeout = (delay + duration) * 1000;
    const timer = setTimeout(() => setVisible(false), timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, duration, svg]);

  if (!visible) {
    return null;
  } else {
    return (
      <SplashBackground className={svg ? "out" : ""} {...animationParams}>
        {children || <SvgContent svg={svg}></SvgContent>}
      </SplashBackground>
    );
  }
}

function SvgContent({ svg }) {
  if (!svg) {
    return null;
  } else {
    return (
      <Centered fullScreen>
        <Centered
          className="logo-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        ></Centered>
      </Centered>
    );
  }
}
