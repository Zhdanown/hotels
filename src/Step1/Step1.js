import React, { useContext } from "react";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import LayoutContext from "../Layout/LayoutContext";
import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Button from "../components/Button";
import Link from "../components/Link";
import { Centered } from "../components/Centered";
import { searchRooms } from "../rooms/roomsReducer";
import ColumnHeader from "../components/ColumnHeader";
import useWindowWidth from "../Layout/hooks/useWindowWidth";

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function Step1() {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(searchRooms());
    setStep(step => ++step);
  };

  return (
    <>
      <ColumnHeader>Параметры бронирования</ColumnHeader>
      <Guests />
      <DateRangePicker />

      <Conditions column>
        <Link href="#" underlined>
          Правила и услуги
        </Link>
      </Conditions>
      <SearchRoomButton onClick={onClick} />
    </>
  );
}

export default Step1;

function SearchRoomButton({ onClick }) {
  const [, , isDesktop] = useWindowWidth();
  return isDesktop ? (
    <Button block onClick={onClick}>
      Подобрать номера
    </Button>
  ) : (
    <FloatingButton onClick={onClick}>Подобрать номера</FloatingButton>
  );
}

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 0;
  margin: 1.5rem 0;
  width: ${p => p.width};
`;

function FloatingButton({ onClick, children }) {
  const [windowWidth] = useWindowWidth();
  const ref = useRef();
  const [width, setWidth] = useState("100%");

  useEffect(() => {
    let timeout;
    if (ref.current) {
      timeout = setTimeout(() => setWidth(ref.current.offsetWidth + "px"), 300);
    }
    return () => clearTimeout(timeout);
  }, [ref, windowWidth]);

  return (
    <div ref={ref} style={{ marginTop: "4rem" }}>
      <StyledButton block onClick={onClick} width={width}>
        {children}
      </StyledButton>
    </div>
  );
}
