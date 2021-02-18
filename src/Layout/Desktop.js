import React, { useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";

import LayoutContext from "./LayoutContext";
import TitleScreen from "./DesktopColTitleScreen";
import { scrollbarWidth } from "./scrollbarWidth";
import useNavbarHeight from "./hooks/useNavbarHeight";

const HTMLOverflowHidden = createGlobalStyle`
  html {
    overflow: hidden;
  }
  body {
    margin: 0;
  }
`;

const DesktopLayoutContainer = styled.div`
  display: flex;
  overflow: hidden;
`;

function LayoutDesktop({ children }) {
  return (
    <DesktopLayoutContainer>
      <HTMLOverflowHidden />
      <Column num={1}>{children[0]}</Column>
      <Column num={2}>{children[1]}</Column>
      <Column num={3}>{children[2]}</Column>
    </DesktopLayoutContainer>
  );
}

export default LayoutDesktop;

const ColumnContainer = styled.div`
  text-align: center;
  padding: 1rem;
  box-sizing: border-box;
  margin: 0 auto;
`;

const StyledColumn = styled.div`
  width: 30%;
  height: calc(100vh - ${p => p.navbarHeight}px);
  transition: all 0.5s;
  overflow: hidden;
  opacity: ${p => (p.active ? 1 : 0.3)};
  position: relative;
  ${p => !p.active && `pointer-events: none;`}

  ${ColumnContainer} {
    max-width: 360px;
  }

  &:nth-child(2) {
    width: 40%;
    ${ColumnContainer} {
      max-width: 600px;
    }
  }
`;

const ColumnWrapper = styled.div`
  margin-right: -${p => p.scrollbarWidth}px;
  overflow-y: scroll;
  height: 100%;
`;

function Column({ children, num }) {
  const { currentStep } = useContext(LayoutContext);
  const active = currentStep === num;

  return (
    <StyledColumn active={active} navbarHeight={useNavbarHeight}>
      <ColumnWrapper scrollbarWidth={scrollbarWidth} className="column-wrapper">
        <ColumnContainer>{children}</ColumnContainer>
        <TitleScreen num={num} />
      </ColumnWrapper>
    </StyledColumn>
  );
}
