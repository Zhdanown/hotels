import React from "react";
import styled from "styled-components";
import { BackButton } from "./Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  position: relative;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  button {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

function ColumnHeader({ children, goBack }) {
  return (
    <Container>
      {goBack && <BackButton onClick={goBack}></BackButton>}
      {children}
    </Container>
  );
}

export default ColumnHeader;
