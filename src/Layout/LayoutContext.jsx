import React, { createContext, useState, useEffect } from "react";
import produce from "immer";

import { ReactComponent as Beds } from "../assets/select_beds.svg";
import { ReactComponent as CreditCards } from "../assets/credit_cards.svg";

const LayoutContext = createContext();
export default LayoutContext;

const stepsInitial = {
  1: { title: "Параметры", enabled: true },
  2: {
    title: "Выбор номера",
    enabled: false,
    icon: Beds,
  },
  3: { title: "Оплата", enabled: false, icon: CreditCards },
};

function useSteps() {
  const [steps, updateSteps] = useState(stepsInitial);

  const dispatchControlledAction = step => {
    updateSteps(
      produce(draft => {
        draft[step].enabled = true; // eslint-disable-line no-param-reassign
      })
    );
  };

  return [steps, dispatchControlledAction];
}

export function LayoutContextProvider({ children }) {
  const [currentStep, setStep] = useState(1);
  const [steps, setSteps] = useSteps(currentStep);

  useEffect(() => {
    if (currentStep < 1) {
      setStep(1);
    }
    if (currentStep > 3) {
      setStep(3);
    }
    setSteps(currentStep);
  }, [currentStep, setSteps]);

  return (
    <LayoutContext.Provider value={{ currentStep, setStep, steps }}>
      {children}
    </LayoutContext.Provider>
  );
}
