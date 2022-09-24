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
import { getPrimaryColor } from "../../redux/hotelConfig";

const Sign = styled.button`
  font-size: 1.2rem;
  color: ${props => props.color};
`;

function Category({ initialValue, onChange, name, annotation, maxValue = Infinity }) {
  const [count, setCount] = useState(initialValue > maxValue ? maxValue : initialValue);
  const primaryColor = useSelector(getPrimaryColor);

  const decrement = () => setCount(x => (x > 0 ? --x : x));
  const increment = () => setCount(x => x < maxValue ? ++x : x);

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
  const { code, name, from_age, to_age, max_childs } = category;
  const onChildrenCountChange = useCallback(
    count => {
      onChange(count, code);
    },
    [code, onChange]
  );

  return (
    <Category
      name={name}
      annotation={`От ${from_age} до ${to_age}`}
      initialValue={0}
      maxValue={max_childs}
      onChange={onChildrenCountChange}
    ></Category>
  );
}
