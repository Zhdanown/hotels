import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import {
  getPrimaryColor,
  getArrivalDepartureTime,
  getConfigId,
} from "../redux/hotelConfig";
import { changeParams, getParams } from "../redux/booking";
import { pickTextColorBasedOnBgColor } from "../utils/colorHelpers";
import { stringToDate } from "../utils/dateHelpers";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Russian } from "flatpickr/dist/l10n/ru";
import { addMonths, format, isBefore, parse, sub } from "date-fns";
import { useData } from "../hooks/useData";

const FlatpickrTheme = createGlobalStyle`
  .flatpickr-months .flatpickr-month, 
  .flatpickr-current-month .flatpickr-monthDropdown-months, 
  .flatpickr-weekdays, span.flatpickr-weekday {
    background: white;
    color: rgba(0,0,0,0.54);
  }
  
  .flatpickr-weekdays {
    border-left: 1px solid rgba(72,72,72,0.2);
    border-right: 1px solid rgba(72,72,72,0.2);
  }
  
  .flatpickr-months {
    .flatpickr-month {
      border: 1px solid rgba(72,72,72,0.2);
      border-bottom: none;
    }

    .flatpickr-next-month, .flatpickr-prev-month {
      svg {
        fill: rgba(0,0,0,0.54);
        transition: .4s transform;
      }
      &:hover svg {
        fill: ${p => p.primaryColor};
        transform: scale(1.25);
      }
    }
  }

  .flatpickr-day {
    border-radius: 4px;

    &.selected, &.selected:hover,
    &.startRange, &.startRange:hover,
    &.endRange, &.endRange:hover {
      background: ${p => p.primaryColor} !important;
      border-color: ${p => p.primaryColor} !important;
      color: ${p => p.textColor} !important;
    }
    &.startRange {
      border-radius: 4px 0 0 4px !important;
    }
    &.endRange {
      border-radius: 0 4px 4px 0 !important;
    }

    &.selected.startRange + .endRange:not(:nth-child(7n+1)), 
    &.startRange.startRange + .endRange:not(:nth-child(7n+1)), 
    &.endRange.startRange + .endRange:not(:nth-child(7n+1)) {
      webkit-box-shadow: -10px 0 0 ${p => p.primaryColor};
      box-shadow: -10px 0 0 ${p => p.primaryColor};
    }
  }

  .availability-badge {
    position: absolute;
    width: 15px;
    height: 3px;
    border-radius: 150px;
    bottom: 3px;
    left: calc(50% - 7.5px);
  }
`;

function useAvailability(start) {
  const hotelId = useSelector(getConfigId);
  const arr = format(start, "yyyy-MM-dd");
  const dep = format(addMonths(start, 3), "yyyy-MM-dd");

  const [availabilityData, loading] = useData(
    `/api/v1/color-availability/${hotelId}/?arrival=${arr}&departure=${dep}`
  );

  const [availability, setAvailaibleDates] = useState([]);

  useEffect(() => {
    availabilityData &&
      setAvailaibleDates(dates => [...dates, ...availabilityData]);
  }, [availabilityData]);

  return [availability, loading];
}

function DateRangePicker() {
  const { arrival, departure } = useSelector(getParams);
  const [range, setRange] = useState({
    start: stringToDate(arrival),
    end: stringToDate(departure),
  });

  const dispatch = useDispatch();
  const primaryColor = useSelector(getPrimaryColor);
  const textColor = pickTextColorBasedOnBgColor(
    primaryColor,
    "#ffffff",
    "#000000"
  );

  const [availability, loading] = useAvailability(range.start);

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
    <div
      style={{
        margin: "2rem 0",
        display: "inline-block",
        width: "100%",
      }}
    >
      <ArrivalDepartureTime />

      <FlatpickrTheme primaryColor={primaryColor} textColor={textColor} />
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Flatpickr
          render={(props, ref) => <span ref={ref}></span>}
          data-enable-time
          value={preselectedRange}
          options={{
            inline: true,
            mode: "range",
            locale: Russian,
            disableMobile: true,
            disable: [date => isBefore(date, sub(new Date(), { days: 1 }))],
          }}
          onChange={range => setPreselectedRange(range)}
          onDayCreate={(dObj, dStr, fp, dayElem) => {
            const dateString = format(dayElem.dateObj, "yyyy-MM-dd");
            console.log(availability);
            if (!availability.length) {
              return;
            }

            const info = availability.find(item => item.date === dateString);
            if (info) {
              const { color } = info.availability;
              dayElem.innerHTML += `<span class='availability-badge' style="background-color: ${color}"></span>`;
            }
          }}
        />
      </div>
    </div>
  );
}

export default DateRangePicker;

function ArrivalDepartureTime() {
  const { arrivalTime, departureTime } = useSelector(getArrivalDepartureTime);
  const formatTime = time =>
    format(parse(time, "HH:mm:ss", new Date()), "HH:mm");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span>{`Заезд (${formatTime(arrivalTime)})`}</span>
      {" - "}
      <span>{`Выезд (${formatTime(departureTime)})`}</span>
    </div>
  );
}
