import { addDays, format, isBefore, parseISO } from 'date-fns'

export const stringToDate = (dateString: string) => {
  const res = parseISO(dateString)
  return res;
}

export const calculateNightsCount = (date1: Date, date2: Date) => {
  const timeDiff = Math.abs(date1.getTime() - date2.getTime());
  const nightsCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return nightsCount;
};

export const isNotLater = (dateString1: string, dateString2: string) =>
isBefore(stringToDate(dateString1), stringToDate(dateString2))

export const dateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
}

export function checkIfArrivalIsExpired(dateString: string) {
  const date = stringToDate(dateString);
  if (+date < +new Date()) {
    return dateToString(new Date())
  } else {
    return dateToString(date)
  }
}

export function checkDeparture(departure: string, arrival: string) {
  if (isNotLater(departure, arrival)) {
    return dateToString(addDays(new Date(), 1));
  } else {
    return departure;
  }
}