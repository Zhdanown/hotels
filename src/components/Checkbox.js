import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPrimaryColor } from "../redux/hotelConfig";

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
  onChange: value => {},
  label: "Checkbox label",
};

export default Checkbox;

const toggleSize = "1.25rem";
const toggleBorderWidth = "1px";

const Input = styled.input`
  width: ${toggleSize};
  height: ${toggleSize};
  opacity: 0;

  position: absolute;
  top: 0;
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
    left: 0;
    top: 0;
    z-index: 2;
  }

  ${Input}:checked ~ ${ToggleLabel}::after {
    background-color: ${p => p.color};
  }

  ${ToggleLabel}::before {
    content: "";
    width: 0;
    height: 0;
    font-size: ${toggleSize}; /* 1 */

    border-left-width: 0;
    border-bottom-width: 0;
    border-left-style: solid;
    border-bottom-style: solid;
    border-color: #fff;

    position: absolute;
    top: 0.5428em;
    left: 0.25em;
    z-index: 3;

    transform-origin: left top;
    transform: rotate(-40deg) skew(10deg);
  }

  ${Input}:checked ~ ${ToggleLabel}::before {
    --uiToggleArrowWidth: 2px;

    width: 0.4em;
    height: 0.2em;
    border-left-width: var(--uiToggleArrowWidth);
    border-bottom-width: var(--uiToggleArrowWidth);
  }

  ${Input}:disabled ~ ${ToggleLabel} {
    opacity: 0.25;
    cursor: not-allowed;
    user-select: none;
  }

  ${ToggleLabel}::after {
    border-radius: 2px;
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
`;
