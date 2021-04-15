import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import RoomShowcase from "./RoomShowcase";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import { Error } from "../components/Input";
import { Centered, Justified } from "../components/Centered";
import Loader, { LoaderWrapper } from "../components/Loader";
import { getRoomLoadError, getRooms, getRoomsLoadState } from "./roomsReducer";

function Rooms({ onSelect, goBack }) {
  const rooms = useSelector(getRooms);
  const isLoadingRooms = useSelector(getRoomsLoadState);
  const roomsLoadError = useSelector(getRoomLoadError);

  if (isLoadingRooms) {
    return <LoadScreen />;
  } else if (roomsLoadError) {
    return (
      <FallbackMessage goBack={goBack}>
        <Error>{roomsLoadError}</Error>
      </FallbackMessage>
    );
  } else if (!rooms.length && !isLoadingRooms) {
    return (
      <FallbackMessage goBack={goBack}>
        По заданным параметрам ничего не найдено
      </FallbackMessage>
    );
  }

  if (rooms.length) {
    return (
      <div>
        <ColumnHeader goBack={goBack}>Выбор номера</ColumnHeader>
        {rooms.map(room => (
          <RoomShowcase
            key={room.id}
            room={room}
            onSelect={onSelect}
          ></RoomShowcase>
        ))}
      </div>
    );
  }

  return null;
}

export default Rooms;

function FallbackMessage({ goBack, children }) {
  return (
    <Centered column alignV="center">
      <Justified style={{ textAlign: "center", marginBottom: "1rem" }}>
        {children}
      </Justified>
      <Button onClick={goBack}>Изменить параметры поиска</Button>
    </Centered>
  );
}

function LoadScreen() {
  return (
    <Centered column alignV="center">
      <FallbackTitle>Загрузка номеров</FallbackTitle>
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    </Centered>
  );
}

const FallbackTitle = styled(Justified)`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
`;
