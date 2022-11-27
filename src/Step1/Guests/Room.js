import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import produce from "immer";

import Category, { ChildCategory } from "./Category";
import { StyledRoom, RoomHeader } from "./styled";
import { getParams } from "../../redux/booking";
import { getMaxAdults, getChildCategories } from "../../redux/hotelConfig";

function Room({ onChange }) {
  const params = useSelector(getParams);
  const childCategories = useSelector(getChildCategories);
  const maxAdults = useSelector(getMaxAdults);

  const [childs, setChilds] = useState(childCategories);
  const [adults, setAdults] = useState(params.adults);

  useEffect(() => {
    onChange({ adults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adults]);

  useEffect(() => {
    const newChilds = childs.map(({ code, count }) => ({ code, count }));
    onChange({ childs: newChilds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childs]);

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
      <Category
        name="Взрослые"
        initialValue={adults}
        maxValue={maxAdults}
        minValue={1}
        onChange={setAdults}
      />
      <div>
        {childCategories.map((category, index) => (
          <ChildCategory
            key={category.id}
            category={category}
            maxValue={category.max_childs}
            onChange={(count, code) => updateChilds(count, index)}
          ></ChildCategory>
        ))}
      </div>
    </StyledRoom>
  );
}

export default Room;
