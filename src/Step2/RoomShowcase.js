import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import RoomRate from "./RoomRate";
import ImageGallery from "./ImageGallery";
import Price from "./Price";
import { RoomFeatures } from "./roomFeatures";
import HTMLParser from "../components/HTMLParser";
import Button from "../components/Button";
import { Card } from "../components/styled";
import Accordion, { Icon, Title } from "../components/Accordion";
import {
  ImagePreviewContainerQueries,
  mediumMobileWidth,
} from "../Layout/MediaQueries";
import { getPrimaryColor } from "../redux/hotelConfig";

export default function RoomShowcase({ room, onSelect }) {
  const primaryColor = useSelector(getPrimaryColor);

  const {
    preview_img,
    images,
    name,
    min_price,
    original_price,
    short_description,
    rates,
    square,
    room_options,
  } = room;

  const onRateSelect = rate => {
    onSelect({ room, rate });
  };

  const [isGalleryOpen, toggleGallery] = useState(false);

  const pricePrefix = rates.length > 1 ? "от" : null;

  return (
    <StyledRoomShowcase bgColor={primaryColor}>
      <ImageGallery
        images={images}
        open={isGalleryOpen}
        toggle={toggleGallery}
      />

      <ImagePreview onClick={() => toggleGallery(true)}>
        <ImageContainer>
          <img src={preview_img} alt="room preview" />
        </ImageContainer>
        <TitleSection>
          <RoomName>{name}</RoomName>

          <Price
            price={min_price}
            oldPrice={original_price}
            prefix={pricePrefix}
          />
        </TitleSection>
      </ImagePreview>

      <Content>
        <Accordion
          renderTitle={(toggle, open) => (
            <Title
              onClick={toggle}
              style={{ justifyContent: "center", marginBottom: "1rem" }}
            >
              Информация о номере <Icon open={open} />
            </Title>
          )}
        >
          <RoomDetails style={{ paddingBottom: "1rem" }}>
            <HTMLParser html={short_description} />
            {square ? (
              <Title>
                {square} м<sup>2</sup>
              </Title>
            ) : null}
            {room_options.length ? (
              <RoomFeatures features={room_options} />
            ) : null}
          </RoomDetails>
        </Accordion>

        <Rates rates={rates} onRateSelect={onRateSelect} />
      </Content>
    </StyledRoomShowcase>
  );
}

function Rates({ rates, onRateSelect }) {
  //sort rates by price from most expensive to cheapest
  const sortedRates = [...rates].sort((a, b) => b.total_price - a.total_price);

  return sortedRates.length > 1 ? (
    <Accordion
      renderTitle={(toggle, open) => (
        <Button small block onClick={toggle} style={{ margin: ".5rem 0" }}>
          {open ? "Скрыть тарифы" : "Смотреть тарифы"}
          <Icon open={open} />
        </Button>
      )}
    >
      {sortedRates.map(rate => (
        <RoomRate key={rate.rate_code} rate={rate} onClick={onRateSelect} />
      ))}
    </Accordion>
  ) : (
    <RoomRate
      key={sortedRates[0].rate_code}
      rate={rates[0]}
      onClick={onRateSelect}
    />
  );
}

const StyledRoomShowcase = styled(Card)`
  overflow: hidden;
  // display: inline-block;
`;

const titleColor = "#333333";

const TitleSection = styled.div`
  position: absolute;
  bottom: 0;
  color: ${titleColor};
  width: 100%;
  padding: 2rem;
  background: linear-gradient(0deg, white, transparent);
  text-align: center;
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

const RoomDetails = styled.div`
  text-align: center;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 0.8rem;
  }
`;
