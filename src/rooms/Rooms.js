import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import ImageGallery from "./ImageGallery";
import RoomFeatures from "./RoomFeatures";
import HTMLParser from "../components/HTMLParser";
import Button from "../components/Button";
import ColumnHeader from "../components/ColumnHeader";
import Accordion, { Title, Icon } from "../components/Accordion";
import { ImagePreviewContainerQueries } from "../Layout/MediaQueries";
import { getRooms } from "./roomsReducer";
import { changeParams } from "../redux/booking";
import { getPackages, getPrimaryColor } from "../redux/hotelConfig";
import { urlWithHost } from "../Step3/urlWithHost";

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
              <div key={packageItem.id}>
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

const titleColor = "#333333";

const TitleSection = styled.div`
  position: absolute;
  bottom: 0;
  color: ${titleColor};
  width: 100%;
  padding: 2rem;
  background: linear-gradient(0deg, white, transparent);
  ${s1}
`;

const RoomName = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  &:after {
    content: "";
    display: block;
    width: 30%;
    height: 2px;
    background: ${titleColor};
    margin: auto;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  background: white;

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
          <RoomFeatures />
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

const Justified = styled.div`
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

  const totalCost = nights.reduce((sum, night) => sum + night.price, 0);

  return (
    <StyledRoomRate bg={primaryColor}>
      <Accordion
        renderTitle={(toggle, active) => (
          <>
            <Justified bg={primaryColor} style={{ marginBottom: "1rem" }}>
              <Title onClick={toggle} style={{ marginRight: "1rem" }}>
                {short_description ? (
                  <HTMLParser
                    html={short_description}
                    style={{ textAlign: "left" }}
                  />
                ) : (
                  <span>Нет названия тарифа</span>
                )}{" "}
                <Icon active={active ? 1 : 0} />
              </Title>
              <Button small onClick={() => onClick(rate)}>
                Выбрать
              </Button>
            </Justified>
          </>
        )}
        style={{ marginBottom: "2rem" }}
      >
        {long_description ? (
          <HTMLParser
            html={long_description}
            style={{ textAlign: "justify" }}
          />
        ) : (
          <p>Нет описания</p>
        )}
      </Accordion>
      <Justified>
        <span>Стоимость</span>
        <b>{totalCost} &#8381;</b>
      </Justified>
    </StyledRoomRate>
  );
}

export default Rooms;
