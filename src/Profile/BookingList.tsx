import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader, { LoaderWrapper } from "../components/Loader";
import api from "../redux/api";
import { getConfigId } from "../redux/hotelConfig";
import { BookingCard, Booking } from "./BookingCard";
import { Filters } from "./Filters";

export function useData<T>(url: string) {
  const [bookingList, setBookings] = useState<T>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const get = async () => {
      try {
        setLoading(true);
        const res = await api.get(url);
        // await new Promise(res => setTimeout(res, 3000))
        if (res.status === 200) {
          setBookings(res.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    get();
  }, []);

  return [bookingList, isLoading] as const;
}

export const MyBookings = () => {
  const hotelId = useSelector(getConfigId);
  const [bookingList, loading] = useData<Booking[]>(
    `https://nlb.agex.host/api/v1/account-reservation/list/${hotelId}/`
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
