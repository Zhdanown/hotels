import React from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { getPrimaryColor } from "../redux/hotelConfig";

const loader = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
    opacity: 0;
  }
`;

const StyledLoader = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: ${p => p.color || "#666"};
  border-radius: 50%;
  animation: ${loader} 1s infinite ease-in-out;
`;

export default function Loader() {
  const color = useSelector(getPrimaryColor);
  return <StyledLoader color={color} />;
}

export const LoaderWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
