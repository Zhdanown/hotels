import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import plural from "plural-ru";

import Accordion, { Title, Icon } from "../components/Accordion";
import Checkbox from "../components/Checkbox";
import { getNightsCount } from "../redux/booking";
import { getServiceCost } from "./roomsReducer";
import { mediumMobileWidth } from "../Layout/MediaQueries";

function ExtraService(props) {
  const { id, name, short_description, long_description, img, code } = props;

  const nightsCount = useSelector(getNightsCount);
  const { package_price: price, time_period } = props;
  const totalCost = getServiceCost[time_period](price, nightsCount);
  const nightsPluralized = plural(nightsCount, "ночь", "ночи", "ночей");
  const nights =
    time_period === "EVERY_NIGHT" ? `${nightsCount} ${nightsPluralized}` : null;

  const onServiceSelect = selected => {
    props.onSelect({
      id,
      code,
      name,
      selected,
      price,
      time_period,
      totalCost,
      nights,
    });
  };

  return (
    <StyledService>
      <HeaderSection>
        <Checkbox label={name} value={false} onChange={onServiceSelect} />
        <PriceTag>
          <PriceValue>{totalCost} &#8381;</PriceValue>
          {nights && <NightsCount>{nights}</NightsCount>}
        </PriceTag>
      </HeaderSection>
      <BodySection>
        <Image src={img} alt={name} />
        <ShortDescription>{short_description}</ShortDescription>
      </BodySection>
      <LongDescription description={long_description} />
    </StyledService>
  );
}

export default ExtraService;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PriceValue = styled.span`
  font-size: 1.2rem;
  line-height: 1.2rem;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 1rem;
    line-height: 1rem;
  }
`;
const NightsCount = styled.span`
  color: #aaa;
  font-size: 0.8rem;
`;

const StyledService = styled.article`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #ccc;

  @media (max-width: ${mediumMobileWidth}) {
    padding: 1rem 0.75rem;
  }
`;

const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  margin-bottom: 0.5rem;

  h5 {
    font-weight: bold;
  }

  span {
    white-space: nowrap;
  }

  label {
    margin-right: 1rem;
  }
`;

const ImageWrapper = styled.div`
  width: 100px;
  img {
    width: 100%;
    border-radius: 0.25rem;
  }
`;

const ShortDescription = styled.div`
  text-align: justify;
  margin: 0 0.5rem;
  flex: 1;
`;

const BodySection = styled.section`
  display: flex;

  @media (max-width: ${mediumMobileWidth}) {
    flex-direction: column;
    font-size: 0.8rem;

    ${ImageWrapper} {
      width: 100%;
    }

    ${ShortDescription} {
      margin: 0;
    }
  }
`;

function Image({ src, alt }) {
  if (!src) return null;
  return (
    <ImageWrapper>
      <img src={src} alt={alt} />
    </ImageWrapper>
  );
}

function LongDescription({ description }) {
  if (!description) return null;
  return (
    <Accordion
      renderTitle={(toggle, isOpen) => (
        <Title onClick={toggle} style={{ justifyContent: "center" }}>
          {isOpen ? "Скрыть" : "Подробнее"} <Icon open={isOpen} />
        </Title>
      )}
    >
      <Description>{description}</Description>
    </Accordion>
  );
}

const Description = styled.p`
  text-align: justify;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 1rem;
  }
`;
