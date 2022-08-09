import React from "react";

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
  const {
    id,
    status,
    arrival,
    departure,
    room_type,
    rate_name,
    price,
  } = booking;
  return (
    <article className="box">
      <div className="">
        <div
          style={{ display: "flex" }}
          className="is-justify-content-space-between"
        >
          <h3 className="title is-5">
            <span className="title is-6">№</span>
            {id}
          </h3>

          <div>
            <span className="tag is-info">{status}</span>
          </div>
        </div>

        <div>
          <p className="title is-6">{room_type}</p>
          <p className="subtitle is-6">{rate_name}</p>
        </div>

        <div className="columns is-mobile">
          <div className="column is-half">
            <div className="is-6 subtitle">Заезд</div>
            <div className="title is-5">{arrival}</div>
            <div className="is-6 subtitle">после 14:00</div>
          </div>
          <div className="column is-half">
            <div className="is-6 subtitle">Выезд</div>
            <div className="title is-5">{departure}</div>
            <div className="is-6 subtitle">до 12:00</div>
          </div>
        </div>
      </div>

      <h3
        className="title is-4 mt-2"
        style={{ display: "flex", justifyContent: "end" }}
      >
        {price.toLocaleString()} &#8381;
      </h3>
    </article>
  );
};
