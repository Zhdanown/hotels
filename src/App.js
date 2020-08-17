import React, { useState, useEffect } from "react";
import "./columns-wrapper.css";
import "./column.css";

const stepsConfig = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
};
const isShowStep = (step, currentStep) => {
  return stepsConfig[currentStep].includes(step);
};

function App() {
  const [currentStep, setStep] = useState(1);

  useEffect(() => {
    document.addEventListener("keydown", event => {
      if (event.key === "n") {
        setStep(step => {
          if (step < 3) {
            return ++step;
          }
          return step;
        });
      }
      if (event.key === "p") {
        setStep(step => {
          if (step > 1) {
            return --step;
          }
          return step;
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(currentStep);
  }, [currentStep]);

  return (
    <div className="columns-wrapper">
      {isShowStep(1, currentStep) && <Column color="antiquewhite" num="1">
        <h3>Header</h3></Column>}
      {isShowStep(2, currentStep) && <Column color="bisque" num="2" />}
      {isShowStep(3, currentStep) && <Column color="darksalmon" num="3" />}
    </div>
  );
}

export default App;

function Column({ color, num, children }) {
  return (
    <div className="column" style={{ backgroundColor: color }}>
      <div className="container">{`Column ${num}`}
        {children}
      </div>
    </div>
  );
}
