import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Promocode from "./Promocode";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import { searchRooms } from "../Step2/roomsReducer";
import LayoutContext from "../Layout/LayoutContext";
import { getIsShowPromoCode } from "../redux/hotelConfig";

function Step1() {
  const IsShowPromoCode = useSelector(getIsShowPromoCode);
  const dispatch = useDispatch();
  const { setStep } = useContext(LayoutContext);

  const onClick = () => {
    dispatch(searchRooms());
    setStep(step => ++step);
  };

  return (
    <>
      <ColumnHeader>Параметры бронирования</ColumnHeader>
      <Guests />
      <DateRangePicker />
      {IsShowPromoCode ? <Promocode /> : null}
      <Button block onClick={onClick}>
        Подобрать номера
      </Button>
    </>
  );
}

export default Step1;
