import { useState, useEffect } from "react";

function useWindowWidth() {
  const [windowWidth, setWidth] = useState<null | number>(null);
  const [windowHeight, setHeight] = useState<null | number>(null);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDesktop = windowWidth ? windowWidth > 1024 : null;

  return [windowWidth, windowHeight, isDesktop] as const;
}

export default useWindowWidth;
