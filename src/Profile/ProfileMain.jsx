import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Tabs } from "../components/Tabs";
import { HTMLOverflowHiddenMobile } from "../Layout/Mobile";
import Navbar from "../Layout/Navbar";
import { getIsShowNavbar } from "../redux/hotelConfig";
import { ProfileTab } from "./ProfileTab";
import { MyBookings } from "./BookingList";

const ProfileContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
`;

function Profile() {
  const isShowNavbar = useSelector(getIsShowNavbar);

  const tabs = [
    { id: 1, title: "Мои брони", content: <MyBookings /> },
    { id: 3, title: "Профиль", content: <ProfileTab /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <HTMLOverflowHiddenMobile />
      {isShowNavbar && <Navbar />}
      <ProfileContainer>
        <Tabs tabs={tabs} />
      </ProfileContainer>
    </div>
  );
}

export default Profile

// const Dropdown = ({ title, onClick, options }) => {
//   const [isOpen, toggle] = useState(false);
//   const [selected, setSelected] = useState(options[0]);

//   const ref = useRef(null);

//   const clickHandler = e => {
//     if (!ref.current.contains(e.target)) {
//       toggle(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", clickHandler);

//     return () => {
//       document.removeEventListener("click", clickHandler);
//     };
//   }, []);

//   return (
//     <>
//       <span className="subtitle is-6">{title}</span>
//       <div className={"dropdown is-right" + (isOpen ? ` is-active` : "")} ref={ref}>
//         <div className="dropdown-trigger">
//           <button
//             className="button"
//             aria-haspopup="true"
//             aria-controls="dropdown-menu6"
//             onClick={() => toggle(s => !s)}
//           >
//             <span>{selected.label}</span>
//             <span className="icon is-small">
//               <i className="fas fa-angle-down" aria-hidden="true"></i>
//             </span>
//           </button>
//         </div>
//         <div className="dropdown-menu" id="dropdown-menu6" role="menu">
//           <div className="dropdown-content">
//             {options.map(option => (
//               <div
//                 key={option.id}
//                 className="dropdown-item"
//                 onClick={() => {
//                   setSelected(option);
//                   onClick(option);
//                   toggle(false);
//                 }}
//               >
//                 <a href="#">{option.label}</a>
//               </div>
//             ))}
//             {/* <a href="#" class="dropdown-item">
//             Modifiers
//           </a> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
