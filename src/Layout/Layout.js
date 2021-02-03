import React, { useContext } from "react";
import LayoutContext from "./LayoutContext";
import useWindowWidth from "./hooks/useWindowWidth";
import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";
import { MenuOutlined } from "@ant-design/icons";
import styled from "styled-components";

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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Navbar />
        <LayoutDesktop
          currentStep={currentStep}
          isShowStep={isShowStep}
          setStep={setStep}
        >
          {children}
        </LayoutDesktop>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <LayoutMobile
          currentStep={currentStep}
          setStep={setStep}
          renderNavbar={() => <Navbar />}
        >
          {children}
        </LayoutMobile>
      </div>
    );
  }
}

const NavbarContainer = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 0 7px 0 #dddddd;
  z-index: 1;
  justify-content: space-between;
  font-size 1.4rem;

`;

export function Navbar() {
  return (
    <NavbarContainer id="navbar">
      <div>Arturs Hotel </div>
      <MenuOutlined />
    </NavbarContainer>
  );
}

export default Layout;
