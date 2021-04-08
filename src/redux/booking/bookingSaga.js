import { takeEvery, call, select, put } from "redux-saga/effects";

import api, { getAuthHeaderIfTokenPresent } from "../api";
import {
  getBookingInfo,
  isBooking,
  setBookingError,
  setBookingResponse,
  SUBMIT_ORDER,
} from ".";
import { getConfigId, getHotelPms } from "../hotelConfig";

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
  const { adults, childs, rooms_count } = bookingInfo;
  const { hotel_id, pms_type } = bookingInfo;
  const { room_code, rate_code } = bookingInfo;
  const { arrival, departure } = bookingInfo;
  const { packages, notes } = bookingInfo;

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
      packages,
      payment,
      notes,
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
