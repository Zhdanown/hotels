import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Accordion, { Icon } from "../../components/Accordion";
import Button from "../../components/Button";
import HTMLParser from "../../components/HTMLParser";
import { mediumMobileWidth } from "../../Layout/MediaQueries";
import { getPrimaryColor } from "../../redux/hotelConfig";
import { Rate } from "./types";

const StyledRoomRate = styled.div<{ bg: string }>`
  border-bottom: 1px solid ${props => props.bg};
  border-top: 1px solid ${props => props.bg};
  padding: 1rem 0;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

const LongDescription = styled.div`
  text-align: justify;

  @media (max-width: ${mediumMobileWidth}) {
    font-size: 0.8rem;
  }
`;

export const RateInfo = ({ rate }: { rate: Rate }) => {
  const primaryColor = useSelector(getPrimaryColor);

  const { name, short_description, long_description } = rate;

  return (
    <StyledRoomRate bg={primaryColor}>
      <p className="title is-6">{name}</p>
      {short_description && <HTMLParser html={short_description} />}
      <Accordion
        renderTitle={(toggle: () => void, isOpen: boolean) => (
          <Button small outline onClick={toggle} style={{ margin: ".5rem 0" }}>
            {isOpen ? "Скрыть описание тарифа" : "Подробнее о тарифе"}
            <Icon open={isOpen} />
          </Button>
        )}
        renderTitleAfter={null}
      >
        {long_description ? (
          <LongDescription>
            <HTMLParser html={long_description} />
          </LongDescription>
        ) : (
          <LongDescription>Нет описания</LongDescription>
        )}
      </Accordion>
    </StyledRoomRate>
  );
};
