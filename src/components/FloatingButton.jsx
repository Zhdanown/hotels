import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

import useWindowWidth from "../Layout/hooks/useWindowWidth";
import Button from "./Button";

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 0;
  margin: 1.5rem 0;
  width: ${p => p.width};
`;

export default function FloatingButton({ onClick, children, ...props }) {
  const [windowWidth] = useWindowWidth();
  const ref = useRef();
  const [width, setWidth] = useState("100%");

  useEffect(() => {
    let timeout;
    if (ref.current) {
      timeout = setTimeout(() => setWidth(`${ref.current.offsetWidth}px`), 300);
    }
    return () => clearTimeout(timeout);
  }, [ref, windowWidth]);

  return (
    <div ref={ref} style={{ marginTop: "4rem" }}>
      <StyledButton {...props} block onClick={onClick} width={width}>
        {children}
      </StyledButton>
    </div>
  );
}

FloatingButton.defaultProps = {
  type: "button",
};
