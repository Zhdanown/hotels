import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import plural from "plural-ru";

import { getParams } from "../redux/booking";
import { getPrimaryColor } from "../redux/hotelConfig";
import { hexToRgb, withOpacity } from "../hexToRgb";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  color: ${props => props.color};
  font-weight: ${props => (props.bold ? "bold" : "unset")};
`;

const Value = styled.span`
  font-weight: bold;
`;

const Section = styled.section`
  margin: 1.5rem 0;
`;

const Container = styled.div`
  margin-top: 2rem;
`;

const SectionHeader = styled.h5`
  background: rgba(${p => withOpacity(hexToRgb(p.color), 0.1)})};
  border-radius: .25rem;
`;

function OrderSummary() {
  const orderInfo = useSelector(getParams);

  const color = useSelector(getPrimaryColor);

  const {
    arrival,
    departure,
    adults,
    childs,
    rooms_count,
    notes,
    room,
    rate,
  } = orderInfo;

  const childsCount = childs.reduce(
    (count, category) => (count += category.count),
    0
  );

  const ratePrice = rate ? rate.total_price : null;
  const nights = rate ? rate.nights.length : null;
  const nightsPluralised = plural(nights, "ночь", "ночи", "ночей");

  const adultsPluralised = plural(adults, "взрослый", "взрослых", "взрослых");
  const childsPluralised = plural(childsCount, "ребёнок", "детей", "детей");

  let guests = `${adults} ${adultsPluralised}`;
  if (childsCount) {
    guests += `, ${childsCount} ${childsPluralised}`;
  }

  return (
    <Container>
      <h4 style={{ fontSize: "1.2rem" }}> Информация о заказе</h4>

      <Section>
        <Row>
          <span>Номер</span>
          <Value>{room && room.name}</Value>
        </Row>
        <Row>
          <span>Прибытие</span>
          <Value>{arrival}</Value>
        </Row>
        <Row>
          <span>Выезд</span>
          <Value>{departure}</Value>
        </Row>
        <Row>
          <span>Гости</span>
          <Value>{guests}</Value>
        </Row>
        <Row>
          <span>Комнат</span>
          <Value>{rooms_count}</Value>
        </Row>
      </Section>

      <Section>
        <SectionHeader color={color}>Дополнительные услуги</SectionHeader>
        <Row color="gray">
          <span>Бассейн (вкл.)</span>
          <span>Ежедневно</span>
        </Row>
        <Row color="gray">
          <span>Завтрак (вкл.)</span>
          <span>Ежедневно</span>
        </Row>
        <Row color="gray">
          <span>Обед (вкл.)</span>
          <span>Ежедневно</span>
        </Row>
      </Section>

      <Section>
        <SectionHeader color={color}>Стоимость</SectionHeader>
        <Row bold>
          <span>Всего</span>
          <span>
            {ratePrice} &#8381; / {nights} {nightsPluralised}
          </span>
        </Row>
      </Section>
    </Container>
  );
}

export default OrderSummary;
