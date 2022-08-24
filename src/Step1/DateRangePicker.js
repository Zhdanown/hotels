import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
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
import { createPopper } from "@popperjs/core";
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

  .tooltip {
    position: absolute;
    width: 15px;
    height: 3px;
    border-radius: 150px;
    bottom: 3px;
    left: calc(50% - 7.5px);
  }

  .hint {
    border-radius: 5px;
    background: rgba(50, 50, 50, .75);
    padding: 5px;
    color: white;
    white-space: nowrap;
    display: block;
  }
`;

function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
  });
}

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

  const [x, setX] = useState(-5000);
  const [y, setY] = useState(-5000);
  const [text, setText] = useState("");

  const virtualElement = useMemo(
    () => ({
      getBoundingClientRect: generateGetBoundingClientRect(x, y),
      text,
    }),
    [x, y, text]
  );

  const popperElement = useRef(null);
  const instRef = useRef(null);

  useEffect(() => {
    const instance = createPopper(virtualElement, popperElement.current);
    instRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [virtualElement]);

  const onDayCreate = (dObj, dStr, fp, dayElem) => {
    const dateString = format(dayElem.dateObj, "yyyy-MM-dd");
    if (!availability.length) {
      return;
    }

    const info = availability.find(item => item.date === dateString);
    if (info) {
      const { legend, color } = info.availability;
      dayElem.innerHTML += `<span class='tooltip' style="background-color: ${color}"></span>`;

      dayElem.onmouseover = event => {
        const rect = dayElem.getBoundingClientRect();
        const { x, y, height, width } = rect;
        setX(x + width);
        setY(y + height);
        setText(legend);
        instRef.current.update();
      };
      // TODO remake
      dayElem.onmouseout = () => {
        setX(-5000);
        setY(-5000);
        setText("");
        instRef.current.update();
      };
    }
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
      {/* disable for touch devices */}
      {createPortal(
        <div ref={popperElement}>
          {text && <span className="hint">{text}</span>}
        </div>,
        document.body
      )}
    </div>
  );
}

export default DateRangePicker;

function ArrivalDepartureTime() {
  const { arrivalTime, departureTime } = useSelector(getArrivalDepartureTime);
  const formatTime = time => format(parse(time, "HH:mm:ss", new Date()), "HH:mm");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span>{`Заезд (${formatTime(arrivalTime)})`}</span>
      {" - "}
      <span>{`Выезд (${formatTime(departureTime)})`}</span>
    </div>
  );
}
