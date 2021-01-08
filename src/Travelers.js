import React, { useState } from "react";
const random = () => Math.round(Math.random() * 1000000);
const room = () => ({
  id: random(),
});
function Travelers() {
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
        />
      ))}

<div style={{textAlign: "center"}}>

      <button className="btn btn-dark btn-sm" onClick={addRoom}>Добавить комнату</button>
</div>
    </div>
  );
}

export default Travelers;

function Room({ index, room, removeRoom, lastRoom }) {
  return (
    <section className="room" style={{ margin: "1rem 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: '.5rem'
        }}
      >
        <h5>Комната {index + 1}</h5>
        {!lastRoom && (
          <button className="btn btn-dark btn-sm" onClick={() => removeRoom(room.id)}>Убрать</button>
        )}
      </div>
      <Category name="Взрослые" />
      <Category name="Дети" annotation="от 0 до 3 лет" />
      <Category name="Дети" annotation="от 3 до 12 лет" />
    </section>
  );
}

function Category({ name, annotation }) {
  const [value, setValue] = useState(0);
  return (
    <div
      className="category"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label style={{ marginBottom: 0, fontWeight: "bold" }}>{name}</label>
        <span>{annotation}</span>
      </div>

      <div>
        <button
        className="btn btn-info btn-sm"
          style={{ margin: "0 .5rem" }}
          onClick={() => setValue(count => --count)}
        >
          -
        </button>
        <span style={{ margin: "0 .5rem" }}>{value}</span>
        <button
        className="btn btn-info btn-sm"
          style={{ margin: "0 .5rem" }}
          onClick={() => setValue(count => ++count)}
        >
          +
        </button>
      </div>
    </div>
  );
}
