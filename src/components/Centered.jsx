import React from "react";
import styled from "styled-components";

const CenteredStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.justified ? "space-between" : "center")};
  height: ${({ fullScreen }) => (fullScreen ? "100vh" : "100%")};
  flex-direction: ${({ column }) => (column ? "column" : "row")};
`;

export function Centered({ children, ...props }) {
  return <CenteredStyled {...props}>{children}</CenteredStyled>;
}

export const Justified = styled.div.attrs(props => ({
  alignV: props.alignV || "unset",
}))`
  display: flex;
  justify-content: space-between;
  align-items: ${props => props.alignV};
`;
