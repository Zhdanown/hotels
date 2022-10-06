import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getUser } from "../../Auth/authReducer";
import Button, { BackButton } from "../../components/Button";
import Loader, { LoaderWrapper } from "../../components/Loader";
import { notify } from "../../components/Toast";
import {
  cancelReservation,
  getCancellationError,
  getIsCancellationSuccessful,
  getIsCancelling,
  getReservation,
  getReservationDetails,
  reservationDetailsError,
  reservationDetailsPending,
  setReservationDetails,
} from "../../redux/booking";
import {
  SelectableGuestList,
  VacantPlacesCounter,
} from "../../Step3/AccompanyingGuests/AddedGuests";
import {
  getIsUpdateGuestListPending,
  updateBookingGuestList,
} from "../../Step3/AccompanyingGuests/AddedGuests.saga";
import { Dates } from "../Dates";
import { Guest } from "../GuestList";
import { CancelReservation } from "./CancelReservation";
import { PaymentSection } from "./PaymentSection";
import { RateInfo } from "./RateInfo";
import { RoomInfo } from "./RoomInfo";
import { BookingDetails } from "./types";

const Counters = ({
  adults,
  childs,
  rooms_count,
}: {
  adults: number;
  childs: number;
  rooms_count: number;
}) => {
  const items = [{ label: "Взрослых", count: adults }];
  childs && items.push({ label: "Детей", count: childs });
  items.push({ label: "Количество комнат", count: rooms_count });
  return <CounterGroup items={items} />;
};

const CounterGroup = ({
  items,
}: {
  items: { label: string; count: number }[];
}) => (
  <div className="field is-grouped is-grouped-multiline mt-4 mr-3">
    {items.map(({ label, count }) => (
      <div className="control" key={label}>
        <div className="tags has-addons">
          <span className="tag is-light">{label}</span>
          <span className="tag is-dark">{count}</span>
        </div>
      </div>
    ))}
  </div>
);

export const BookingPage = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const history = useHistory();

  const { data, error, isPending } = useSelector(getReservation);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReservationDetails(booking_id));
    return () => {
      dispatch(reservationDetailsError(null));
      dispatch(setReservationDetails(null));
      dispatch(reservationDetailsPending(false));
    };
  }, [booking_id, dispatch]);

  useEffect(() => {
    error && notify("Не удалось загрузить данные");
  }, [error]);

  const cancel = () => dispatch(cancelReservation(booking_id));

  return (
    <div>
      <BackButton onClick={() => history.goBack()}>Назад</BackButton>
      {isPending && (
        <LoaderWrapper style={{ width: "100%", marginTop: "2rem" }}>
          <Loader />
        </LoaderWrapper>
      )}
      {data && <BookingDescription details={data} cancel={cancel} />}
    </div>
  );
};

const CANCELED_STATUS = "Отменена гостем";

const getChildsCount = (childs: BookingDetails["childs"]) =>
  childs.reduce((acc, item) => acc + item.quantity, 0);

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
    adults,
    rooms_count,
    childs,
    accompanying_guests,
    price,
    rate,
    room_type,
    reservation_payments,
    status,
  } = details;

  const { booking_id } = useParams<{ booking_id: string }>();
  const isCancelling = useSelector(getIsCancelling);
  const cancellationError = useSelector(getCancellationError);
  const cancellationSuccess = useSelector(getIsCancellationSuccessful);
  const isUpdateGuestListPending = useSelector(getIsUpdateGuestListPending);

  const userInfo = useSelector(getUser);
  const initiallySelectedGuests = useMemo(
    () => accompanying_guests.map(x => x.id),
    [accompanying_guests]
  );

  const [selectedGuests, setSelectedGuests] = useState<number[]>([
    ...initiallySelectedGuests,
  ]);

  useEffect(() => {
    setSelectedGuests(initiallySelectedGuests);
  }, [initiallySelectedGuests]);

  const hasChanges = () =>
    selectedGuests.sort().join("") !== initiallySelectedGuests.sort().join("");

  const dispatch = useDispatch();

  const submitGuestListChanges = () => {
    dispatch(
      updateBookingGuestList({
        bookingId: booking_id,
        guestIds: selectedGuests,
      })
    );
  };

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

  const totalGuestCount = adults + getChildsCount(childs);

  const vacantPlaces = totalGuestCount - selectedGuests.length;

  const onSelectGuest = (checked: boolean, guest: Guest) => {
    const newSelected = checked
      ? [...selectedGuests, guest.id]
      : selectedGuests.filter(x => x !== guest.id);

    if (totalGuestCount < newSelected.length) {
      console.warn(`you can choose no more than ${totalGuestCount} guests`);
      return;
    }

    setSelectedGuests(newSelected);
  };

  const renderConfirmButton = () => (
    <>
      <VacantPlacesCounter vacantPlaces={vacantPlaces} />
      {hasChanges() && (
        <Button
          block
          onClick={submitGuestListChanges}
          disabled={isUpdateGuestListPending}
        >
          Сохранить изменения
        </Button>
      )}
    </>
  );

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

      <Counters
        adults={adults}
        childs={getChildsCount(childs)}
        rooms_count={rooms_count}
      />

      <div className="mt-6 mb-6">
        <SelectableGuestList
          guests={userInfo.user_guests}
          selectedGuests={selectedGuests}
          vacantPlaces={vacantPlaces}
          renderConfirmButton={renderConfirmButton}
          onSelectGuest={onSelectGuest}
        />
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

      {status !== CANCELED_STATUS && (
        <CancelReservation
          cancelReservation={cancel}
          isCancelling={isCancelling}
        />
      )}
    </article>
  );
};
