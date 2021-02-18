import React, { useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";

import LayoutContext from "./LayoutContext";
import { ColumnMobileQueries } from "./MediaQueries";
import useNavbarHeight from "./hooks/useNavbarHeight";
import TitleScreen from "./DesktopColTitleScreen";

const HTMLOverflowHidden = createGlobalStyle`
  html {
    overflow: hidden;
  }
`;

const Layout = styled.div`
  overflow-x: hidden;

  .wrapper {
    display: flex;
    width: 300%;
    transition: transform 0.5s;
    overflow-y: hidden;
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
      <HTMLOverflowHidden />
      <Layout className="layout-mobile" step={currentStep - 1}>
        <div className="wrapper">
          <MColumn num={1} goForward={goForward}>
            {children[0]}
          </MColumn>
          <MColumn num={2} goBack={goBack} goForward={goForward}>
            {children[1]}
          </MColumn>
          <MColumn num={3} goBack={goBack}>
            {children[2]}
          </MColumn>
        </div>
      </Layout>
    </>
  );
}

const StyledColumn = styled.div`
  height: calc(100vh - ${p => p.navbarHeight}px);
  flex: 1;
  transition: all 0.5s;
  overflow-y: hidden;
  transform: scale(${p => (p.active ? 1 : 0.4)});
  opacity: ${p => (p.active ? 1 : 0.5)};

  .column-wrapper {
    overflow-y: auto;
    height: 100%;
  }

  ${ColumnMobileQueries}
`;

const ColumnContainer = styled.div`
  padding: 1rem;
  width: 550px;
  margin: 0 auto;

  ${ColumnMobileQueries}
`;

function MColumn({ children, num }) {
  const { currentStep } = useContext(LayoutContext);
  const active = currentStep === num;

  return (
    <StyledColumn active={active} navbarHeight={useNavbarHeight}>
      <div className="column-wrapper">
        <ColumnContainer>{children}</ColumnContainer>
        <TitleScreen num={num} />
      </div>
    </StyledColumn>
  );
}

export default LayoutMobile;
