import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
import { addMonths, format, isBefore, sub } from "date-fns";
import { useData } from "../hooks/useData";

const FlatpickrTheme = createGlobalStyle`
  .flatpickr-months .flatpickr-month, 
  .flatpickr-current-month .flatpickr-monthDropdown-months, 
  .flatpickr-weekdays, span.flatpickr-weekday {
    background: ${p => p.primaryColor};
    color: ${p => p.textColor};
  }

  .flatpickr-day.selected, .flatpickr-day.selected:hover,
  .flatpickr-day.startRange, .flatpickr-day.startRange:hover,
  .flatpickr-day.endRange, .flatpickr-day.endRange:hover
   {
    background: ${p => p.primaryColor} !important;
    border-color: ${p => p.primaryColor} !important;
    color: ${p => p.textColor} !important;
  }

  .flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)), 
  .flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)), 
  .flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)) {
    webkit-box-shadow: -10px 0 0 ${p => p.primaryColor};
    box-shadow: -10px 0 0 ${p => p.primaryColor};
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

  return [availability, loading]
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

  const [availability, loading] = useAvailability(range.start)

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


  const onDayCreate = (dObj, dStr, fp, dayElem) => {
    const dateString = format(dayElem.dateObj, "yyyy-MM-dd");
    if (!availability.length) {
      return;
    }

    const info = availability.find(item => item.date === dateString);
    if (info) {
      const { color } = info.availability;
      dayElem.innerHTML += `<span class='tooltip' style="background-color: ${color}"></span>`;
  };

  const render = useCallback((props, ref) => <span ref={ref}></span>, []);
  const onChange = useCallback(range => {
    setPreselectedRange(range);
  }, []);

  const options = useMemo(
    () => ({
      inline: true,
      mode: "range",
      locale: Russian,
      disableMobile: true,
      disable: [date => isBefore(date, sub(new Date(), { days: 1 }))],
    }),
    []
  );

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
          render={render}
          data-enable-time
          value={preselectedRange}
          options={options}
          onChange={onChange}
          onDayCreate={onDayCreate}
        />
      </div>
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
