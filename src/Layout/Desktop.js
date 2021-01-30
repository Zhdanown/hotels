import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { scrollbarWidth } from "./scrollbarWidth";

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

function LayoutDesktop({ children, currentStep, isShowStep }) {
  return (
    <DesktopLayoutContainer>
      <HTMLOverflowHidden />
      <Column active={currentStep === 1} visible={isShowStep(1)}>
        {children[0]}
      </Column>
      <Column active={currentStep === 2} visible={isShowStep(2)}>
        {children[1]}
      </Column>
      <Column active={currentStep === 3} visible={isShowStep(3)}>
        {children[2]}
      </Column>
    </DesktopLayoutContainer>
  );
}

export default LayoutDesktop;

const StyledColumn = styled.div`
  flex: 1;
  height: calc(100vh - 50px);
  transition: all 0.5s;
  overflow: hidden;
  opacity: ${p => (p.active ? 1 : 0.7)};
  transform: scale(${p => (p.active ? 1 : 0.8)});

  &:nth-child(1) {
    transform-origin: left;
  }
  &:nth-child(3) {
    transform-origin: right;
  }
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

function Column({ children, visible, active }) {
  return (
    <StyledColumn active={active}>
      <ColumnWrapper scrollbarWidth={scrollbarWidth} className="column-wrapper">
        <div className="container">{children}</div>
      </ColumnWrapper>
    </StyledColumn>
  );
}
