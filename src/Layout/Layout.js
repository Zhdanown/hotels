import React, { useContext } from "react";
import { useSelector } from "react-redux";

import LayoutContext from "./LayoutContext";
import useWindowWidth from "./hooks/useWindowWidth";
import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";
import Navbar from "./Navbar/index";
import { getIsShowNavbar } from "../redux/hotelConfig";

function Layout({ children }) {
  const layoutContext = useContext(LayoutContext);
  const isShowNavbar = useSelector(getIsShowNavbar);
  const [windowWidth] = useWindowWidth();
  const isDesktop = windowWidth > 1024;

  const { currentStep, setStep } = layoutContext;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isShowNavbar && <Navbar />}
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
