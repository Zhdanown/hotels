import React from "react";
import DateRangePicker from "./DateRangePicker";
import Travelers from "./Travelers";

function Step1({ onSelect, inactive }) {
  const onButtonClick = () => {
    onSelect();
  };
  // if (inactive) {
  //   return (
  //     <div style={{
  //       height: '100%',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'center'
  //     }}>
  //       <h4>c 11 по 17 января</h4>
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           fontSize: "1.5rem",
  //         }}
  //       >
  //         <span>Взрослых:</span>
  //         <span>2</span>
  //       </div>
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           fontSize: "1.5rem",
  //         }}
  //       >
  //         <span>Детей (от 0 до 3 лет):</span>
  //         <span>1</span>
  //       </div>
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           fontSize: "1.5rem",
  //         }}
  //       >
  //         <span>Детей (от 3 до 12 лет):</span>
  //         <span>1</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Travelers />
      <DateRangePicker />

      <button
        className="btn btn-block btn-warning"
        type="button"
        onClick={onButtonClick}
      >
        Искать номера
      </button>
    </>
  );
}

export default Step1;
