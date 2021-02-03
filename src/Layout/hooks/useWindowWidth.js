import { useState, useEffect } from "react";

function useWindowWidth() {
  const [windowWidth, setWidth] = useState(null);
  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);
  return windowWidth;
}

export default useWindowWidth;
