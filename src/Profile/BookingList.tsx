import React from "react";
import { useSelector } from "react-redux";
import Loader, { LoaderWrapper } from "../components/Loader";
import { useData } from "../hooks/useData";
import { getConfigId } from "../redux/hotelConfig";
import { BookingCard, Booking } from "./BookingCard";
import { Filters } from "./Filters";


export const MyBookings = () => {
  const hotelId = useSelector(getConfigId);
  const [bookingList, loading] = useData<Booking[]>(
    `/api/v1/account-reservation/list/${hotelId}/`
  );

  if (loading) {
    return (
      <LoaderWrapper style={{ width: "100%" }}>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Filters />
      </div>

      {bookingList?.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};
