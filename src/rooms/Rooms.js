import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";

import { getRoomLoadError, getRooms, getPricedPackages } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { Error } from "../components/InputWithError";
import ExtraService from "./ExtraService";

const StyledPackages = styled.div``;

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

function RoomsWithPackages() {
  const packages = useSelector(getPricedPackages);
  const [selectedRoomAndRate, setSelected] = useState(null);

  const { setStep } = useContext(LayoutContext);
  const dispatch = useDispatch();

  const continueBooking = () => {
    setStep(step => ++step);
    dispatch(changeParams(selectedRoomAndRate));
  };

  const onSelect = data => {
    setSelected(data);
    if (!packages.length) {
      // skip packages
      continueBooking();
    }
  };

  const cancelPackages = () => {
    setSelected(null);
  };

  const goStepBack = () => {
    setStep(step => --step);
  };

  if (selectedRoomAndRate && packages.length) {
    return (
      <>
        <ColumnHeader goBack={cancelPackages}>
          Дополнительные услуги
        </ColumnHeader>
        <StyledPackages>
          {packages.map(packageItem => (
            <ExtraService key={packageItem.id} {...packageItem} />
          ))}
        </StyledPackages>
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

export default RoomsWithPackages;
