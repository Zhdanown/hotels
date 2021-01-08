import React, { useState, useEffect } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";

import Step1 from "../Step1";
import Step2 from "../Step2";
import Step3 from "../Step3";

const stepsConfig = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
};

function Layout({ children }) {
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth > 1024;

  const [currentStep, setStep] = useState(1);
  const [steps, setSteps] = useState([1]);

  useEffect(() => {
    const onKeyDown = event => {
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
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (currentStep === 2 && !steps.indexOf[2]) {
      setSteps(steps => steps.concat([2]));
    }
    if (currentStep === 3 && !steps.indexOf[3]) {
      setSteps(steps => steps.concat([3]));
    }
  }, [currentStep]);

  const isShowStep = step => {
    return steps.includes(step);
  };

  const onDatesSelected = () => {
    setStep(step => ++step);
    console.log("step 1");
  };

  if (isDesktop) {
    return (
      
        <LayoutDesktop
          currentStep={currentStep}
          isShowStep={isShowStep}
          setStep={setStep}
        >
          <Step1 onSelect={onDatesSelected} inactive={currentStep !== 1} />
          <Step2 />
          <Step3 />
        </LayoutDesktop>
      
    );
  } else {
    return (
      <LayoutMobile currentStep={currentStep} setStep={setStep}>
        <Step1 onSelect={onDatesSelected} />
        <Step2 />
        <Step3 />
      </LayoutMobile>
    );
  }
}

export function Navbar() {
  return (
    <div
      style={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
      }}
    >
      <span
        style={{
          fontSize: "1.5rem",
        }}
      >
        Arturs Hotel{" "}
      </span>
    </div>
  );
}

export default Layout;
