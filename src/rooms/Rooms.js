import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import DOMpurify from "dompurify";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import Button from "../components/Button";
import { changeParams, getPrimaryColor } from "../reservation";
import { getRooms, getRoomsLoadState } from "./roomsReducer";

function Rooms() {
  const isLoadingRooms = useSelector(getRoomsLoadState);
  const rooms = useSelector(getRooms);

  if (isLoadingRooms) {
    return <h1>Загрузка...</h1>;
  }
  return (
    <div>
      <h3>Выбор номера</h3>
      {rooms.map(room => (
        <RoomShowcase key={room.id} room={room}></RoomShowcase>
      ))}
    </div>
  );
}

const StyledRoomShowcase = styled.div`
  border: 1px solid black;
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 0.5rem;
`;

function RoomShowcase({ room }) {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const primaryColor = useSelector(getPrimaryColor);

  const {
    name,
    room_code,
    max_price,
    short_descriprion: short_description,
    rates,
  } = room;

  const dispatch = useDispatch();
  const onRateSelect = rate => {
    setStep(step => ++step);
    dispatch(changeParams({ room, rate }));
  };

  return (
    <StyledRoomShowcase bgColor={primaryColor}>
      <h6>{name}</h6>
      <p>
        Code: <b>{room_code}</b>
      </p>
      <p>
        Max Price: <b>{max_price}</b>
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMpurify.sanitize(short_description),
        }}
      ></div>
      <h4 style={{ textAlign: "center" }}>Тарифы</h4>
      {rates.map(rate => (
        <RoomRate key={rate.rate_code} rate={rate} onClick={onRateSelect} />
      ))}
    </StyledRoomShowcase>
  );
}

const StyledRoomRate = styled.div`
  margin: 1rem;
`;
const RateHeader = styled.h5`
  display: flex;
  justify-content: space-between;
`;

function RoomRate({ rate, onClick }) {
  const { rate_code, short_description } = rate;
  return (
    <StyledRoomRate>
      <RateHeader>
        {rate_code}
        <Button onClick={() => onClick(rate)}>Выбрать</Button>
      </RateHeader>
      <p>{short_description}</p>
    </StyledRoomRate>
  );
}

export default Rooms;
