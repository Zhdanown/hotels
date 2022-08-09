import React, { useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";

import LayoutContext from "./LayoutContext";
import { ColumnMobileQueries } from "./MediaQueries";
import TitleScreen from "./DesktopColTitleScreen";

export const HTMLOverflowHiddenMobile = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
`;

const Layout = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;

  .columns-wrapper {
    display: flex;
    width: 300%;
    height: 100%;
    transition: transform 0.5s;
    transform: translateX(${p => p.step * -33.33}%);
  }
`;

function LayoutMobile({ children }) {
  const { currentStep, setStep } = useContext(LayoutContext);

  const goBack = () => {
    setStep(step => --step);
  };

  const goForward = () => {
    setStep(step => ++step);
  };

  return (
    <>
      <HTMLOverflowHiddenMobile />
      <Layout className="layout-viewport" step={currentStep - 1}>
        <div className="columns-wrapper">
          <MobileColumn num={1} goForward={goForward}>
            {children[0]}
          </MobileColumn>
          <MobileColumn num={2} goBack={goBack} goForward={goForward}>
            {children[1]}
          </MobileColumn>
          <MobileColumn num={3} goBack={goBack}>
            {children[2]}
          </MobileColumn>
        </div>
      </Layout>
    </>
  );
}

const StyledColumn = styled.div`
  flex: 1;
  transition: all 0.5s;
  transform: scale(${p => (p.active ? 1 : 0.4)});
  opacity: ${p => (p.active ? 1 : 0.5)};

  .column-viewport {
    overflow-y: auto;
    height: 100%;
  }

  ${ColumnMobileQueries}
`;

const ColumnContainer = styled.div`
  padding: 1rem;
  width: 550px;
  margin: 0 auto;
  height: 100%;

  ${ColumnMobileQueries}
`;

function MobileColumn({ children, num }) {
  const { currentStep } = useContext(LayoutContext);
  const active = currentStep === num;

  return (
    <StyledColumn active={active}>
      <div className="column-viewport">
        <ColumnContainer>{children}</ColumnContainer>
        <TitleScreen num={num} />
      </div>
    </StyledColumn>
  );
}

export default LayoutMobile;
