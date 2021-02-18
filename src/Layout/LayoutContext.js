import React, { createContext } from "react";
import { useState, useEffect, useCallback, useReducer } from "react";
import { useSelector } from "react-redux";

import { getRoomsLoadState } from "../rooms/roomsReducer";
import store from "../redux/store";

const LayoutContext = createContext();
export default LayoutContext;

const stepsInitial = {
  1: { title: "Параметры", enabled: true, loadSelector: () => false },
  2: {
    title: "Выбор номера",
    enabled: false,
    loadText: "Загрузка номеров",
    loadSelector: getRoomsLoadState,
    isLoading: false,
  },
  3: { title: "Оплата", enabled: false, loadSelector: () => false },
};

function reducer(state, { type, step, enabled = true, newTitle, isLoading }) {
  const copy = { ...state };
  switch (type) {
    case "ENABLE":
      copy[step].enabled = enabled;
      return copy;

    case "CHANGE_TITLE":
      copy[step].title = newTitle;
      copy[step].isLoading = isLoading;
      return copy;
    default:
      return state;
  }
}

function updateAfterLoaded(dispatchAction, selector) {
  return new Promise((resolve, reject) => {
    dispatchAction();
    store.subscribe(() => {
      const loading = selector(store.getState());
      if (loading) {
      } else {
        resolve(true);
      }
    });
  });
}

function useLoadedSteps() {
  const [steps, updateSteps] = useReducer(reducer, stepsInitial);
  const [action, setAction] = useState({ step: 1 });
  const isStepLoading = useSelector(steps[action.step].loadSelector);
  const step = steps[action.step];

  const dispatchControlledAction = useCallback(
    action => {
      if (action.type === "ENABLE") {
        if (isStepLoading) {
          updateSteps({ ...action, enabled: false });

          const priorAction = () =>
            updateSteps({
              type: "CHANGE_TITLE",
              step: action.step,
              newTitle: step.loadText,
              isLoading: true,
            });

          updateAfterLoaded(priorAction, step.loadSelector).then(() => {
            updateSteps(action);
          });
        } else {
          updateSteps(action);
        }
      } else {
        updateSteps(action);
      }
    },
    [isStepLoading, step]
  );

  useEffect(() => {
    dispatchControlledAction(action);
  }, [action, dispatchControlledAction]);

  return [steps, setAction];
}

export function LayoutContextProvider({ children }) {
  const [currentStep, setStep] = useState(1);
  const [steps, setSteps] = useLoadedSteps(currentStep);

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
    setSteps({ type: "ENABLE", step: currentStep });
  }, [currentStep, setSteps]);

  return (
    <LayoutContext.Provider value={{ currentStep, setStep, steps }}>
      {children}
    </LayoutContext.Provider>
  );
}
