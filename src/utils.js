export const stringToDate = string => {
  // expects a string in the next format: "dd.mm.yyyy"
  let [date, month, year] = string.split(".");
  return new Date(year, month - 1, date);
};

export const calculateNightsCount = (date1, date2) => {
  const timeDiff = Math.abs(date1 - date2);
  const nightsCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return nightsCount;
};
