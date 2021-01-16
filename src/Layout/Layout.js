import React, { useContext } from "react";
import LayoutContext from "./LayoutContext";
import useWindowWidth from "../hooks/useWindowWidth";
import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";

// const stepsConfig = {
//   1: [1],
//   2: [1, 2],
//   3: [1, 2, 3],
// };

function Layout({ children }) {
  const layoutContext = useContext(LayoutContext);
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth > 1024;

  const { currentStep, setStep } = layoutContext;
  // const [currentStep, setStep] = useState(1);
  // const [steps, setSteps] = useState([1]);

  // useEffect(() => {
  //   if (currentStep === 2 && !steps.indexOf[2]) {
  //     setSteps(steps => steps.concat([2]));
  //   }
  //   if (currentStep === 3 && !steps.indexOf[3]) {
  //     setSteps(steps => steps.concat([3]));
  //   }
  // }, [steps, currentStep]);

  const isShowStep = step => {
    // return steps.includes(step);
    return true;
  };

  if (isDesktop) {
    return (
      <LayoutDesktop
        currentStep={currentStep}
        isShowStep={isShowStep}
        setStep={setStep}
      >
        {children}
      </LayoutDesktop>
    );
  } else {
    return (
      <LayoutMobile currentStep={currentStep} setStep={setStep}>
        {children}
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
