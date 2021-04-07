import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import LayoutDesktop from "./Desktop";
import LayoutMobile from "./Mobile";
import Navbar from "./Navbar/index";
import useWindowWidth from "./hooks/useWindowWidth";
import { getIsShowNavbar, getHotelName } from "../redux/hotelConfig";

function Layout({ children }) {
  const isShowNavbar = useSelector(getIsShowNavbar);
  const hotelName = useSelector(getHotelName);
  const [, , isDesktop] = useWindowWidth();

  useEffect(()=> {
    if (hotelName) {
      document.title = hotelName;
    }      
  }, [hotelName]);

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
