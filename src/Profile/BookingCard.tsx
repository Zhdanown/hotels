import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import useWindowWidth from "../Layout/hooks/useWindowWidth";

export type Booking = {
  arrival: string;
  confirmed: false;
  created: string;
  departure: string;
  external_id: null;
  id: number;
  is_sber_employee: boolean;
  price: string;
  rate_name: string | null;
  room_type: string;
  status: "CREATED";
};

export const BookingCard = ({ booking }: { booking: Booking }) => {
  const { url } = useRouteMatch();
  const [, , isDesktop] = useWindowWidth();

  const { id, status, arrival, departure, room_type, rate_name, price } =
    booking;
  return (
    <Link
      to={`${url}/${booking.id}`}
      className="mb-4"
      style={{ display: "block" }}
    >
      <article className="box">
        <div
          style={{ display: "flex" }}
          className="is-justify-content-space-between"
        >
          <h3 className="title is-6 mb-2">
            <span className="subtitle is-6 mr-1">№</span>
            {id}
          </h3>

          <div>
            <span className="tag is-info">{status}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="title is-6">{room_type}</p>
          <p className="subtitle is-6">{rate_name}</p>
        </div>

        <DatesAndPrice isDesktop={Boolean(isDesktop)}>
          <div style={{ display: "flex" }}>
            <div className="subtitle is-5">
              <span>{arrival}</span>
              <span> - </span>
              <span>{departure}</span>
            </div>
          </div>

          <h3
            className="title is-5 mt-2"
            style={{ display: "flex", justifyContent: "end" }}
          >
            {Number(price).toLocaleString()} &#8381;
          </h3>
        </DatesAndPrice>
      </article>
    </Link>
  );
};

const DatesAndPrice = styled.div<{ isDesktop: boolean }>`
  display: flex;
  flex-direction: column;
  ${p =>
    p.isDesktop
      ? `
      flex-direction: row;
      justify-content: space-between;
      align-items: center;`
      : ""}
`;
