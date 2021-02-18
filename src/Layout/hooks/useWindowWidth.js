import { useState, useEffect } from "react";

function useWindowWidth() {
  const [windowWidth, setWidth] = useState(null);
  const [windowHeight, setHeight] = useState(null);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDesktop = windowWidth > 1024;

  return [windowWidth, windowHeight, isDesktop];
}

export default useWindowWidth;
