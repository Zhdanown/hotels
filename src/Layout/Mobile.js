import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import useWindowWidth from "./hooks/useWindowWidth";
import useNavbarHeight from "./hooks/useNavbarHeight";

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

function LayoutMobile({ children, currentStep, setStep }) {
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
          <MColumn active={currentStep === 1} goForward={goForward}>
            {children[0]}
          </MColumn>
          <MColumn
            active={currentStep === 2}
            goBack={goBack}
            goForward={goForward}
          >
            {children[1]}
          </MColumn>
          <MColumn active={currentStep === 3} goBack={goBack}>
            {children[2]}
          </MColumn>
        </div>
      </Layout>
    </>
  );
}

const MediaQueries = `
  @media screen and (max-width: 768px) {
    & {
      width: 500px;
    }
  }
  @media screen and (max-width: 600px) {
    & {
      width: 420px;
    }
  }
  @media screen and (max-width: 550px) {
    & {
      width: 400px;
    }
  }
  @media screen and (max-width: 425px) {
    & {
      width: 100%;
      min-width: 300px;
      padding: 0.5rem;
    }
  }
`;

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

  ${MediaQueries}
`;

const ColumnContainer = styled.div`
  padding: 1rem;
  width: 550px;
  margin: 0 auto;

  ${MediaQueries}
`;

function MColumn({ children, active, goBack, goForward }) {
  return (
    <StyledColumn active={active} navbarHeight={useNavbarHeight}>
      <div className="column-wrapper">
        <ColumnNavigation goBack={goBack} goForward={goForward} />
        <ColumnContainer>{children}</ColumnContainer>
      </div>
    </StyledColumn>
  );
}

const MobileButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  width: 550px;
  margin: 0 auto;

  ${MediaQueries}
`;

function ColumnNavigation({ goBack, goForward }) {
  const [windowWidth] = useWindowWidth();
  const isTablet = windowWidth >= 768;

  if (isTablet) {
    return (
      <>
        {goBack && <TabletNavButton prev onClick={goBack}></TabletNavButton>}
        {goForward && (
          <TabletNavButton next onClick={goForward}></TabletNavButton>
        )}
      </>
    );
  } else {
    return (
      <MobileButtonsContainer>
        {goBack && <MobileNavButton prev onClick={goBack} />}
        {goForward && <MobileNavButton next onClick={goForward} />}
      </MobileButtonsContainer>
    );
  }
}

const MobileButtonContainer = styled.div`
  flex: 1;
  text-align: ${p => (p.prev ? "left" : "right")};
  button {
    border: none;
    padding: 0.5rem 1rem;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

function MobileNavButton({ prev, next, onClick }) {
  return (
    <MobileButtonContainer prev={prev}>
      <button onClick={onClick}>{prev ? "назад" : "вперёд"}</button>
    </MobileButtonContainer>
  );
}

const TabletButtonContainer = styled.div`
  display: inline-block;
  position: absolute;
  background: lightgray;
  top: 50%;
  transform: translateY(-50%);
  ${p => (p.prev ? "left: 20px;" : "right: 20px;")}

  button {
    border: none;
    padding: 2rem 1rem;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
`;

function TabletNavButton({ prev, onClick }) {
  return (
    <TabletButtonContainer prev={prev}>
      <button type="button" onClick={onClick}>
        {prev ? "назад" : "вперёд"}
      </button>
    </TabletButtonContainer>
  );
}

export default LayoutMobile;
