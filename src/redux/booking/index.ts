import { addDays } from "date-fns";
import produce from "immer";
import { BookingDetails } from "../../Profile/BookingPage/types";
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
export const GET_BOOKING_LIST2 = "booking/GET_LIST";
export const GET_BOOKING_DETAILS = "booking/GET_DETAILS";
export const SET_BOOKING_DETAILS = "booking/SET_DETAILS";
export const LOADING_BOOKING_DETAILS = "booking/LOADING_DETAILS";
export const BOOKING_DETAILS_ERROR = "booking/GET_DETAILS_ERROR";
export const CANCEL_RESERVATION = "booking/CANCEL";
export const CANCELLATION_ERROR = "booking/CANCELLATION_ERROR";
export const CANCELLING_RESERVATION = "booking/CANCELLING";
export const CANCELLATION_SUCCESSFUL = "booking/CANCELLATION_SUCCESSFUL";

const [arrival, departure] = (function () {
  const arrival = new Date();
  const departure = addDays(new Date(), 1);
  return [arrival.toLocaleDateString(), departure.toLocaleDateString()];
})();

const initialState = {
  params: {
    guest: {},
    guests: null,
    room: null,
    rate: null,
    arrival,
    departure,
    adults: 2,
    rooms_count: 1,
    childs: [],
    packages: [],
    comment: "",
    promo_code: "",
  },
  isBooking: false,
  response: null,
  error: null,
  cancellation: {
    isPending: false,
    error: null,
    success: null,
  },
  bookingDetails: {
    data: null,
    error: null,
    isPending: false,
  },
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case GET_BOOKING_LIST2:
      return;

    case SET_BOOKING_DETAILS:
      draft.bookingDetails.data = action.payload;
      return;

    case BOOKING_DETAILS_ERROR:
      draft.bookingDetails.error = action.error;
      return;

    case LOADING_BOOKING_DETAILS:
      draft.bookingDetails.isPending = action.payload;
      return;

    case CANCELLING_RESERVATION:
      draft.cancellation.isPending = action.payload;
      return;

    case CANCELLATION_ERROR:
      draft.cancellation.error = action.error;
      return;

    case CANCELLATION_SUCCESSFUL:
      draft.cancellation.success = action.payload;
      return;

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

type Action = {
  type: string;
  payload?: any;
};

function handleChangeOfParams(draft: typeof initialState, action: Action) {
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
        action.payload.arrival
      );
    }
    if (key === "promo_code") {
      action.payload[key] = action.payload[key].toUpperCase();
    }
  }
  draft.params = { ...draft.params, ...action.payload };
}

function checkIfArrivalIsExpired(dateString: string) {
  const date = stringToDate(dateString);
  if (+date < +new Date()) {
    return new Date().toLocaleDateString();
  } else {
    return date.toLocaleDateString();
  }
}

function checkDeparture(departure: string, arrival: string) {
  if (isNotLater(departure, arrival)) {
    return addDays(new Date(), 1).toLocaleDateString();
  } else {
    return departure;
  }
}

export function changeParams(payload: any) {
  return { type: CHANGE_PARAMS, payload };
}

export function submitOrder(payload: any) {
  return { type: SUBMIT_ORDER, payload };
}

export function isBooking(payload: any) {
  return { type: IS_BOOKING, payload };
}

export function setBookingResponse(payload: any) {
  return { type: SET_BOOKING_RESPONSE, payload };
}

export function setBookingError(error: any) {
  return { type: SET_BOOKING_ERROR, error };
}

export function getBookingList(payload: any) {
  return { type: GET_BOOKING_LIST2, payload };
}

export function getReservationDetails(bookingId: string) {
  return { type: GET_BOOKING_DETAILS, bookingId };
}

export function setReservationDetails(payload: BookingDetails | null) {
  return { type: SET_BOOKING_DETAILS, payload };
}
export function reservationDetailsPending(payload: boolean) {
  return { type: LOADING_BOOKING_DETAILS, payload };
}
export function reservationDetailsError(error: any) {
  return { type: BOOKING_DETAILS_ERROR, error };
}

export function cancelReservation(bookingId: any) {
  return { type: CANCEL_RESERVATION, bookingId };
}

interface StoreState {
  reservation: typeof initialState;
}

export const getParams = (state: StoreState) => state.reservation.params;
export const getBookingState = (state: StoreState) =>
  state.reservation.isBooking;
export const getBookingResponse = (state: StoreState) =>
  state.reservation.response;
export const getNightsCount = (state: StoreState) => {
  const { arrival, departure } = getParams(state);
  const start = stringToDate(arrival);
  const end = stringToDate(departure);
  const nightsCount = calculateNightsCount(start, end);
  return nightsCount;
};

export const getCancellationError = (state: StoreState) =>
  state.reservation.cancellation.error;
export const getIsCancelling = (state: StoreState) =>
  state.reservation.cancellation.isPending;
export const getIsCancellationSuccessful = (state: StoreState) =>
  state.reservation.cancellation.success;

export const getReservation = (state: StoreState) => state.reservation.bookingDetails;
// export const getIsReservationPending = (state: StoreState) => state.reservation.bookingDetails.isPending;
// export const getReservation = (state: StoreState) => state.reservation.bookingDetails.data;
  