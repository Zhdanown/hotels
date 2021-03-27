import { takeEvery, call, select, put } from "redux-saga/effects";
import produce from "immer";
import api, { getAuthHeaderIfTokenPresent } from "./api";
import { getConfigId, getHotelPms } from "./hotelConfig";
import { stringToDate, calculateNightsCount } from "../utils";

const CHANGE_PARAMS = "booking/CHANGE_PARAMS";
const SUBMIT_ORDER = "booking/SUBMIT_ORDER";
const IS_BOOKING = "booking/IS_BOOKING";
const SET_BOOKING_RESPONSE = "booking/SET_BOOKING_RESPONSE";
const SET_BOOKING_ERROR = "booking/SET_BOOKING_ERROR";

const initialState = {
  params: {
    guest: {},
    room: null,
    rate: null,
    arrival: null,
    departure: null,
    adults: 0,
    rooms_count: 0,
    childs: [],
    notes: [],
    promo_code: null,
  },
  isBooking: false,
  response: null,
  error: null,
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_PARAMS:
      draft.params = { ...draft.params, ...action.payload };
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

export function* bookingSaga() {
  yield takeEvery(SUBMIT_ORDER, bookRoom);
}

function* bookRoom(action) {
  yield put(isBooking(true));
  const { payload, error } = yield call(getParamsAndRequestRoom, action);
  if (payload) {
    yield put(setBookingResponse(payload));
  } else {
    if (error.response.data) {
      yield put(setBookingError(error.response.data));
    } else {
      yield put(setBookingError(error));
    }
  }

  yield put(isBooking(false));
}

function* getParamsAndRequestRoom(action) {
  const bookingInfo = yield select(getBookingInfo);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);

  const { payload, error } = yield call(requestRoom, {
    ...bookingInfo,
    payment: action.payload,
    hotel_id,
    pms_type,
  });

  return { payload, error };
}

async function requestRoom(bookingInfo) {
  const { guest, payment } = bookingInfo;
  const { adults, childs } = bookingInfo;
  const { room_code, rate_code } = bookingInfo;
  const { arrival, departure } = bookingInfo;
  const { rooms_count } = bookingInfo;
  const { hotel_id, pms_type } = bookingInfo;

  const url = `api/v1/${pms_type}/reservation/${hotel_id}/`;

  const bodyRequest = {
    guest: {
      first_name: guest.firstName,
      last_name: guest.lastName,
      email: guest.email,
      tel: guest.tel,
    },
    reservation: {
      rate_code,
      room_code,
      arrival,
      departure,
      adults,
      rooms_count,
      childs,
      payment,
    },
  };

  try {
    const response = await api.post(url, bodyRequest, {
      headers: {
        ...getAuthHeaderIfTokenPresent(),
      },
    });
    return { payload: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        error: {
          response: {
            data: {
              message: `Не удалось выполнить запрос\r\n Ошибка авторизации :(`,
            },
          },
        },
      };
    }
    return { error };
  }
}

export const getParams = state => state.reservation.params;
export const getRoom = state => getParams(state).room;
export const getRate = state => getParams(state).rate;
export const getBookingInfo = state => {
  const { room, rate, rooms_count } = getParams(state);
  const { arrival, departure } = getParams(state);
  const { guest, adults, childs } = getParams(state);
  return {
    guest,
    room_code: room.room_code,
    rate_code: rate.rate_code,
    rooms_count,
    adults,
    childs: childs.filter(x => x.count),
    arrival,
    departure,
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
