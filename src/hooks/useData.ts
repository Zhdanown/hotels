import { useEffect, useState } from "react";
import api from "../redux/api";

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
  }, [url]);

  return [bookingList, isLoading] as const;
}
