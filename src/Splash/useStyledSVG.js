import { useState, useEffect } from "react";
import loadSVGandStyles from "./loadSVGandStyles";

export default function useStyledSvg(cssUrl, svgUrl) {
  const [svg, setSvg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cssUrl || !svgUrl) return;

    loadSVGandStyles({ cssUrl, svgUrl })
      .then(response => {
        setSvg(response);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [cssUrl, svgUrl]);

  return [svg, loading];
}
