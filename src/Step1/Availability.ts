import { addMonths, differenceInDays, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useData } from "../hooks/useData";
import { getConfigId } from "../redux/hotelConfig";
import { dateToString } from "../utils/dateHelpers";

type Availability = {
  availability: {
    color: string;
    font_color: string;
    legend: string;
  };
  date: string;
};

/** get a range of 3-5 month
 * (2 or 0 months before the inputDate and 3 months after) */
const getNewRange = (inputDate: Date, loadBefore = true) => {
  let rangeStart = loadBefore ? subMonths(inputDate, 2) : inputDate;

  const isBeforeToday = differenceInDays(rangeStart, new Date()) < 0;
  if (isBeforeToday) {
    rangeStart = new Date();
  }

  const arr = dateToString(rangeStart);
  const dep = dateToString(addMonths(inputDate, 3));
  return { arr, dep };
};

function useAvailability(start: Date) {
  const hotelId = useSelector(getConfigId);

  const [{ arr, dep }, setAvailabilityRange] = useState(
    getNewRange(start, false)
  );

  const [availability, setAvailaibleDates] = useState<Availability[]>([]);

  const [data, loading] = useData<Availability[]>(
    `/api/v1/color-availability/${hotelId}/?arrival=${arr}&departure=${dep}`
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    const availabilityDates = availability.map(day => day.date);
    const newDates = data.filter(
      day => !availabilityDates.includes(day.date)
    );

    newDates.length && setAvailaibleDates(dates => [...dates, ...newDates]);
  }, [data, availability]);

  const updateAvailabilityRange = (inputDate: Date) => {
    const newRange = getNewRange(inputDate);
    setAvailabilityRange(newRange);
  };

  return [availability, loading, updateAvailabilityRange];
}

export { useAvailability };
