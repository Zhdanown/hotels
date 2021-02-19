import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import FloatingButton from "../components/FloatingButton";
import { searchRooms } from "../rooms/roomsReducer";
import LayoutContext from "../Layout/LayoutContext";
import useWindowWidth from "../Layout/hooks/useWindowWidth";

function Step1() {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(searchRooms());
    setStep(step => ++step);
  };

  return (
    <>
      <ColumnHeader>Параметры бронирования</ColumnHeader>
      <Guests />
      <DateRangePicker />

      <SearchRoomButton onClick={onClick} />
    </>
  );
}

export default Step1;

function SearchRoomButton({ onClick }) {
  const [, , isDesktop] = useWindowWidth();
  return isDesktop ? (
    <Button block onClick={onClick}>
      Подобрать номера
    </Button>
  ) : (
    <FloatingButton onClick={onClick}>Подобрать номера</FloatingButton>
  );
}
