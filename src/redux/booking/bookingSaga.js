import { takeEvery, call, select, put } from "redux-saga/effects";

import api, { getAuthHeaderIfTokenPresent } from "../api";
import {
  getParams,
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
  const bookingParams = yield select(getParams);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);

  const { payload, error } = yield call(requestRoom, {
    ...bookingParams,
    payment: action.payload,
    hotel_id,
    pms_type,
  });

  return { payload, error };
}

async function requestRoom(bookingParams) {
  const { hotel_id, pms_type } = bookingParams;
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
      notes: [{ code: "RES", text: comment }],
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
