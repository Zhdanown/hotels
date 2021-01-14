import React from "react";
import Category from "./Category";
import { StyledRoom, RoomHeader } from "./styled";
import Button from "../components/Button";

function Room({ index, room, removeRoom, lastRoom, children }) {
  return (
    <StyledRoom className="room">
      <RoomHeader>
        <h5>Комната {index + 1}</h5>
        {!lastRoom && (
          <Button onClick={() => removeRoom(room.id)}>Убрать</Button>
        )}
      </RoomHeader>
      <Category name="Взрослые" />
      {children &&
        children.map(childType => (
          <Category
            key={childType.id}
            name="Дети"
            annotation={childType.name}
          />
        ))}
    </StyledRoom>
  );
}

export default Room;
