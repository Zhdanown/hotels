import { CloseOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button, { ButtonWithIcon } from "../../components/Button";
import { changeParams } from "../../redux/booking";
import { getMaxRoomsCount } from "../../redux/hotelConfig";
import Room from "./Room";

type RoomType = {
  id: string;
  params: {
    adults: number;
    childs: { code: string; count: number }[];
  };
};

const getNewRoom = () => ({
  id: nanoid(),
  params: {
    adults: 2,
    childs: [],
  },
});

function Guests() {
  const maxRoomsCount = useSelector(getMaxRoomsCount);
  const [rooms, setRooms] = useState<RoomType[]>([getNewRoom()]);

  const dispatch = useDispatch();

  useEffect(() => {
    const newRooms = rooms.map(room => room.params);
    dispatch(changeParams({ rooms: newRooms }));
  }, [rooms, dispatch]);

  const limit = rooms.length >= maxRoomsCount;

  const addRoom = () => {
    if (rooms.length >= maxRoomsCount) {
      return;
    }

    setRooms(rooms => [...rooms, getNewRoom()]);
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms => rooms.filter(room => room.id !== roomId));
  };

  const onChange = (roomId: string) => (newParams: RoomType["params"]) => {
    setRooms(rooms => {
      const newRooms = rooms.map(room => {
        if (room.id === roomId) {
          room.params = { ...room.params, ...newParams };
        }
        return room;
      });
      return newRooms;
    });
  };

  return (
    <>
      {rooms.map(room => (
        <div key={room.id} className="has-text-centered">
          <Room onChange={onChange(room.id)} />
          {limit && (
            <ButtonWithIcon
              onClick={() => removeRoom(room.id)}
              small
              Icon={CloseOutlined}
            >
              Удалить
            </ButtonWithIcon>
          )}
        </div>
      ))}

      <div className="has-text-centered mt-5">
        <Button small onClick={addRoom} disabled={limit}>
          Добавить комнату
        </Button>
      </div>
    </>
  );
}

export default Guests;
