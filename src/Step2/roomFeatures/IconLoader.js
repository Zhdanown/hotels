import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import api from "../../redux/api";

export function IconLoader({ url }) {
  const [error, setError] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    async function loadSVG(url) {
      try {
        const result = await api.get(url);
        svgRef.current.innerHTML = result.data;
      } catch (err) {
        setError(err);
      }
    }

    loadSVG(url);
  }, []);

  return <SVGWrapper ref={svgRef} />;
}

const SVGWrapper = styled.span`
  svg {
    fill: #666;
    width: 1.5rem;
    height: 1.5rem;
  }
`;
