import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import produce from "immer";

import Category, { ChildCategory } from "./Category";
import { StyledRoom, RoomHeader } from "./styled";
import { changeParams, getParams } from "../../redux/booking";
import { getChildCategories } from "../../redux/hotelConfig";

function Room() {
  const params = useSelector(getParams);
  const childCategories = useSelector(getChildCategories);

  const [childs, setChilds] = useState(childCategories);
  const [adults, setAdults] = useState(params.adults);
  const [roomCount, setRoomCount] = useState(params.rooms_count);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeParams({ adults, guests: [] }));
  }, [adults, dispatch]);

  useEffect(() => {
    dispatch(changeParams({ rooms_count: roomCount }));
  }, [roomCount, dispatch]);

  useEffect(() => {
    const newChilds = childs.map(({ code, count }) => ({ code, count }));
    dispatch(changeParams({ childs: newChilds, guests: [] }));
  }, [childs, dispatch]);

  const updateChilds = useCallback((count, index) => {
    setChilds(
      produce(draft => {
        draft[index].count = count;
      })
    );
  }, []);

  return (
    <StyledRoom className="room">
      <RoomHeader></RoomHeader>
      <Category name="Взрослые" initialValue={adults} onChange={setAdults} />
      {childCategories.map((category, index) => (
        <ChildCategory
          key={category.id}
          category={category}
          onChange={(count, code) => updateChilds(count, index)}
        ></ChildCategory>
      ))}
      <Category
        name="Количество комнат"
        initialValue={roomCount}
        onChange={setRoomCount}
        maxValue={2}
      />
    </StyledRoom>
  );
}

export default Room;
