import React, { useState } from "react";
import Room from "./Room";
import Button from "../components/Button"

const random = () => Math.round(Math.random() * 1000000);
const room = () => ({
  id: random(),
});

function Guests({ children }) {
  const [rooms, setRooms] = useState([room()]);
  const addRoom = () => {
    setRooms(rooms => rooms.concat([room()]));
  };
  const removeRoom = id => {
    setRooms(rooms => rooms.filter(x => x.id !== id));
  };

  return (
    <div>
      {rooms.map((room, index) => (
        <Room
          key={room.id}
          room={room}
          index={index}
          removeRoom={removeRoom}
          lastRoom={rooms.length === 1}
          children={children}
        />
      ))}

      <div style={{ textAlign: "center" }}>
        <Button onClick={addRoom}>Добавить комнату</Button>
      </div>
    </div>
  );
}


export default Guests;
