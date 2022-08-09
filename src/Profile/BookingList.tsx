import React, { useEffect, useState } from "react";
import api from "../redux/api";
import { BookingCard, Booking } from "./BookingItem";
import { Filters } from "./Filters";

const useBookingList = () => {
  const [bookingList, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const get = async () => {
      const res = await api.get(
        "https://nlb.agex.host/api/v1/account-reservation/list/5/"
      );
      if (res.status === 200) {
        setBookings(res.data);
      }
    };
    get();
  }, []);

  return bookingList;
};

export const MyBookings = () => {
  const bookingList = useBookingList();

  return (
    <div>
      <div className="mb-4">
        <Filters />
      </div>
     
      {bookingList.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};
