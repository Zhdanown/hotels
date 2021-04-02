import React from "react";
import styled from "styled-components";

export default function Price({ price, oldPrice }) {
  const percent = Math.floor(((price - oldPrice) / oldPrice) * 100);

  return (
    <div>
      {oldPrice ? (
        <OldPrice>
          <span>{oldPrice} &#8381;</span>
          <Percent>{percent}%</Percent>
        </OldPrice>
      ) : null}
      <b>{price} &#8381;</b>
    </div>
  );
}

const OldPrice = styled.div`
  font-size: 0.8rem;

  span:first-child {
    text-decoration: line-through;
  }
`;

const Percent = styled.span`
  background: #333;
  color: white;
  opacity: 0.75;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
`;
