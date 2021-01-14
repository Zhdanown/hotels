import React, { useContext } from "react";
import DateRangePicker from "./DateRangePicker";
import Guests from "./Guests";
import LayoutContext from "./Layout/LayoutContext";
import Button from "./components/Button";

function Step1({ inactive, config }) {
  const layoutContext = useContext(LayoutContext);

  const { setStep } = layoutContext;
  const onButtonClick = () => {

    setStep(step => ++step);
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
      <Guests children={config.hotel_child_categories} />
      <DateRangePicker availabilityColors={config.hotel_availability_colors} />

      <Button onClick={onButtonClick}>Искать номера</Button>
    </>
  );
}

export default Step1;
