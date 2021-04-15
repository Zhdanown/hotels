import React from "react";
import styled from "styled-components";
import { mediumMobileWidth } from "../Layout/MediaQueries";
import { BackButton } from "./Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  position: relative;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 1rem;
  }

  button {
    position: absolute;
    left: 0;
    top: 0;
  }
`;
const ColumnHeader = React.forwardRef(({ children, goBack }, ref) => {
  return (
    <Container ref={ref}>
      {goBack && <BackButton onClick={goBack}></BackButton>}
      {children}
    </Container>
  );
});

export default ColumnHeader;
