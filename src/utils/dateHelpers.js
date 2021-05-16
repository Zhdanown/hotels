function parseString(string) {
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(string)) {
    // dd.mm.yyyy
    return string.split(".");
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(string)) {
    // yyyy-mm-dd
    return string.split("-").reverse();
  }
  throw Error("unknown dateString format");
}

export const stringToDate = string => {
  const [date, month, year] = parseString(string);
  return new Date(year, month - 1, date);
};

export const calculateNightsCount = (date1, date2) => {
  const timeDiff = Math.abs(date1 - date2);
  const nightsCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return nightsCount;
};

export const persistDateStringFormat = dateString => {
  const date = stringToDate(dateString);
  return date.toLocaleDateString();
};

export const isNotLater = (dateString1, dateString2) =>
  +stringToDate(dateString1) <= +stringToDate(dateString2);

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.addDays = function (days = 1) {
  const date = new Date(this);
  date.setDate(date.getDate() + days);
  return date;
};
