import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { BookingPage } from "../Profile/BookingPage";
import { routes } from "../Profile/routes";

import { getHoverColor } from "../redux/hotelConfig";

// const Tab = styled.button`
//   flex: 1;

//   ${p =>
//     p.selected &&
//     `
//   background-color: ${p.color};
//   border-color: transparent;
//   color: #fff;
//   `}
// `;

// export default function Tabs({ tabs, preSelected, ...props }) {
//   const color = useSelector(getHoverColor);

//   const [curTab, selectTab] = useState(tabs[preSelected]);

//   return (
//     <>
//       <div className="buttons has-addons is-centered mt-4">
//         {tabs.map(tab => (
//           <Tab
//             color={color}
//             className="button is-small"
//             key={tab.id}
//             selected={tab.id === curTab.id}
//             onClick={() => selectTab(tab)}
//           >
//             {tab.label}
//           </Tab>
//         ))}
//       </div>
//       {curTab.render(props)}
//     </>
//   );
// }

// Tabs.defaultProps = {
//   preSelected: 0,
//   tabs: [
//     {
//       id: "1",
//       label: "Tab 1",
//       render: props => <p>Tab 1</p>,
//     },
//     {
//       id: "2",
//       label: "Tab 2",
//       render: props => <p>Tab 2</p>,
//     },
//   ],
// };

export const Tabs = ({ tabs }) => {
  // const color = useSelector(getHoverColor);
  const [activeTab, setActiveTab] = useState(1);
  const { path, url } = useRouteMatch();

  // console.log(`${path}${routes.bookingPage}`);
  console.log(path);
  console.log(`${path}${routes.bookingList}`);
  return (
    <>
      <div className="tabs" style={{ marginTop: 24 }}>
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              <Link to={`${url}${tab.url}`}>{tab.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="tab-contents" style={{ overflowY: "auto" }}>
        <div className="container p-4">
          <Switch>
            <Redirect exact from={path} to={`${path}${routes.bookingList}`} />
            <Route path={`${path}${routes.bookingPage}`}>
              <BookingPage />
            </Route>
            {tabs.map(tab => (
              <Route key={tab.id} path={`${path}${tab.url}`}>
                <div
                  className="tab"
                  style={tab.id === activeTab ? {} : { display: "none" }}
                >
                  {tab.content}
                </div>
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </>
  );
};
