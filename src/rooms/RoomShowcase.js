import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import RoomRate from "./RoomRate";
import ImageGallery from "./ImageGallery";
import RoomFeatures from "./RoomFeatures";
import HTMLParser from "../components/HTMLParser";
import Button from "../components/Button";
import Accordion, { Icon, Title } from "../components/Accordion";

import { ImagePreviewContainerQueries } from "../Layout/MediaQueries";
import { getPrimaryColor } from "../redux/hotelConfig";
import { urlWithHost } from "../Step3/urlWithHost";

const StyledRoomShowcase = styled.div`
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

export default function RoomShowcase({ room, onSelect }) {
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
