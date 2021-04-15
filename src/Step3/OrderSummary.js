import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import plural from "plural-ru";

import { getParams } from "../redux/booking";
import { getPrimaryColor } from "../redux/hotelConfig";
import { hexToRgb, withOpacity } from "../utils/colorHelpers";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  color: ${props => props.color};
  font-weight: ${props => (props.bold ? "bold" : "unset")};

  span {
    text-align: left;
  }
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
  background: rgba(${p => withOpacity(hexToRgb(p.color), 0.1)});
  border-radius: 0.25rem;
`;

function OrderSummary() {
  const orderInfo = useSelector(getParams);

  const color = useSelector(getPrimaryColor);

  const {
    arrival,
    departure,
    adults,
    childs,
    packages,
    rooms_count,
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
        <RowTotal
          label="Стоимость тарифа"
          sum={ratePrice}
          annotation={`${nights} ${nightsPluralised}`}
        />
      </Section>

      {packages.length ? (
        <Section>
          <SelectedExtraServices services={packages} />
        </Section>
      ) : null}

      <Section>
        <SectionHeader color={color}>Стоимость</SectionHeader>
        <RowTotal label="Всего" sum={ratePrice + getSumOfServices(packages)} />
      </Section>
    </Container>
  );
}

export default OrderSummary;

function SelectedExtraServices({ services }) {
  const color = useSelector(getPrimaryColor);
  const totalSumOfServices = getSumOfServices(services);

  return (
    <>
      <SectionHeader color={color}>Дополнительные услуги</SectionHeader>
      {services.map(service => (
        <ExtraService key={service.id} {...service} />
      ))}
      <RowTotal label="Всего за услуги" sum={totalSumOfServices} />
    </>
  );
}

const RowTotal = ({ label, sum, annotation }) => {
  return (
    <Row bold>
      <span>{label}</span>
      <span>
        {sum} &#8381; {annotation && ` / ${annotation}`}
      </span>
    </Row>
  );
};

function ExtraService(props) {
  const { name, totalCost, nights } = props;

  return (
    <Row color="gray">
      <span>{name}</span>
      <span>
        <span>{totalCost} &#8381;</span>
        {nights && <span> / {nights}</span>}
      </span>
    </Row>
  );
}

function getSumOfServices(services) {
  return services.reduce((sum, service) => (sum += service.totalCost), 0);
}
