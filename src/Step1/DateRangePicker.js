import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Litepicker from "litepicker";
import styled, { createGlobalStyle } from "styled-components";
import { getPrimaryColor, getArrivalDepartureTime } from "../redux/hotelConfig";
import { changeParams } from "../redux/booking";
import { hexToRgb, withOpacity } from "../hexToRgb";
import Input from "../components/Input";

const CalendarTheme = createGlobalStyle`
  :root {
    --litepickerDayIsStartBg: ${props => props.primaryColor} !important;
    --litepickerDayIsEndBg: ${props => props.primaryColor};
    --litepickerDayIsInRange: rgba(${props =>
      withOpacity(hexToRgb(props.primaryColor), 0.3)});
    --litepickerDayColorHover: #333333;
    --litepickerDayIsTodayColor: ${props => props.primaryColor};
    --litepickerMonthButtonHover: ${props => props.primaryColor};
  }
`;

const InputContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
`;

const DatePickerContainer = styled.div`
  position: relative;
  text-align: center;
`;

function DateRangePicker() {
  const start = new Date();
  const end = new Date(new Date().setDate(start.getDate() + 1));
  const [range, setRange] = useState({ start, end });

  const dispatch = useDispatch();
  const primaryColor = useSelector(getPrimaryColor);
  const { arrivalTime, departureTime } = useSelector(getArrivalDepartureTime);

  useEffect(() => {
    if (!range) return;

    const { start, end } = range;

    dispatch(
      changeParams({
        arrival: start.toLocaleDateString(),
        departure: end.toLocaleDateString(),
      })
    );
  }, [dispatch, range]);

  useEffect(() => {
    let picker = new Litepicker({
      element: document.getElementById("startDate"),
      elementEnd: document.getElementById("endDate"),
      parentEl: "#date-rande-picker",
      startDate: range.start,
      endDate: range.end,
      autoRefresh: true,
      inlineMode: true,
      singleMode: false,
      lang: "ru-RU",
      hotelMode: true,
      tooltipText: {
        one: "ночь",
        other: "ночей",
        few: "ночи",
        many: "ночей",
      },
      minDate: new Date().setHours(0, 0, 0, 0),
      onSelect: (start, end) => setRange({ start, end }),
    });

    document.addEventListener("click", e => {
      let el = e.target;
      let isDayItem = el && el.classList.contains("day-item");
      let isStartDate = !document.querySelector(".day-item.is-end-date");

      if (isDayItem && isStartDate) {
        let startDate = new Date(Number(el.dataset.time));
        onStartChange(startDate);
      }
    });

    function onStartChange(startDate) {
      // const inRange = _range.find(
      //   date => date.getDate() === startDate.getDate()
      // );
      //   if (inRange) {
      //   debugger
      //   picker.setLockDays(range);
      //   }
    }

    return () => picker.destroy();
  }, []);

  return (
    <div style={{ margin: "2rem 0" }}>
      <InputContainer>
        <Input
          color="green"
          type="text"
          name="startDate"
          id="startDate"
          label={`Заезд (${arrivalTime})`}
          value={range.start}
          readOnly
          inputStyles={{ width: "7rem" }}
        />
        <span style={{ margin: "0 1.25rem" }}>{" - "}</span>
        <Input
          inputStyles={{ width: "7rem" }}
          color="green"
          type="text"
          name="endDate"
          id="endDate"
          label={`Выезд (${departureTime})`}
          value={range.end}
          readOnly
        />
      </InputContainer>
      <CalendarTheme primaryColor={primaryColor} />
      <DatePickerContainer id="date-rande-picker"></DatePickerContainer>
    </div>
  );
}

export default DateRangePicker;
