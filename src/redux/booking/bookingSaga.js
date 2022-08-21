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
  getParams,
  GET_BOOKING_LIST2,
  isBooking,
  setBookingError,
  setBookingResponse,
  SUBMIT_ORDER,
} from ".";
import { getConfigId, getConfigNoteCode, getHotelPms } from "../hotelConfig";

export function* bookingSaga() {
  yield all([
    yield takeEvery(SUBMIT_ORDER, bookRoom),
    yield takeLatest(GET_BOOKING_LIST2, fetchBookingList),
    yield takeEvery(CANCEL_RESERVATION, cancelBookingWatcher),
  ]);
  // yield takeLatest(GET_BOOKING_LIST2, function*(action) {
  //   console.log(123123, action)
  //   yield put({type: 'alsdjlsdf', payload: 'sdfsdf'})
  // })
}

function* cancelBookingWatcher(action) {
  const hotelId = yield select(getConfigId);
  const { bookingId } = action;

  yield put({ type: CANCELLATION_ERROR, error: null });
  yield put({ type: CANCELLING_RESERVATION, payload: true });

  const { err } = yield call(cancelBooking, { hotelId, bookingId });

  err && (yield put({ type: CANCELLATION_ERROR, error: err }));
  yield put({ type: CANCELLING_RESERVATION, payload: false });
  !err && (yield call(onCancellationSuccess));
}

function* onCancellationSuccess() {
  yield put({ type: CANCELLATION_SUCCESSFUL, payload: true });
  yield call(() => new Promise(res => setTimeout(res, 1000)));
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

function* fetchBookingList(action) {
  console.log("fetch them", action);
  yield call(getBookingList);
}

async function getBookingList() {
  const response = await api.get(
    "https://nlb.agex.host/api/v1/account-reservation/list/5/"
  );
  debugger;
}
