import { takeEvery, call, select, put } from "redux-saga/effects";
import produce from "immer";
import api from "./redux/api";

const SET_CONFIG = "SET_CONFIG";
const CHANGE_PARAMS = "reservation/CHANGE_PARAMS";
const SUBMIT_ORDER = "reservation/SUBMIT_ORDER";
const IS_BOOKING = "reservation/IS_BOOKING";
const SET_BOOKING_RESPONSE = "reservation/SET_BOOKING_RESPONSE";

const initialState = {
  config: null,
  params: {
    room: null,
    rate: null,
    arrival: null,
    departure: null,
    adults: 0,
    rooms_count: 0,
    childs: [],
    notes: [],
  },
  isBooking: false,
  response: null,
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return { ...draft, config: action.payload };

    case CHANGE_PARAMS:
      draft.params = { ...draft.params, ...action.payload };
      return;

    case IS_BOOKING:
      draft.isBooking = action.payload;
      return;

    case SET_BOOKING_RESPONSE:
      draft.response = action.payload;
      return;

    default:
      return draft;
  }
}, initialState);

export default reducer;

export const loadConfig = slug => async dispatch => {
  const url = "api/v1/hotel-config/welna_kaluga/";
  const response = await api.get(url);

  dispatch({ type: SET_CONFIG, payload: response.data });
};

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

export function* reservationWatcher() {
  yield takeEvery(SUBMIT_ORDER, bookRoom);
}

function* bookRoom(action) {
  const bookingInfo = yield select(getBookingInfo);

  yield put(isBooking(true));
  const payload = yield call(requestRoom, {
    guest: action.payload,
    ...bookingInfo,
  });
  yield put(isBooking(false));

  yield put(setBookingResponse(payload));

  console.log(payload);
}

async function requestRoom(bookingInfo) {
  const { guest, adults, childs } = bookingInfo;
  const { room_code, rate_code } = bookingInfo;
  const { arrival, departure } = bookingInfo;

  const hotel_id = 1;
  const pms = "fidelio";
  const url = `api/v1/${pms}/reservation/${hotel_id}/`;

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
      rooms_count: 1,
      childs,
      // notes: [
      //   {
      //     code: "RES",
      //     text: "Тестовая бронь",
      //   },
      // ],
    },
  };

  const response = await api.post(url, bodyRequest, {
    method: "post",
  });

  // const response_ = {
  //   guest_num: 184422,
  //   id: 9,
  //   profile: 88137,
  //   rate: "RACK-HB",
  //   room: "STD",
  // };

  return response;
}

export const getConfig = state => state.reservation.config;
export const getParams = state => state.reservation.params;
export const getRoom = state => state.reservation.params.room;
export const getRate = state => state.reservation.params.rate;
export const getPrimaryColor = state =>
  getConfig(state).hotel_style_config.primary_color;
export const getchildCategories = state =>
  getConfig(state).hotel_child_categories;
export const getAvailabilityColors = state =>
  state.reservation.config.hotel_availability_colors;
export const getBookingInfo = state => {
  const { room, rate } = state.reservation.params;
  const { arrival, departure } = state.reservation.params;
  const { adults, childs } = state.reservation.params;
  return {
    room_code: room.room_code,
    rate_code: rate.rate_code,
    adults,
    childs: childs.filter(x => x.count),
    arrival,
    departure,
  };
};
export const getBookingState = state => state.reservation.isBooking;
export const getBookingResponse = state => state.reservation.response;
