import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { BackButton } from "../components/Button";
import useWindowWidth from "../Layout/hooks/useWindowWidth";
import { getPrimaryColor } from "../redux/hotelConfig";
import { Guest } from "../Step3/AccompanyingGuests/AddedGuests";
import { Rate } from "./BookingCard";
import { useData } from "./BookingList";
import { GuestList } from "./ProfileTab";

export const BookingPage = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const history = useHistory();
  const [bookingDetails, loading] = useData<BookingDetails>(
    `https://nlb.agex.host/api/v1/account-reservation/detail/${booking_id}/`
  );

  return (
    <div>
      <BackButton onClick={() => history.goBack()}>Назад</BackButton>
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

type Room = {
  code: "DR";
  name: string;
  long_description: string;
  short_description: string;
  square: null | number;
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
  rate: Rate;
  accompanying_guests: Guest[];
  reservation_payments: Payment[];
  room_type: Room;
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
    accompanying_guests,
    price,
    rate,
    room_type,
    rooms_count,
    reservation_payments,
    status,
  } = details;
  return (
    <article className="box mt-5">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        <p className="title is-6">{room_type.name}</p>
        <p className="subtitle is-6">{rate.name}</p>
      </div>

      {/* <DatesAndPrice isDesktop={Boolean(isDesktop)}> */}

      <div style={{ display: "flex" }}>
        <div className="subtitle is-5">
          <span>{arrival}</span>
          <span> - </span>
          <span>{departure}</span>
        </div>
      </div>

      {accompanying_guests.length > 0 && (
        <section className="mt-4">
          <h4 className="title is-5 mb-2">
            Гости ({accompanying_guests.length})
          </h4>
          <GuestList guests={accompanying_guests} />
        </section>
      )}

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
