import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Promocode from "./Promocode";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import { searchRooms } from "../Step2/roomsReducer";
import LayoutContext from "../Layout/LayoutContext";
import { getConfigId, getIsShowPromoCode } from "../redux/hotelConfig";
import { getBlocks, getPromocodeError } from "../redux/booking";
import { loadBlocksWatcher } from "../Auth/sagas/sberSaga";

function Step1() {
  const IsShowPromoCode = useSelector(getIsShowPromoCode);
  const hasPromocodeError = useSelector(getPromocodeError);
  const hotelId = useSelector(getConfigId);
  const blocks = useSelector(getBlocks);

  const dispatch = useDispatch();
  const { setStep } = useContext(LayoutContext);

  useEffect(() => {
    !blocks.length && hotelId && dispatch(loadBlocksWatcher());
  }, [hotelId, blocks, dispatch]);

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
      <Button
        block
        onClick={onClick}
        style={{ marginBottom: "1rem" }}
        disabled={hasPromocodeError}
      >
        Подобрать номера
      </Button>
    </>
  );
}

export default Step1;
