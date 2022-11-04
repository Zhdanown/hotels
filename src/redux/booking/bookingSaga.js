import {
  takeEvery,
  takeLatest,
  call,
  select,
  put,
  all,
} from "redux-saga/effects";

import api, { getAuthHeaderIfTokenPresent } from "../api";
import {
  CANCELLATION_ERROR,
  CANCELLATION_SUCCESSFUL,
  CANCELLING_RESERVATION,
  CANCEL_RESERVATION,
  GET_BOOKING_DETAILS,
  getParams,
  isBooking,
  reservationDetailsError,
  reservationDetailsPending,
  setBookingError,
  setBookingResponse,
  setReservationDetails,
  SUBMIT_ORDER,
  GET_BOOKING_LIST,
  setBookingListPending,
  setBookingList,
  setBookingListError,
} from ".";
import { getConfigId, getConfigNoteCode, getHotelPms } from "../hotelConfig";
import { fetcher } from "../utils";

export function* bookingSaga() {
  yield all([
    yield takeEvery(SUBMIT_ORDER, bookRoom),
    yield takeEvery(CANCEL_RESERVATION, cancelBookingWatcher),
    yield takeLatest(GET_BOOKING_DETAILS, getBookingDetails),
    yield takeLatest(GET_BOOKING_LIST, getBookingList),
  ]);
}

function* getBookingList(action) {
  yield put(setBookingListPending(true));
  const hotelId = yield select(getConfigId);
  
  const url = `/api/v1/account-reservation/list/${hotelId}/`;
  const { data, err } = yield call(fetcher, url);

  if (data) {
    yield put(setBookingList(data));
  } else {
    yield put(setBookingListError(err));
  }
  yield put(setBookingListPending(false));
}

export function* getBookingDetails(action) {
  yield put(reservationDetailsPending(true));

  const url = `/api/v1/account-reservation/detail/${action.bookingId}/`;
  const { data, err } = yield call(fetcher, url);

  if (data) {
    yield put(setReservationDetails(data));
  } else {
    yield put(reservationDetailsError(err));
  }
  yield put(reservationDetailsPending(null));
}

function* cancelBookingWatcher(action) {
  const hotelId = yield select(getConfigId);
  const { bookingId } = action;

  yield put({ type: CANCELLATION_ERROR, error: null });
  yield put({ type: CANCELLING_RESERVATION, payload: true });

  const { err } = yield call(cancelBooking, { hotelId, bookingId });

  err && (yield put({ type: CANCELLATION_ERROR, error: err }));
  yield put({ type: CANCELLING_RESERVATION, payload: false });
  !err && (yield call(onCancellationSuccess, action));
}

function* onCancellationSuccess(action) {
  yield put({ type: CANCELLATION_SUCCESSFUL, payload: true });
  yield all([
    call(() => new Promise(res => setTimeout(res, 1000))),
    call(getBookingDetails, action),
  ]);
  yield put({ type: CANCELLATION_SUCCESSFUL, payload: false });
}

async function cancelBooking({ hotelId, bookingId }) {
  const bodyRequest = {
    reservation_id: bookingId,
    status: "CANCELED_BY_GUEST",
  };

  const url = `/api/v1/reservation-status/${hotelId}/`;
  try {
    await api.post(url, bodyRequest);
    return {};
  } catch (err) {
    return { err };
  }
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
  const bookingParams = yield select(getParams);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);
  const note_code = yield select(getConfigNoteCode);

  const { payload, error } = yield call(requestRoom, {
    ...bookingParams,
    payment: action.payload,
    hotel_id,
    pms_type,
    note_code,
  });

  return { payload, error };
}

async function requestRoom(bookingParams) {
  const { hotel_id, pms_type, note_code } = bookingParams;
  const {
    guest,
    payment,
    adults,
    childs,
    rooms_count,
    arrival,
    departure,
    room,
    rate,
    packages,
    comment,
    guests,
    promo_code,
  } = bookingParams;

  const url = `api/v1/reservation/${hotel_id}/`;

  const bodyRequest = {
    guest,
    reservation: {
      room_code: room.room_code,
      rate_code: rate.rate_code,
      price:
        rate.total_price +
        packages.reduce((sum, service) => (sum += service.totalCost), 0),
      arrival,
      departure,
      adults,
      rooms_count,
      payment,
      childs: childs.filter(x => x.count),
      packages: packages.map(x => ({ code: x.code, price: x.price })),
      notes: [{ code: note_code, text: comment }],
      promo_code,
    },
    guests,
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
