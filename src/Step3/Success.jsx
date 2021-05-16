import React from "react";
import styled from "styled-components";
import Button from "../components/Button";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  color: ${props => props.color};
  font-weight: ${props => (props.bold ? "bold" : "unset")};
`;

const Section = styled.section`
  margin: 1.5rem 0;
`;

const Container = styled.div`
  padding: 0.5rem;
`;

function Success() {
  return (
    <Container>
      <h4>
        Заказ № <span>184436</span>
      </h4>

      <Section>
        <Row>
          <span>Номер</span>
          <span
            style={{
              fontWeight: 600,
            }}
          >
            Standard без балкона
          </span>
        </Row>
        <Row>
          <span>Даты</span>
          <span>01.03.2021 - 02.03.2021</span>
        </Row>
        <Row>
          <span>Гости</span>
          <span>2 взрослых, 2 детей</span>
        </Row>
        <Row>
          <span>комнат</span>
          <span>2</span>
        </Row>
      </Section>

      <Section>
        <h5>Дополнительные услуги</h5>
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
        <h5>Заметки к заказу</h5>
        <span>Разбудить в 7:30</span>
      </Section>
      <Section>
        <h5>Стоимость</h5>
        <Row bold>
          <span>Всего</span>
          <span>8700 &#8381;</span>
        </Row>
      </Section>
      <Button block>Перейти к оплате</Button>
    </Container>
  );
}

export default Success;
