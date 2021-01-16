import React, { useState, useEffect, useCallback } from "react";

import {
  StyledCategory,
  CategoryName,
  CategoryLabel,
  CounterValue,
} from "./styled";
import Button from "../../components/Button";

function Category({ initialValue, onChange, name, annotation }) {
  const [count, setCount] = useState(initialValue);

  const decrement = () => setCount(x => (x > 0 ? --x : x));
  const increment = () => setCount(x => ++x);

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  return (
    <StyledCategory>
      <CategoryName>
        <CategoryLabel>{name}</CategoryLabel>
        <span>{annotation}</span>
      </CategoryName>

      <div>
        <Button onClick={decrement}>-</Button>
        <CounterValue>{count}</CounterValue>
        <Button onClick={increment}>+</Button>
      </div>
    </StyledCategory>
  );
}

export default Category;

export function ChildCategory({ category, onChange }) {
  const { code, name } = category;
  const onChildrenCountChange = useCallback(
    count => {
      onChange(count, code);
    },
    [code, onChange]
  );

  return (
    <Category
      name="Дети"
      annotation={name}
      initialValue={0}
      onChange={onChildrenCountChange}
    ></Category>
  );
}
