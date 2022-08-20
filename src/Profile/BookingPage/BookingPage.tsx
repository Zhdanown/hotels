import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { BackButton } from "../../components/Button";
import { Guest } from "../../Step3/AccompanyingGuests/AddedGuests";
import { Rate } from "../BookingCard";
import { useData } from "../BookingList";
import { Dates } from "../Dates";
import { GuestList } from "../ProfileTab";
import { PaymentSection } from "./PaymentSection";
import { RoomInfo } from "./RoomInfo";
import { Payment, Room } from "./types";

export const BookingPage = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const history = useHistory();
  const [bookingDetails, loading] = useData<BookingDetails>(
    `https://nlb.agex.host/api/v1/account-reservation/detail/${booking_id}/`
  );

  return (
    <div>
      <BackButton onClick={() => history.goBack()}>Назад</BackButton>
      {bookingDetails && <BookingDescription details={bookingDetails} />}
    </div>
  );
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

const BookingDescription = ({ details }: { details: BookingDetails }) => {
  const {
    id,
    arrival,
    departure,
    accompanying_guests,
    price,
    rate,
    room_type,
    reservation_payments,
    status,
  } = details;

  return (
    <article className="box mt-5">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 className="title is-6 mb-2">
          <span className="subtitle is-6 mr-1">№</span>
          <span>{id}</span>
        </h3>

        <div>
          <span className="tag is-info">{status}</span>
        </div>
      </div>

      <div className="mt-3 mb-5">
        <Dates arrival={arrival} departure={departure} />
      </div>

      <RoomInfo room={{ ...room_type, rate_name: rate.name }} />

      {accompanying_guests.length > 0 && (
        <section className="mt-6 mb-6">
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
    </article>
  );
};

