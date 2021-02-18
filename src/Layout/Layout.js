import React from "react";
import { useSelector } from "react-redux";

import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";
import Navbar from "./Navbar/index";
import useWindowWidth from "./hooks/useWindowWidth";
import { getIsShowNavbar } from "../redux/hotelConfig";

function Layout({ children }) {
  const isShowNavbar = useSelector(getIsShowNavbar);
  const [windowWidth] = useWindowWidth();
  const isDesktop = windowWidth > 1024;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isShowNavbar && <Navbar />}
      {isDesktop ? (
        <LayoutDesktop>{children}</LayoutDesktop>
      ) : (
        <LayoutMobile>{children}</LayoutMobile>
      )}
    </div>
  );
}

export default Layout;
