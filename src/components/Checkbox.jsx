import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../redux/hotelConfig";
import checkmark from "../assets/checkmark.svg";
import { mediumMobileWidth } from "../Layout/MediaQueries";

function Checkbox({ value, onChange, label }) {
  const color = useSelector(getPrimaryColor);
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    onChange(checked);
  }, [checked, onChange]);

  const toggle = () => setChecked(isChecked => !isChecked);

  return (
    <CheckboxInput color={color}>
      <Input type="checkbox" checked={checked} onChange={toggle} />
      <ToggleLabel>
        <span>{label}</span>
      </ToggleLabel>
    </CheckboxInput>
  );
}

Checkbox.defaultProps = {
  onChange: () => {},
  label: "Checkbox label",
};

export default Checkbox;

const toggleSize = "1.5rem";
const toggleBorderWidth = "1px";

const Input = styled.input`
  width: ${toggleSize};
  height: ${toggleSize};
  opacity: 0;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  margin: 0;
`;

const ToggleLabel = styled.span`
  display: inline-flex;
  min-height: ${toggleSize};
  padding-left: calc(${toggleSize} + 0.4em);

  span {
    margin-top: auto;
    margin-bottom: auto;
  }
`;

const CheckboxInput = styled.label`
  display: inline-flex;
  position: relative;
  overflow: hidden;

  ${Input}:not(:disabled) ~ ${ToggleLabel} {
    cursor: pointer;
  }

  ${ToggleLabel}::after {
    content: "";
    box-sizing: border-box;
    width: 1em;
    height: 1em;
    font-size: ${toggleSize}; /* 1 */

    background-color: transparent;
    border: ${toggleBorderWidth} solid ${p => p.color};

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  ${Input}:checked ~ ${ToggleLabel}::after {
    background-color: ${p => p.color};
  }

  ${ToggleLabel}::before {
    background-image: url(${checkmark});
    background-repeat: no-repeat;
    background-position: center;

    content: "";
    width: ${toggleSize};
    height: 0;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 6;
  }

  ${Input}:checked ~ ${ToggleLabel}::before {
    height: ${toggleSize};
  }

  ${Input}:disabled ~ ${ToggleLabel} {
    opacity: 0.25;
    cursor: not-allowed;
    user-select: none;
  }

  ${ToggleLabel}::after {
    border-radius: 0.25rem;
  }

  ${Input}:not(:disabled) ~ ${ToggleLabel}::before {
    will-change: width, height;
    opacity: 0;
  }

  ${Input}:not(:disabled):checked ~ ${ToggleLabel}::before {
    opacity: 1;
    transition: opacity 0.1s ease-out 0.25s, width 0.1s ease-out 0.5s,
      height 0.2s ease-out 0.3s;
  }

  ${Input}:not(:disabled) ~ ${ToggleLabel}::after {
    will-change: background-color;
    transition: background-color 0.2s ease-out;
  }

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 0.8rem;
  }
`;
