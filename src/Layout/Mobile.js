import React, { useState, useEffect } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import "./layout-mobile.css";

function LayoutMobile({ children, currentStep, setStep }) {
  //   const [index, setIndex] = useState(currentStep);

  const goBack = () => {
    setStep(step => --step);
  };

  const goForward = () => {
    setStep(step => ++step);
  };

  return (
    <div className="layout-mobile">
      <div
        className="wrapper"
        style={{
          transform: `translateX(${-33.33 * (currentStep - 1)}%)`,
        }}
      >
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
    </div>
  );
}

function MColumn({ children, active, goBack, goForward }) {
  return (
    <div className={"column" + (active ? " active" : "")} style={{
        opacity: active ? 1 : 0.5,
    }}>
      <div className="column-wrapper">
        <ColumnNavigation goBack={goBack} goForward={goForward} />
        <div className="_container">{children}</div>
      </div>
    </div>
  );
}

function ColumnNavigation({ goBack, goForward }) {
  const windowWidth = useWindowWidth();
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
      <div
        className="mobile-nav-buttons"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {goBack && <MobileNavButton prev onClick={goBack} />}
        {goForward && <MobileNavButton next onClick={goForward} />}
      </div>
    );
  }
}

function MobileNavButton({ prev, next, onClick }) {
  const type = (() => {
    if (prev) return "prev";
    else if (next) return "next";
  })();

  return (
    <div
      className={"mobile-nav-button " + type}
      style={{ flex: 1, textAlign: prev ? "left" : "right" }}
    >
      <button onClick={onClick}>{prev ? "назад" : "вперёд"}</button>
    </div>
  );
}

function TabletNavButton({ prev, next, onClick }) {
  const type = (() => {
    if (prev) return "prev";
    else if (next) return "next";
  })();

  return (
    <div
      className={"tablet-nav-button " + type}
      style={{
        display: "inline-block",
        position: "absolute",
        background: "lightgray",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <button type="button" onClick={onClick}>
        {prev ? "назад" : "вперёд"}
      </button>
    </div>
  );
}

export default LayoutMobile;
