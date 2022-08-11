import { LeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { BackButton } from "../components/Button";
import useWindowWidth from "../Layout/hooks/useWindowWidth";
import api from "../redux/api";
import { getPrimaryColor } from "../redux/hotelConfig";
import { useData } from "./BookingList";

export const BookingPage = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const history = useHistory();
  const [bookingDetails, loading] = useData<BookingDetails>(
    `https://nlb.agex.host/api/v1/account-reservation/detail/${booking_id}/`
  );

  console.log(bookingDetails);

  return (
    <div>
      <BackButton onClick={() => history.goBack()}>Back</BackButton>
      {bookingDetails && <BookingPageDumb details={bookingDetails} />}
    </div>
  );
};

type Payment = {
  amount: number;
  paid: true;
  paid_time: string;
  payment_category: string;
  payment_link: string;
  payment_selected_method: string;
  payment_type: string;
};

type BookingDetails = {
  adults: number;
  arrival: string;
  // child_categories: [{…}]
  confirmed: boolean;
  created: string;
  departure: string;
  external_id: string;
  id: number;
  is_sber_employee: boolean;
  link_key: string;
  price: string;
  rate_code: string;
  rate_name: null | string;
  reservation_payments: Payment[];
  // room_type: {id: 84, photo_rooms: Array(1), option_rooms: Array(1), ext_id: null, ts: '2022-08-08T11:21:48.342230+03:00', …}
  rooms_count: number;
  status: string;
};

const BookingPageDumb = ({ details }: { details: BookingDetails }) => {
  const [, , isDesktop] = useWindowWidth();

  const {
    id,
    arrival,
    departure,
    created,
    is_sber_employee,
    price,
    rate_code,
    rate_name,
    rooms_count,
    reservation_payments,
    status,
  } = details;
  return (
    <article className="box">
      <div
        style={{ display: "flex" }}
        className="is-justify-content-space-between"
      >
        <h3 className="title is-6 mb-2">
          <span className="subtitle is-6 mr-1">№</span>
          <span>{id}</span>
          {/* <span className="subtitle is-6">
            {new Date(created).toLocaleDateString()}
          </span> */}
        </h3>

        <div>
          <span className="tag is-info">{status}</span>
        </div>
      </div>

      <div className="mb-4">
        {/* <p className="title is-6">{room_type}</p> */}
        <p className="subtitle is-6">{rate_name}</p>
        <p className="subtitle is-6">{rate_code}</p>
      </div>

      {/* <DatesAndPrice isDesktop={Boolean(isDesktop)}> */}

      <div style={{ display: "flex" }}>
        <div className="subtitle is-5">
          <span>{arrival}</span>
          <span> - </span>
          <span>{departure}</span>
        </div>
      </div>

      <div>
        {reservation_payments.map(payment => (
          <PaymentSection key={payment.payment_link} payment={payment} />
        ))}
      </div>
      <h3
        className="title is-4 mt-2"
        style={{ display: "flex", justifyContent: "end" }}
      >
        {Number(price).toLocaleString()} &#8381;
      </h3>

      {/* </DatesAndPrice> */}
    </article>
  );
};

const PaymentSection = ({ payment }: { payment: Payment }) => {
  const color = useSelector(getPrimaryColor);

  return (
    <section
      style={{
        borderLeft: `4px solid ${color}`,
        paddingLeft: "0.5rem",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{new Date(payment.paid_time).toLocaleDateString()}</div>

        {payment.paid ? (
          <span className="tag is-success is-light">Оплачено</span>
        ) : (
          <a href={payment.payment_link}>
            <button className="button is-small is-warning">Оплатить</button>
          </a>
        )}
      </div>
      <h5 className="title is-6 mb-3">
        {payment.payment_type}{" "}
        <span className="subtitle is-6">{payment.payment_category}</span>
      </h5>
      <h5 className="is-5">{payment.amount} &#8381;</h5>
    </section>
  );
};

