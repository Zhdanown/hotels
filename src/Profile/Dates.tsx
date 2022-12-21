import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import useWindowWidth from "../Layout/hooks/useWindowWidth";
import { stringToDate } from "../utils/dateHelpers";

function parseDateString(dateString: string) {
  const date = stringToDate(dateString)
  return format(date, "d LLL yyyy", { locale: ru });
}

export const Dates = ({
  arrival,
  departure,
}: {
  arrival: string;
  departure: string;
}) => {
  const [, , isDesktop] = useWindowWidth();

  return (
    <div style={{ display: "flex" }}>
      <div className="subtitle is-5" style={{ fontSize: isDesktop ? 22 : 18 }}>
        <span>{parseDateString(arrival)}</span>
        <span> - </span>
        <span>{parseDateString(departure)}</span>
      </div>
    </div>
  );
};
