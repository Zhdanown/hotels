import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Button from "../components/Button";
import HTMLParser from "../components/HTMLParser";
import Accordion, { Icon, Title } from "../components/Accordion";

import { getPrimaryColor } from "../redux/hotelConfig";

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

export default function RoomRate({ rate, onClick }) {
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
