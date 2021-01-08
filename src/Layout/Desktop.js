import React from "react";
import { scrollbarWidth } from "./scrollbarWidth";
import "./columns-wrapper.css";
import "./column.css";

function LayoutDesktop({ children, currentStep, isShowStep }) {
  return (
    <div className={`desktop-layout`}>
      <Column
        color="cadetblue"
        active={currentStep === 1}
        visible={isShowStep(1)}
      >
        {children[0]}
      </Column>

      <Column color="bisque" active={currentStep === 2} visible={isShowStep(2)}>
        {children[1]}
      </Column>

      <Column
        color="darksalmon"
        active={currentStep === 3}
        visible={isShowStep(3)}
      >
        {children[2]}
      </Column>
    </div>
  );
}

export default LayoutDesktop;

function Column({ color, children, visible, active }) {

  return (
    <div
      className={"column" + (active ? " active" : "")}
      style={{
        backgroundColor: color,
        opacity: active ? 1 : 0.7,
        transform: `scale(${active ? 1 : 0.8}) `,
      }}
    >
      <div
        className="column-wrapper"
        style={{
          // overflowY: "scroll",
          // height: "100%",
          marginRight: `-${scrollbarWidth}px`,
        }}
      >
        <div
          className="container"
          // style={{
          //   transform: `scale(${active ? 1 : 0.8}) `,
          // }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
