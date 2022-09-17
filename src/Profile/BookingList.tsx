import React from "react";
import { useSelector } from "react-redux";
import Loader, { LoaderWrapper } from "../components/Loader";
import { getBookingList } from "../redux/booking";
import { BookingCard, Booking } from "./BookingCard";

export const MyBookings = () => {
  const { data: bookingList, isPending: loading } = useSelector(getBookingList);

  if (loading) {
    return (
      <LoaderWrapper style={{ width: "100%" }}>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <div>
      {bookingList?.map((booking: Booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};
