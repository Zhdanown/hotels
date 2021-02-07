import React, { useContext } from "react";
import LayoutContext from "./LayoutContext";
import useWindowWidth from "./hooks/useWindowWidth";
import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";
import Navbar from "./Navbar/index";

function Layout({ children }) {
  const layoutContext = useContext(LayoutContext);
  const [windowWidth] = useWindowWidth();
  const isDesktop = windowWidth > 1024;

  const { currentStep, setStep } = layoutContext;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      {isDesktop ? (
        <LayoutDesktop currentStep={currentStep} setStep={setStep}>
          {children}
        </LayoutDesktop>
      ) : (
        <LayoutMobile currentStep={currentStep} setStep={setStep}>
          {children}
        </LayoutMobile>
      )}
    </div>
  );
}

export default Layout;
