import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import api from "../../redux/api";

export function IconLoader({ url }) {
  const [, setError] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    async function loadSVG(svgUrl) {
      try {
        const result = await api.get(svgUrl);
        svgRef.current.innerHTML = result.data;
      } catch (err) {
        setError(err);
      }
    }

    loadSVG(url);
  }, [url]);

  return <SVGWrapper ref={svgRef} />;
}

const SVGWrapper = styled.span`
  svg {
    fill: #666;
    width: 1.5rem;
    height: 1.5rem;
  }
`;
