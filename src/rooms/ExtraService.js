import React from "react";
import styled from "styled-components";
import Accordion, { Title, Icon } from "../components/Accordion";
import Checkbox from "../components/Checkbox";

function ExtraService(props) {
  const { id, name, short_description, long_description, img } = props;
  return (
    <StyledService>
      <HeaderSection>
        <Checkbox
          label={name}
          value={false}
          onChange={value => console.log(`${name}:`, value)}
        />
        <span>3800 Р</span>
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

const StyledService = styled.article`
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
`;

const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
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
  }
`;

const ShortDescription = styled.div`
  text-align: justify;
  margin: 0 0.5rem;
  flex: 1;
`;

const BodySection = styled.section`
  display: flex;

  @media screen and (max-width: 375px) {
    flex-direction: column;

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
`;
