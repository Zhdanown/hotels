import React, { useContext } from "react";
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

const Conditions = styled(Centered)`
  margin: 1rem 0;
`;

function Step1() {
  const layoutContext = useContext(LayoutContext);
  const { setStep } = layoutContext;

  const dispatch = useDispatch();

  const onButtonClick = () => {
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

      <Button block onClick={onButtonClick}>
        Подобрать номера
      </Button>
    </>
  );
}

export default Step1;
