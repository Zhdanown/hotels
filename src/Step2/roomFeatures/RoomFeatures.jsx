import React from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";

import Accordion, {
  Title,
  Icon as AccordionIcon,
} from "../../components/Accordion";
import { IconLoader } from "./IconLoader";

function splitByChunksOfTwo(resultArray, item, index) {
  const chunkIndex = Math.floor(index / 2);
  const copy = resultArray.slice();
  if (!resultArray[chunkIndex]) {
    copy[chunkIndex] = { id: nanoid(), items: [] };
  }
  copy[chunkIndex].items.push(item);

  return copy;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 425px) {
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 1024px) and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export function RoomFeatures({ features }) {
  const alwaysVisibleFeatures = features
    .filter(feature => feature.show_always)
    .reduce(splitByChunksOfTwo, []);
  const collapsibleFeatures = features
    .filter(feature => !feature.show_always)
    .reduce(splitByChunksOfTwo, []);

  return (
    <div>
      {alwaysVisibleFeatures.map(chunk => (
        <Container key={chunk.id}>
          {chunk.items.map(feature => (
            <FeatureItem key={feature.code} feature={feature} />
          ))}
        </Container>
      ))}

      <Accordion
        renderTitleAfter={(toggle, open) => (
          <Title onClick={toggle} style={{ justifyContent: "center" }}>
            <span>{open ? "Скрыть" : "Подробнее"}</span>
            <AccordionIcon open={open} />
          </Title>
        )}
      >
        {collapsibleFeatures.map(chunk => (
          <Container key={chunk.id}>
            {chunk.items.map(feature => (
              <FeatureItem key={feature.code} feature={feature} />
            ))}
          </Container>
        ))}
      </Accordion>
    </div>
  );
}

function FeatureItem({ feature }) {
  const { name, icon_url } = feature;
  return (
    <StyledFeatureItem>
      <IconLoader url={icon_url} />
      <span>{name}</span>
    </StyledFeatureItem>
  );
}

const StyledFeatureItem = styled.div`
  display: inline-flex;
  align-items: center;

  span {
    margin-left: 0.5rem;
  }
`;
