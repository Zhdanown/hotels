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

  ${ColumnContainer} {
    max-width: 360px;
  }

  &:nth-child(2) {
    width: 40%;
    ${ColumnContainer} {
      max-width: unset;
    }
  }
`;

const ColumnWrapper = styled.div`
  margin-right: -${p => p.scrollbarWidth}px;
  overflow-y: scroll;
  height: 100%;
`;

function Column({ children, active }) {
  const navbarHeight = useNavbarHeight();
  return (
    <StyledColumn active={active} navbarHeight={navbarHeight}>
      <ColumnWrapper scrollbarWidth={scrollbarWidth} className="column-wrapper">
        <ColumnContainer>{children}</ColumnContainer>
      </ColumnWrapper>
    </StyledColumn>
  );
}
