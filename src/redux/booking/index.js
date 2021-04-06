import produce from "immer";
import {
  stringToDate,
  calculateNightsCount,
  persistDateStringFormat,
  isNotLater,
} from "../../utils/dateHelpers";

export const CHANGE_PARAMS = "booking/CHANGE_PARAMS";
export const SUBMIT_ORDER = "booking/SUBMIT_ORDER";
export const IS_BOOKING = "booking/IS_BOOKING";
export const SET_BOOKING_RESPONSE = "booking/SET_BOOKING_RESPONSE";
export const SET_BOOKING_ERROR = "booking/SET_BOOKING_ERROR";

const [arrival, departure] = (function () {
  const arrival = new Date();
  const departure = new Date().addDays(1);
  return [arrival.toLocaleDateString(), departure.toLocaleDateString()];
})();

const initialState = {
  params: {
    guest: {},
    room: null,
    rate: null,
    arrival,
    departure,
    adults: 0,
    rooms_count: 1,
    childs: [],
    packages: [],
    comment: "",
    promo_code: "",
  },
  isBooking: false,
  response: null,
  error: null,
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_PARAMS:
      handleChangeOfParams(draft, action);
      return;

    case IS_BOOKING:
      draft.isBooking = action.payload;
      return;

    case SET_BOOKING_RESPONSE:
      draft.response = action.payload;
      return;

    case SET_BOOKING_ERROR:
      draft.error = action.error;
      return;

    default:
      return draft;
  }
}, initialState);

export default reducer;

function handleChangeOfParams(draft, action) {
  for (let key in action.payload) {
    if (key === "arrival" || key === "departure") {
      action.payload[key] = persistDateStringFormat(action.payload[key]);
    }
    if (key === "arrival") {
      action.payload[key] = checkIfArrivalIsExpired(action.payload[key]);
    }
    if (key === "departure") {
      action.payload[key] = checkDeparture(
        action.payload[key],
        draft.params.arrival
      );
    }
    if (key === "promo_code") {
      action.payload[key] = action.payload[key].toUpperCase();
    }
  }
  draft.params = { ...draft.params, ...action.payload };
}

function checkIfArrivalIsExpired(dateString) {
  const date = stringToDate(dateString);
  if (+date < +new Date()) {
    return new Date().toLocaleDateString();
  } else {
    return date.toLocaleDateString();
  }
}

function checkDeparture(departure, arrival) {
  if (isNotLater(departure, arrival)) {
    return new Date().addDays(1).toLocaleDateString();
  } else {
    return departure;
  }
}

export function changeParams(payload) {
  return { type: CHANGE_PARAMS, payload };
}

export function submitOrder(payload) {
  return { type: SUBMIT_ORDER, payload };
}

export function isBooking(payload) {
  return { type: IS_BOOKING, payload };
}

export function setBookingResponse(payload) {
  return { type: SET_BOOKING_RESPONSE, payload };
}

export function setBookingError(error) {
  return { type: SET_BOOKING_ERROR, error };
}

export const getParams = state => state.reservation.params;
export const getBookingInfo = state => {
  const params = getParams(state);
  const { room, rate, childs, notes, packages } = params;
  return {
    ...params,
    room_code: room.room_code,
    rate_code: rate.rate_code,
    childs: childs.filter(x => x.count),
    notes: [{ code: "RES", text: notes }],
    packages: packages.map(x => ({ code: x.code, price: x.price })),
  };
};
export const getBookingState = state => state.reservation.isBooking;
export const getBookingResponse = state => state.reservation.response;
export const getNightsCount = state => {
  const { arrival, departure } = getParams(state);
  const start = stringToDate(arrival);
  const end = stringToDate(departure);
  const nightsCount = calculateNightsCount(start, end);
  return nightsCount;
};
