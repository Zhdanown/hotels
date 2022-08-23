import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import  { createGlobalStyle } from "styled-components";
import { getPrimaryColor, getArrivalDepartureTime } from "../redux/hotelConfig";
import { changeParams, getParams } from "../redux/booking";
import { pickTextColorBasedOnBgColor } from "../utils/colorHelpers";
import { stringToDate } from "../utils/dateHelpers";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Russian } from "flatpickr/dist/l10n/ru";
import { isBefore, sub } from "date-fns";

const FlatpickrTheme = createGlobalStyle`
  .flatpickr-months .flatpickr-month, 
  .flatpickr-current-month .flatpickr-monthDropdown-months, 
  .flatpickr-weekdays, span.flatpickr-weekday {
    background: ${p => p.primaryColor};
    color: ${p => p.textColor};
  }

  .flatpickr-day.selected, .flatpickr-day.selected:hover,
  span.flatpickr-day.startRange, span.flatpickr-day.startRange:hover,
  span.flatpickr-day.endRange, span.flatpickr-day.endRange:hover,

  .flatpickr-day.endRange.nextMonthDay, 
  .flatpickr-day.selected.prevMonthDay, 
  .flatpickr-day.selected.prevMonthDay.startRange, 
  .flatpickr-day.startRange.prevMonthDay {
    background: ${p => p.primaryColor};
    border-color: ${p => p.primaryColor};
    color: ${p => p.textColor};
  }

  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)), 
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)), 
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)) {
    webkit-box-shadow: -10px 0 0 ${p => p.primaryColor};
    box-shadow: -10px 0 0 ${p => p.primaryColor};
  }
`;

function DateRangePicker() {
  const { arrival, departure } = useSelector(getParams);
  const [range, setRange] = useState({
    start: stringToDate(arrival),
    end: stringToDate(departure),
  });

  const dispatch = useDispatch();
  const primaryColor = useSelector(getPrimaryColor);
  const textColor = pickTextColorBasedOnBgColor(primaryColor, '#ffffff', '#000000')

  useEffect(() => {
    if (!range) return;

    const { start, end } = range;

    console.log(range);
    dispatch(
      changeParams({
        arrival: start.toLocaleDateString(),
        departure: end.toLocaleDateString(),
      })
    );
  }, [dispatch, range]);

  const [preselectedRange, setPreselectedRange] = useState([
    range.start,
    range.end,
  ]);

  useEffect(() => {
    const [start, end] = preselectedRange;
    if (start && end) {
      setRange({ start, end });
    }
  }, [preselectedRange]);

  return (
    <div style={{ margin: "2rem 0", display: "inline-block" }}>
      <ArrivalDepartureTime />
      <span>
        {range.start.getDate()} - {range.end.getDate()}
      </span>

      <FlatpickrTheme primaryColor={primaryColor} textColor={textColor}/>
      <Flatpickr
        render={(props, ref) => <span ref={ref}></span>}
        data-enable-time
        value={preselectedRange}
        options={{
          inline: true,
          mode: "range",
          locale: Russian,
          
          disable: [date => isBefore(date, sub(new Date(), { days: 1 }))],
        }}
        onChange={range => {
          setPreselectedRange(range);

        }}
      />
    </div>
  );
}

export default DateRangePicker;

function ArrivalDepartureTime() {
  const { arrivalTime, departureTime } = useSelector(getArrivalDepartureTime);

  const formatTime = time => {
    const regex = /(\d{2}:\d{2}):\d{2}/;
    let match = time.match(regex);
    return match ? match[1] : time;
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span>{`Заезд (${formatTime(arrivalTime)})`}</span>
      {" - "}
      <span>{`Выезд (${formatTime(departureTime)})`}</span>
    </div>
  );
}
