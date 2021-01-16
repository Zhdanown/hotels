import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import LayoutContext from "../Layout/LayoutContext";
import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Button from "../components/Button";
import { searchRooms } from "../rooms/roomsReducer";

function Step1() {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const dispatch = useDispatch();

  const onButtonClick = () => {
    dispatch(searchRooms());
    setStep(step => ++step);
  };

  return (
    <>
      <Guests />
      <DateRangePicker />
      <Button onClick={onButtonClick}>Искать номера</Button>
    </>
  );
}

export default Step1;
