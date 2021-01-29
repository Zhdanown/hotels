import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  StyledCategory,
  CategoryName,
  CategoryLabel,
  CounterValue,
  CounterButton,
} from "./styled";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Centered } from "../../components/Centered";
import { getPrimaryColor } from "../../reservation";

const Sign = styled.button`
  font-size: 1.2rem;
  color: ${props => props.color};
`;

function Category({ initialValue, onChange, name, annotation }) {
  const [count, setCount] = useState(initialValue);
  const primaryColor = useSelector(getPrimaryColor);

  const decrement = () => setCount(x => (x > 0 ? --x : x));
  const increment = () => setCount(x => ++x);

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  return (
    <StyledCategory justified>
      <CategoryName>
        <CategoryLabel>{name}</CategoryLabel>
        <span>{annotation}</span>
      </CategoryName>

      <Centered>
        <CounterButton onClick={decrement} color={primaryColor}>
          <Sign as={MinusOutlined} color={primaryColor} />
        </CounterButton>
        <CounterValue>{count}</CounterValue>
        <CounterButton onClick={increment} color={primaryColor}>
          <Sign as={PlusOutlined} color={primaryColor} />
        </CounterButton>
      </Centered>
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
