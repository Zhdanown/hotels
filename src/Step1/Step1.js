import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import LayoutContext from "../Layout/LayoutContext";
import Guests from "./Guests";
import DateRangePicker from "./DateRangePicker";
import Button from "../components/Button";
import { searchRooms } from "../rooms/roomsReducer";
import { Centered } from "../components/Centered";
import styled from "styled-components";
import Link from "../components/Link";

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
      <Guests />
      <DateRangePicker />

      <Conditions column>
        <label>
          время заезда <span>17:00</span>, время выезда <span>15:00</span>
        </label>
        <Link href="#">Правила и услуги</Link>
        {/* <a href="#">Правила и услуги</a> */}
      </Conditions>

      <Button block onClick={onButtonClick}>
        Подобрать номера
      </Button>
    </>
  );
}

export default Step1;
