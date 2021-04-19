import styled, { createGlobalStyle } from "styled-components";

export const Card = styled.div`
  box-shadow: 0 0 10px 5px #ddd;
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

export const HTMLOverflowHidden = createGlobalStyle`
  html {
    overflow: hidden;
  }
  body {
    margin: 0;
  }
`;
