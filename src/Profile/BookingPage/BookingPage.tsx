import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Accordion, { Icon } from "../../components/Accordion";
import Button, { BackButton } from "../../components/Button";
import { notify } from "../../components/Toast";
import {
  cancelReservation,
  getCancellationError,
  getIsCancellationSuccessful,
  getIsCancelling,
} from "../../redux/booking";
import { Guest } from "../../Step3/AccompanyingGuests/AddedGuests";
import { useData } from "../BookingList";
import { Dates } from "../Dates";
import { GuestList } from "../ProfileTab";
import { PaymentSection } from "./PaymentSection";
import { RateInfo } from "./RateInfo";
import { RoomInfo } from "./RoomInfo";
import { Payment, Rate, Room } from "./types";

export const BookingPage = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const history = useHistory();
  const [bookingDetails, loading] = useData<BookingDetails>(
    `https://nlb.agex.host/api/v1/account-reservation/detail/${booking_id}/`
  );

  const dispatch = useDispatch();

  const cancel = () => dispatch(cancelReservation(booking_id));

  return (
    <div>
      <BackButton onClick={() => history.goBack()}>Назад</BackButton>
      {bookingDetails && (
        <BookingDescription details={bookingDetails} cancel={cancel} />
      )}
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

const CANCELED_STATUS = "Отменена гостем";

const BookingDescription = ({
  details,
  cancel,
}: {
  details: BookingDetails;
  cancel: () => void;
}) => {
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

  const isCancelling = useSelector(getIsCancelling);
  const cancellationError = useSelector(getCancellationError);
  const cancellationSuccess = useSelector(getIsCancellationSuccessful);

  useEffect(() => {
    if (cancellationSuccess) {
      notify("Бронь успешно отменена");
    }
  }, [cancellationSuccess]);

  useEffect(() => {
    if (cancellationError) {
      notify("При отмене бронирования произошла ошибка");
    }
  }, [cancellationError]);

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

      <RoomInfo room={room_type} />
      <RateInfo rate={rate} />

      {accompanying_guests.length > 0 && (
        <section className="mt-5 mb-5">
          <Accordion
            renderTitle={(toggle: () => void, isOpen: boolean) => (
              <Button small outline onClick={toggle}>
                Гости ({accompanying_guests.length})
                <Icon open={isOpen} />
              </Button>
            )}
            renderTitleAfter={null}
          >
            <GuestList guests={accompanying_guests} />
          </Accordion>
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

      {status !== CANCELED_STATUS && (
        <Button block onClick={cancel} loading={isCancelling}>
          Отменить бронирование
        </Button>
      )}
    </article>
  );
};
