import { useState, useEffect } from "react";

export default function useNavbarHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      setHeight(navbar.offsetHeight);
    }
  }, []);

  return height;
}
