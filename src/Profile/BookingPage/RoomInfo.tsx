import React from "react";
import styled from "styled-components";
import Accordion, { Icon } from "../../components/Accordion";
import Button from "../../components/Button";
import HTMLParser from "../../components/HTMLParser";
import { Room } from "./types";

type ArrayOfDuplets = [number, number][];

const heightMap: ArrayOfDuplets = [
  [1024, 350],
  [768, 300],
  [600, 250],
  [550, 200],
  [400, 150],
];

const mapMaxWidthToHeight = (maxWidthToHeightMap: ArrayOfDuplets) =>
  maxWidthToHeightMap
    .map(
      ([maxWidth, height]) => `
      @media screen and (max-width: ${maxWidth}px) {
        & {
          height: ${height}px;
        }
      }`
    )
    .join("");

const ImageContainer = styled.div`
  overflow: hidden;
  height: 350px;

  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
    transition: transform 1s;
  }

  ${mapMaxWidthToHeight(heightMap)}
`;

export const RoomInfo = ({ room }: { room: Room & { rate_name: string } }) => {
  const { square, img, name, short_description, long_description, rate_name } = room;

  return (
    <div>
      <ImageContainer className="mt-3">
        <img src={img} alt="room_image" />
      </ImageContainer>

      <div className="mb-4 mt-4">
        <p className="title is-6">
          {name},{" "}
          <span>
            {square} м<sup>2</sup>
          </span>
        </p>
        <p className="subtitle is-6">{rate_name}</p>

        <HTMLParser html={short_description} />

        {long_description && (
          <div className="mt-3 mb-3">
            <Accordion
              renderTitleAfter={(toggle: () => void, isOpen: boolean) => (
                <Button
                  small
                  outline
                  onClick={toggle}
                  style={{ margin: ".5rem 0" }}
                >
                  {isOpen ? "Скрыть описание" : "Развернуть описание"}
                  <Icon open={isOpen} />
                </Button>
              )}
              renderTitle={null}
            >
              <HTMLParser html={long_description} />
            </Accordion>
          </div>
        )}

        
      </div>
    </div>
  );
};
