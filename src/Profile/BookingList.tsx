import React from "react";
import { useSelector } from "react-redux";
import Loader, { LoaderWrapper } from "../components/Loader";
import { getBookingList } from "../redux/booking";
import { BookingCard, Booking } from "./BookingCard";
import { ReactComponent as EmptyNew } from "../assets/no-results.svg";
import { Plug } from "../components/Plug";

export const MyBookings = () => {
  const { data: bookingList, isPending: loading } = useSelector(getBookingList);

  if (loading) {
    return (
      <div className="mt-6">
        <LoaderWrapper style={{ width: "100%" }}>
          <Loader />
        </LoaderWrapper>
      </div>
    );
  }

  return (
    <div>
      <div>
        {bookingList?.map((booking: Booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
      {!bookingList?.length && !loading && (
        <div className="mt-6">
          <Plug title={"Здесь пока пусто"} icon={EmptyNew} />
        </div>
      )}
    </div>
  );
};
