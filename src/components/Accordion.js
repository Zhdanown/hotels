import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { CaretDownFilled } from "@ant-design/icons";

const SPEED = "0.2s";

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  transition: background-color ${SPEED} ease;
`;

export const Title = styled.p`
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const Icon = styled(CaretDownFilled)`
  margin-left: 0.5rem;
  transition: transform ${SPEED} ease;
  ${p => (p.active ? "transform: rotate(180deg);" : "")}
`;

const ContentWrapper = styled.div`
  background-color: white;
  overflow: hidden;
  transition: max-height ${SPEED} ease;
  max-height: ${p => p.height};
`;

function Accordion({ renderTitle, children, opened = false }) {
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
      <TitleWrapper active={active ? 1 : 0}>
        {renderTitle && renderTitle(toggleAccordion, active)}
      </TitleWrapper>
      <ContentWrapper ref={content} height={height}>
        {children}
      </ContentWrapper>
    </AccordionSection>
  );
}

export default Accordion;
