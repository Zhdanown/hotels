import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Promocode from "./Promocode";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import FloatingButton from "../components/FloatingButton";
import { searchRooms } from "../Step2/roomsReducer";
import LayoutContext from "../Layout/LayoutContext";
import useWindowWidth from "../Layout/hooks/useWindowWidth";
import { getIsShowPromoCode } from "../redux/hotelConfig";

function Step1() {
  const IsShowPromoCode = useSelector(getIsShowPromoCode);

  return (
    <>
      <ColumnHeader>Параметры бронирования</ColumnHeader>
      <Guests />
      <DateRangePicker />
      {IsShowPromoCode ? <Promocode /> : null}
      <SearchRoomButton />
    </>
  );
}

export default Step1;

function SearchRoomButton() {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(searchRooms());
    setStep(step => ++step);
  };
  const [, , isDesktop] = useWindowWidth();
  return isDesktop ? (
    <Button block onClick={onClick}>
      Подобрать номера
    </Button>
  ) : (
    <FloatingButton onClick={onClick}>Подобрать номера</FloatingButton>
  );
}
