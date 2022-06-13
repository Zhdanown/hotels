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
import { AddedGuests } from "../Step3/AddedGuests";

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
      <AddedGuests />
      <DateRangePicker />
      {IsShowPromoCode ? <Promocode /> : null}
      <Button block onClick={onClick} style={{ marginBottom: "1rem" }}>
        Подобрать номера
      </Button>
    </>
  );
}

export default Step1;
