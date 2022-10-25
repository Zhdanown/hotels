import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../redux/hotelConfig";

type Option = {
  id: string;
  name: string;
};

export const Select = ({
  options,
  value,
  onChange,
  label
}: {
  options: Option[];
  value?: string,
  onChange: (v?: Option) => void;
  label: string;
}) => {
  const color = useSelector(getPrimaryColor);
  options = [{ id: "", name: "Не выбрано" }, ...options];

  const onChange_ = (id: string) => {
    const item = options.find(x => String(x.id) === id);
    onChange(item);
  };

  return (
    <SelectContainer>
      <StyledSelect
        onChange={({ target }) => onChange_(target.value)}
        color={color}
      >
        {options.map((o, i) => (
          <option key={i} value={o.id}>
            {o.name}
          </option>
        ))}
      </StyledSelect>
      <LabelContainer>
      <Label color={color} hasValue={Boolean(value)}>
          {label}
        </Label>
      </LabelContainer>
    </SelectContainer>
  );
};

const SPEED = 0.4; // in seconds


const SelectContainer = styled.div`
  position: relative;
  height: 2rem;
`


const StyledSelect = styled.select`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  border: 1px solid ${p => p.color};
  padding-left: 0.5rem;

  &::placeholder {
    transition: transform ${SPEED}s;
  }

  &:focus {
    outline: none;
    border-width: 2px;

    &::placeholder {
      transform: translateY(-25px);
    }
  }
`;


const LabelContainer = styled.div`
  position: absolute;
  bottom: 100%;
  width: 100%;
  overflow: hidden;
  height: 1rem;
`;


const Label = styled.label<{ hasValue: boolean }>`
  position: absolute;
  left: 0;
  top: 100%;
  color: ${p => p.color};
  font-size: 0.8rem;
  transition: top ${SPEED}s;

  ${StyledSelect}:focus + ${LabelContainer} > & {
    top: -2px;
  }
  ${p => p.hasValue && `top: -2px;`}
`;
