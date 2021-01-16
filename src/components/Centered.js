import React from "react";
import styled from "styled-components";

const CenteredStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ fullScreen }) => (fullScreen ? "100vh" : "100%")};
  flex-direction: ${({ column }) => (column ? "column" : "row")};
`;

export function Centered({ children, ...props }) {
  return <CenteredStyled {...props}>{children}</CenteredStyled>;
}
