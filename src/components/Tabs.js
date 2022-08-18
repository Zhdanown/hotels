import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import { BookingPage } from "../Profile/BookingPage";
import { routes } from "../Profile/routes";
import { getPrimaryColor } from "../redux/hotelConfig";

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

const TabsStyled = styled.div`
  margin-top: 24px;

  li {
    a {
      color: ${p => p.color};
    }

    &.is-active a {
      color: ${p => p.color};
      border-color: ${p => p.color} !important;
    }
  }
`;

export const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].url);
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const color = useSelector(getPrimaryColor);

  useEffect(() => {
    for (let key of Object.keys(routes)) {
      const route = routes[key];

      if (new RegExp(route).test(pathname)) {
        setActiveTab(route);
        break;
      }
    }
  }, [pathname]);

  return (
    <>
      <TabsStyled className="tabs" color={color}>
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.url}
              className={activeTab === tab.url ? "is-active" : ""}
              onClick={() => setActiveTab(tab.url)}
            >
              <Link to={`${url}${tab.url}`}>{tab.title}</Link>
            </li>
          ))}
        </ul>
      </TabsStyled>
      <div className="tab-contents" style={{ overflowY: "auto" }}>
        <div className="container p-4">
          <Switch>
            <Redirect exact from={path} to={`${path}${routes.bookingList}`} />
            <Route path={`${path}${routes.bookingPage}`}>
              <BookingPage />
            </Route>
            {tabs.map(tab => (
              <Route key={tab.url} path={`${path}${tab.url}`}>
                <div
                  className="tab"
                  style={tab.url === activeTab ? {} : { display: "none" }}
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
