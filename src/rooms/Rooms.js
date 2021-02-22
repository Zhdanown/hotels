import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";

import { getRooms } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { getPackages } from "../redux/hotelConfig";

const Packages = styled.div``;

function Rooms() {
  const rooms = useSelector(getRooms);

  const [selected, setSelected] = useState(null);

  const packages = useSelector(getPackages);

  const onSelect = data => {
    console.log(data);
    setSelected(data);
  };

  const dispatch = useDispatch();
  const { setStep } = useContext(LayoutContext);

  const goBack = () => {
    setStep(step => --step);
  };

  const continueBooking = () => {
    setStep(step => ++step);
    dispatch(changeParams(selected));
  };

  const cancel = () => {
    setSelected(null);
  };

  return (
    <div style={{ position: "relative" }}>
      {selected ? (
        <>
          <ColumnHeader goBack={cancel}>Дополнительные услуги</ColumnHeader>
          <div style={{ margin: "1rem 0" }}>
            <Button small onClick={continueBooking}>
              Продолжить бронирование
            </Button>
          </div>
          <Packages>
            {packages.map(packageItem => (
              <div key={packageItem.id}>
                <p>{packageItem.name}</p>
              </div>
            ))}
          </Packages>
        </>
      ) : (
        <>
          <ColumnHeader goBack={goBack}>Выбор номера</ColumnHeader>
          {rooms.map(room => (
            <RoomShowcase
              key={room.id}
              room={room}
              onSelect={onSelect}
            ></RoomShowcase>
          ))}
        </>
      )}
    </div>
  );
}

export default Rooms;
