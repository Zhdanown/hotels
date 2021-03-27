import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";

import { getRoomLoadError, getRooms, getPricedServices } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { Error } from "../components/InputWithError";
import ExtraService from "./ExtraService";

const StyledServices = styled.div``;

function Rooms({ onSelect, goBack }) {
  const rooms = useSelector(getRooms);
  const roomsLoadError = useSelector(getRoomLoadError);

  return (
    <div style={{ position: "relative" }}>
      <ColumnHeader goBack={goBack}>Выбор номера</ColumnHeader>
      {rooms.map(room => (
        <RoomShowcase
          key={room.id}
          room={room}
          onSelect={onSelect}
        ></RoomShowcase>
      ))}
      {roomsLoadError && <Error discreet>{roomsLoadError.message}</Error>}
    </div>
  );
}

function RoomsWithExtraServices() {
  const extraServices = useSelector(getPricedServices);
  const [selectedRoomAndRate, setSelected] = useState(null);

  const { setStep } = useContext(LayoutContext);
  const dispatch = useDispatch();

  const continueBooking = () => {
    setStep(step => ++step);
    dispatch(changeParams(selectedRoomAndRate));
  };

  const onSelect = data => {
    setSelected(data);
    if (!extraServices.length) {
      // skip extraServices
      continueBooking();
    }
  };

  const cancelServices = () => {
    setSelected(null);
  };

  const goStepBack = () => {
    setStep(step => --step);
  };

  if (selectedRoomAndRate && extraServices.length) {
    return (
      <>
        <ColumnHeader goBack={cancelServices}>
          Дополнительные услуги
        </ColumnHeader>
        <StyledServices>
          {extraServices.map(service => (
            <ExtraService key={service.id} {...service} />
          ))}
        </StyledServices>
        <div style={{ margin: "1rem 0" }}>
          <Button small onClick={continueBooking}>
            Продолжить бронирование
          </Button>
        </div>
      </>
    );
  }
  return <Rooms onSelect={onSelect} goBack={goStepBack} />;
}

export default RoomsWithExtraServices;
