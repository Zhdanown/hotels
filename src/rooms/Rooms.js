import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import HTMLParser from "../components/HTMLParser";
import Button from "../components/Button";
import Accordion, { Title, Icon } from "../components/Accordion";
import { changeParams } from "../redux/booking";
import { getPackages, getPrimaryColor } from "../redux/hotelConfig";
import { getRooms } from "./roomsReducer";
import ImageGallery from "./ImageGallery";
import { ImagePreviewContainerQueries } from "../Layout/MediaQueries";
import { urlWithHost } from "../Step3/urlWithHost";
import ColumnHeader from "../components/ColumnHeader";

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
              <div>
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

const StyledRoomShowcase = styled.div`
  // border: 1px solid black;
  box-shadow: 0 0 10px 5px #ddd;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow: hidden;
`;

const s1 = `
  text-align: center;
  
`;

const TitleSection = styled.div`
  position: absolute;
  bottom: 0;
  color: white;
  width: 100%;
  padding: 2rem;
  background: linear-gradient(0deg, black, transparent);
  ${s1}
`;

const RoomName = styled.h4`
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  &:after {
    content: "";
    display: block;
    width: 30%;
    height: 2px;
    background: white;
    margin: auto;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  background: linear-gradient(0deg, black, gray);

  &:hover {
    ${TitleSection} {
    }
    img {
      transform: scale(1.1);
    }
  }
`;

const ImageContainer = styled.div`
  overflow: hidden;
  height: 230px;

  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
    transition: transform 1s;
  }

  ${ImagePreviewContainerQueries}
`;

function RoomShowcase({ room, onSelect }) {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const primaryColor = useSelector(getPrimaryColor);

  const {
    preview_img,
    images,
    name,
    room_code,
    max_price,
    short_description,
    rates,
  } = room;

  // const dispatch = useDispatch();
  const onRateSelect = rate => {
    onSelect({ room, rate });
    // setStep(step => ++step);
    // dispatch(changeParams({ room, rate }));
  };

  const [isGalleryOpen, toggleGallery] = useState(false);

  return (
    <StyledRoomShowcase bgColor={primaryColor}>
      <ImageGallery
        images={images}
        open={isGalleryOpen}
        toggle={toggleGallery}
      />

      <ImagePreview onClick={() => toggleGallery(true)}>
        <ImageContainer>
          <img src={urlWithHost(preview_img)} alt="room preview" />
        </ImageContainer>
        <TitleSection>
          <RoomName>{name}</RoomName>
          <span>
            <b>{max_price} &#8381;</b>
          </span>
        </TitleSection>
      </ImagePreview>

      <Content>
        <Accordion
          opened
          renderTitle={(toggle, open) => (
            <Title onClick={toggle} style={{ justifyContent: "center" }}>
              Информация о номере <Icon open={open} />
            </Title>
          )}
        >
          <HTMLParser html={short_description} />
        </Accordion>

        <Accordion
          renderTitle={(toggle, open) => (
            <Button small onClick={toggle} style={{ margin: ".5rem" }}>
              {open ? "Скрыть тарифы" : "Выбрать тариф"}
              <Icon open={open} />
            </Button>
          )}
        >
          {rates.map(rate => (
            <RoomRate key={rate.rate_code} rate={rate} onClick={onRateSelect} />
          ))}
        </Accordion>
        {/* <h4 style={{ textAlign: "center", marginTop: "2rem" }}>Тарифы</h4> */}
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
