import React from "react";
import Icon from "@ant-design/icons";

export const SvgIcon = ({ component, style }) => (
  <Icon component={component} style={style} />
);

SvgIcon.defaultProps = {
  style: {
    fontSize: "1.5rem",
  },
};
