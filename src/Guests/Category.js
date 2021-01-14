import React, { useState } from "react";
import Button from "../components/Button";
import {
  StyledCategory,
  CategoryName,
  CategoryLabel,
  CounterValue,
} from "./styled";

function Category({ name, annotation }) {
  const [value, setValue] = useState(0);

  const decrement = () => setValue(count => (count > 0 ? --count : count));
  const increment = () => setValue(count => ++count);

  return (
    <StyledCategory>
      <CategoryName>
        <CategoryLabel>{name}</CategoryLabel>
        <span>{annotation}</span>
      </CategoryName>

      <div>
        <Button onClick={decrement}>-</Button>
        <CounterValue>{value}</CounterValue>
        <Button onClick={increment}>+</Button>
      </div>
    </StyledCategory>
  );
}

export default Category;
