import React, { CSSProperties } from "react";
import sberPng from "../assets/sber.png";

export const SberIcon = ({ style }: { style: CSSProperties }) => (
  <img src={sberPng} alt="sber_icon" style={{ width: 20, ...style }} />
);
