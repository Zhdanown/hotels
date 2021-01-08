import React, { useState, useEffect } from "react";
import Litepicker from "litepicker";

const _range = [
  new Date(2021, 0, 8),
  new Date(2021, 0, 9),
  new Date(2021, 0, 10),
  new Date(2021, 0, 11),
];

function DateRangePicker() {
  const [range, setRange] = useState({ start: null, end: null });

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
      const inRange = _range.find(
        date => date.getDate() === startDate.getDate()
      );

      //   if (inRange) {
      //   debugger
      //   picker.setLockDays(range);
      //   }
    }

    return () => picker.destroy();
  }, []);

  return (
    <div style={{ margin: "1rem 0" }}>
      <div
        style={{
          
          // textAlign: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <input
          type="date"
          name="startDate"
          id="startDate"
          style={{ width: "8.5rem" }}
        />

        <span>{" - "}</span>

        <input
          type="date"
          name="endDate"
          id="endDate"
          style={{ width: "8.5rem" }}
        />
      </div>
      <div id="date-rande-picker" style={{
        position: "relative",
        textAlign: 'center'
      }}></div>
      <p style={{ margin: "1rem 0", textAlign: "center" }}>Выбранные даты:</p>
      <p style={{ textAlign: "center" }}>
        {range.start && range.start.toLocaleDateString()} -{" "}
        {range.end && range.end.toLocaleDateString()}
      </p>
    </div>
  );
}

export default DateRangePicker;
