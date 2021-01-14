import React, { createContext, useState, useEffect } from "react";

const LayoutContext = createContext();
export default LayoutContext;

export function LayoutContextProvider({ children }) {
  const [currentStep, setStep] = useState(1);

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === "n") {
        setStep(step => ++step);
      }
      if (event.key === "p") {
        setStep(step => --step);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (currentStep < 1) {
      setStep(1);
    }
    if (currentStep > 3) {
      setStep(3);
    }
  }, [currentStep]);

  return (
    <LayoutContext.Provider value={{ currentStep, setStep }}>
      {children}
    </LayoutContext.Provider>
  );
}
