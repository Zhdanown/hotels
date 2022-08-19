import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import useWindowWidth from "../Layout/hooks/useWindowWidth";

function parseDateString(dateString: string) {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
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
