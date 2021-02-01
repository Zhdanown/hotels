import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import HTMLParser from "./HTMLParser";
import Button from "../components/Button";
import Accordion, { Title, Icon } from "../components/Accordion";
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
  margin: 1rem 0;
  overflow: hidden;
`;

const RoomTitle = styled.div`
  position: absolute;
  top: 0;
  color: white;
  width: 100%;
  padding: 1rem;
`;

const Content = styled.div`
  padding: 1rem;
`;

function RoomShowcase({ room }) {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const primaryColor = useSelector(getPrimaryColor);

  const {
    preview_img,
    name,
    room_code,
    max_price,
    short_description,
    rates,
  } = room;

  const dispatch = useDispatch();
  const onRateSelect = rate => {
    setStep(step => ++step);
    dispatch(changeParams({ room, rate }));
  };

  return (
    <StyledRoomShowcase bgColor={primaryColor} style={{ position: "relative" }}>
      <div className="image-preview">
        <img src={preview_img} alt="" style={{ width: "100%" }} />
        <RoomTitle>
          <h4>{name}</h4>
          <span>
            <b>{max_price} &#8381;</b>
          </span>
        </RoomTitle>
      </div>

      <Content>
        <Accordion
          opened
          renderTitle={(toggle, active) => (
            <Title onClick={toggle} style={{ justifyContent: "center" }}>
              Информация о номере <Icon active={active ? 1 : 0} />
            </Title>
          )}
        >
          <HTMLParser html={short_description} />
        </Accordion>

        <h4 style={{ textAlign: "center", marginTop: "2rem" }}>Тарифы</h4>
        {rates.map(rate => (
          <RoomRate key={rate.rate_code} rate={rate} onClick={onRateSelect} />
        ))}
      </Content>
    </StyledRoomShowcase>
  );
}

const StyledRoomRate = styled.div`
  border-bottom: 1px solid ${props => props.bg};
  padding: 1rem 0;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

const RateHeader = styled.h5`
  display: flex;
  justify-content: space-between;
`;

const Night = styled.div`
  display: flex;
  justify-content: space-between;
`;

function RoomRate({ rate, onClick }) {
  const primaryColor = useSelector(getPrimaryColor);
  const {
    rate_code,
    short_description,
    long_description,
    total_price,
    nights,
  } = rate;
  return (
    <StyledRoomRate bg={primaryColor}>
      <Accordion
        renderTitle={(toggle, active) => (
          <>
            <RateHeader bg={primaryColor}>
              <Title onClick={toggle}>
                {rate_code} {total_price} &#8381;{" "}
                <Icon active={active ? 1 : 0} />
              </Title>
              <Button small onClick={() => onClick(rate)}>
                Выбрать
              </Button>
            </RateHeader>
            <HTMLParser html={short_description} />
          </>
        )}
        style={{ marginBottom: "2rem" }}
      >
        {long_description ? (
          <HTMLParser html={long_description} />
        ) : (
          <p>Нет описания</p>
        )}
      </Accordion>
      {nights.map(night => (
        <Night key={night.date}>
          <span>{night.date}</span>
          <b>{night.price} &#8381;</b>
        </Night>
      ))}
    </StyledRoomRate>
  );
}

export default Rooms;
