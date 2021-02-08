import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { getHoverColor } from "../redux/hotelConfig";

const Tab = styled.button`
  flex: 1;

  ${p =>
    p.selected &&
    `
  background-color: ${p.color};
  border-color: transparent;
  color: #fff;
  `}
`;

export default function Tabs({ tabs, preSelected, ...props }) {
  const color = useSelector(getHoverColor);

  const [curTab, selectTab] = useState(tabs[preSelected]);

  return (
    <>
      <div className="buttons has-addons is-centered mt-4">
        {tabs.map(tab => (
          <Tab
            color={color}
            className="button is-small"
            key={tab.id}
            selected={tab.id === curTab.id}
            onClick={() => selectTab(tab)}
          >
            {tab.label}
          </Tab>
        ))}
      </div>
      {curTab.render(props)}
    </>
  );
}

Tabs.defaultProps = {
  preSelected: 0,
  tabs: [
    {
      id: "1",
      label: "Tab 1",
      render: props => <p>Tab 1</p>,
    },
    {
      id: "2",
      label: "Tab 2",
      render: props => <p>Tab 2</p>,
    },
  ],
};
