import { takeEvery, call, select, put } from "redux-saga/effects";
import produce from "immer";
import api from "./api";
import { getProfileId } from "../Auth/authReducer";
import { getConfigId, getHotelPms } from "./hotelConfig";

const CHANGE_PARAMS = "booking/CHANGE_PARAMS";
const SUBMIT_ORDER = "booking/SUBMIT_ORDER";
const IS_BOOKING = "booking/IS_BOOKING";
const SET_BOOKING_RESPONSE = "booking/SET_BOOKING_RESPONSE";

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

export function* bookingSaga() {
  yield takeEvery(SUBMIT_ORDER, bookRoom);
}

function* bookRoom(action) {
  yield put(isBooking(true));
  const payload = yield call(getParamsAndRequestRoom, action);
  yield put(isBooking(false));
  yield put(setBookingResponse(payload));
}

function* getParamsAndRequestRoom(action) {
  const bookingInfo = yield select(getBookingInfo);
  const profileId = yield select(getProfileId);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);

  const payload = yield call(requestRoom, {
    ...bookingInfo,
    payment: action.payload,
    profileId,
    hotel_id,
    pms_type,
  });

  return payload;
}

async function requestRoom(bookingInfo) {
  const { guest, payment, profileId } = bookingInfo;
  const { adults, childs } = bookingInfo;
  const { room_code, rate_code } = bookingInfo;
  const { arrival, departure } = bookingInfo;
  const { rooms_count } = bookingInfo;
  const { hotel_id, pms_type } = bookingInfo;

  const url = `api/v1/${pms_type}/reservation/${hotel_id}/`;

  const bodyRequest = {
    guest: {
      profileId,
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

  const response = await api.post(url, bodyRequest, {
    method: "post",
  });

  return response.data;
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
