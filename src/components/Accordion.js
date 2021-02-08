import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { CaretDownFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getPrimaryColor } from "../redux/hotelConfig";

const SPEED = 0.4;

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.p`
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
`;

const TitleWrapper = styled.div`
  transition: background-color ${SPEED}s ease;

  ${Title}:hover {
    color: ${p => p.color};
  }
`;

export const Icon = styled(CaretDownFilled)`
  margin-left: 0.5rem;
  transition: transform ${SPEED}s ease;
  ${p => (p.active ? "transform: rotate(180deg);" : "")}
`;

const ContentWrapper = styled.div`
  background-color: white;
  overflow: hidden;
  transition: max-height ${SPEED}s ease, opacity ${SPEED * 2}s;
  max-height: ${p => p.height};
  opacity: ${p => (p.active ? 1 : 0)};
`;

function Accordion({ renderTitle, children, opened = false }) {
  const color = useSelector(getPrimaryColor);
  const [active, setActive] = useState(opened);
  const [height, setHeight] = useState("0px");

  const content = useRef(null);

  useEffect(() => {
    setHeight(active ? `${content.current.scrollHeight}px` : "0px");
  }, [active]);

  const toggleAccordion = () => {
    setActive(state => !state);
  };

  return (
    <AccordionSection>
      <TitleWrapper active={active ? 1 : 0} color={color}>
        {renderTitle && renderTitle(toggleAccordion, active)}
      </TitleWrapper>
      <ContentWrapper ref={content} height={height} active={active}>
        {children}
      </ContentWrapper>
    </AccordionSection>
  );
}

export default Accordion;
