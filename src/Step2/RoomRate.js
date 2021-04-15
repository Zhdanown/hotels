import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Button from "../components/Button";
import HTMLParser from "../components/HTMLParser";
import Accordion, { Icon, Title } from "../components/Accordion";

import { getPrimaryColor } from "../redux/hotelConfig";
import Price from "./Price";
import { Justified } from "../components/Centered";
import { mediumMobileWidth } from "../Layout/MediaQueries";

const StyledRoomRate = styled.div`
  border-bottom: 1px solid ${props => props.bg};
  padding: 1rem 0;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export default function RoomRate({ rate, onClick }) {
  const primaryColor = useSelector(getPrimaryColor);
  const {
    short_description,
    long_description,
    total_price,
    original_total_price,
  } = rate;

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
              <Button
                small
                onClick={() => onClick(rate)}
                style={{ alignSelf: "center" }}
              >
                Выбрать
              </Button>
            </Justified>
          </>
        )}
        style={{ marginBottom: "2rem" }}
      >
        {long_description ? (
          <LongDescription>
            <HTMLParser html={long_description} />
          </LongDescription>
        ) : (
          <LongDescription>Нет описания</LongDescription>
        )}
      </Accordion>
      <Justified alignV="center">
        <span>Стоимость</span>
        <Price price={total_price} oldPrice={original_total_price} />
      </Justified>
    </StyledRoomRate>
  );
}

const LongDescription = styled.div`
  text-align: justify;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 0.8rem;
  }
`;
