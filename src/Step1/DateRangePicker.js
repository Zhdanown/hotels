import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Litepicker from "litepicker";
import styled from "styled-components";

import { changeParams, getAvailabilityColors } from "../reservation";

const ColorSquare = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  margin-right: 1rem;
`;

const AvailabilityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
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

// const _range = [
//   new Date(2021, 0, 8),
//   new Date(2021, 0, 9),
//   new Date(2021, 0, 10),
//   new Date(2021, 0, 11),
// ];

function DateRangePicker() {
  const [range, setRange] = useState(null);
  const dispatch = useDispatch();
  // const [availableDates, setAvailability] = useState([])

  const availabilityColors = useSelector(getAvailabilityColors);

  useEffect(() => {
    if (!range) return;
    
    const { start, end } = range;

    dispatch(changeParams({
      arrival: start.toLocaleDateString(),
      departure: end.toLocaleDateString(),
    }))

  }, [dispatch, range]);

  // useEffect(() => {
  //   if (config && config.color_availability) {
  //     // const url = `https://nlb.agex.space/api/v1/${config.pms_type}/avilability/${config.id}/?arrival=11.02.2021&departure=13.02.2021&adults=2`
  //     const url = "http://localhost:5000/nlb_api/availability";

  //     async function fetchAvailableDates (url) {
  //       const res = await fetch(url);
  //       const json = await res.json();
  //       setAvailability(json);
  //     }

  //     fetchAvailableDates(url)
  //   }
  // }, [config]);

  useEffect(() => {
    let picker = new Litepicker({
      element: document.getElementById("startDate"),
      elementEnd: document.getElementById("endDate"),
      parentEl: "#date-rande-picker",
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
    <div style={{ margin: "1rem 0" }}>
      <InputContainer>
        <input
          type="date"
          name="startDate"
          id="startDate"
          style={{ width: "8.5rem" }}
        />
        <span style={{ margin: "0 .5rem" }}>{" - "}</span>
        <input
          type="date"
          name="endDate"
          id="endDate"
          style={{ width: "8.5rem" }}
        />
      </InputContainer>
      <DatePickerContainer id="date-rande-picker"></DatePickerContainer>
      <div>
        {availabilityColors.map(item => (
          <AvailabilityItem key={item.id}>
            <ColorSquare color={item.color}></ColorSquare>
            <span>{item.name}</span>
          </AvailabilityItem>
        ))}
      </div>
    </div>
  );
}

export default DateRangePicker;
