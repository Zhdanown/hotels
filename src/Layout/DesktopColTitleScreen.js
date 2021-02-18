import React, { useEffect, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";

import LayoutContext from "./LayoutContext";
import { Centered } from "../components/Centered";
import Loader from "../components/Loader";
import useWindowWidth from "./hooks/useWindowWidth";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SPEED = 400; // ms

const TitleScreenContainer = styled(Centered)`
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: opacity ${SPEED}ms;
  padding: 1rem;
  opacity: ${p => (p.visible ? 1 : 0)};

  font-size: 1.5rem;
  animation: 100ms ${fadeIn};
`;

const TitleContent = styled(Centered)`
  width: 100%;
  flex-direction: column;
  ${p => p.desktop && "box-shadow: 0 0 10px 4px #ddd;"}
`;

const ScreenHeader = styled.span`
  font-size: 2rem;
`;

const Subtitle = styled.span`
  &:before {
    content: "";
    display: block;
    width: 66%;
    border-bottom: 1px solid #757763;
    margin: 1rem auto;
  }
`;

export default function TitleScreen({ num }) {
  const { steps } = useContext(LayoutContext);
  const [, , isDesktop] = useWindowWidth();

  const stepData = steps[num];
  const { enabled, title, isLoading } = stepData;
  const [contentVisible, setContentVisibility] = useState(enabled);

  useEffect(() => {
    let timer
    if (enabled) {
      timer = setTimeout(() => setContentVisibility(true), SPEED);
    } else {
      setContentVisibility(false);
    }
    return () => clearTimeout(timer)
  }, [enabled]);

  if (!contentVisible) {
    return (
      <TitleScreenContainer visible={!enabled}>
        <TitleContent desktop={isDesktop}>
          {isLoading && <Loader />}
          <ScreenHeader>{title}</ScreenHeader>
          {!isLoading && <Subtitle>Какой-то текст</Subtitle>}
        </TitleContent>
      </TitleScreenContainer>
    );
  } else {
    return null;
  }
}
