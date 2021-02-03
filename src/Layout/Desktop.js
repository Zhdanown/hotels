import React from "react";
import styled, { createGlobalStyle } from "styled-components";

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
  width: 120%;
`;

function LayoutDesktop({ children, currentStep, isShowStep }) {
  return (
    <DesktopLayoutContainer>
      <HTMLOverflowHidden />
      <Column
        active={currentStep === 1}
        visible={isShowStep(1)}
        currentStep={currentStep}
      >
        {children[0]}
      </Column>
      <Column
        active={currentStep === 2}
        visible={isShowStep(2)}
        currentStep={currentStep}
      >
        {children[1]}
      </Column>
      <Column
        active={currentStep === 3}
        visible={isShowStep(3)}
        currentStep={currentStep}
      >
        {children[2]}
      </Column>
    </DesktopLayoutContainer>
  );
}

export default LayoutDesktop;

const StyledColumn = styled.div`
  width: 40%;
  height: calc(100vh - ${p => p.navbarHeight}px);
  transition: all 0.5s;
  overflow: hidden;
  opacity: ${p => (p.active ? 1 : 0.3)};
  transform: translateX(-${p => (p.currentStep - 1) * 25}%);
`;

const ColumnWrapper = styled.div`
  margin-right: -${p => p.scrollbarWidth}px;
  overflow-y: scroll;
  height: 100%;

  .container {
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
  }
`;

function Column({ children, active, currentStep }) {
  const navbarHeight = useNavbarHeight();
  return (
    <StyledColumn
      active={active}
      currentStep={currentStep}
      navbarHeight={navbarHeight}
    >
      <ColumnWrapper scrollbarWidth={scrollbarWidth} className="column-wrapper">
        <div className="container">{children}</div>
      </ColumnWrapper>
    </StyledColumn>
  );
}
