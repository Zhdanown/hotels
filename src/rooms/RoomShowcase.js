import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import RoomRate from "./RoomRate";
import ImageGallery from "./ImageGallery";
import Price from "./Price";
import RoomFeatures from "./RoomFeatures";
import HTMLParser from "../components/HTMLParser";
import Button from "../components/Button";
import Accordion, { Icon, Title } from "../components/Accordion";

import { ImagePreviewContainerQueries } from "../Layout/MediaQueries";
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
  } = room;

  const onRateSelect = rate => {
    onSelect({ room, rate });
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
          <img src={preview_img} alt="room preview" />
        </ImageContainer>
        <TitleSection>
          <RoomName>{name}</RoomName>
          <Price price={min_price} oldPrice={original_price} />
        </TitleSection>
      </ImagePreview>

      <Content>
        <Accordion
          renderTitle={(toggle, open) => (
            <Title onClick={toggle} style={{ justifyContent: "center" }}>
              Информация о номере <Icon open={open} />
            </Title>
          )}
        >
          <HTMLParser html={short_description} />
          <RoomFeatures />
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
        <Button small onClick={toggle} style={{ margin: ".5rem" }}>
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

const StyledRoomShowcase = styled.div`
  box-shadow: 0 0 10px 5px #ddd;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow: hidden;
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
