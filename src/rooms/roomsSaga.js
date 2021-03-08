import { takeEvery, put, call, select } from "redux-saga/effects";
import api, { getAuthHeaderIfTokenPresent } from "../redux/api";
import { REQUEST_ROOMS, FOUND_ROOMS, setFetchRoomsError } from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../redux/booking";
import { getConfigId, getHotelPms } from "../redux/hotelConfig";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, requestRooms);
}

function* requestRooms() {
  yield put(isLoadingRooms(true));
  const { payload, error } = yield call(getParamsAndFetch);
  if (payload) {
    yield put({ type: FOUND_ROOMS, payload });
  } else {
    if (error.response.data) {
      yield put(setFetchRoomsError(error.response.data));
    } else {
      yield put(setFetchRoomsError(error));
    }
  }
  yield put(isLoadingRooms(false));
}

function* getParamsAndFetch() {
  const searchParams = yield select(getParams);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);

  const { payload, error } = yield call(fetchRooms, {
    ...searchParams,
    hotel_id,
    pms_type,
  });

  return { payload, error };
}

async function fetchRooms(params) {
  const {
    arrival,
    departure,
    adults,
    promo_code,
    childs,
    hotel_id,
    pms_type,
  } = params;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

  const url = `/api/v1/${pms_type}/avilability/${hotel_id}/`;
  const config = {
    headers: {
      ...getAuthHeaderIfTokenPresent(),
    },
    params: {
      arrival,
      departure,
      adults,
      childs: serializeChilds(childs),
      promo_code,
    },
  };

  try {
    const response = await api.get(url, config);
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

function serializeChilds(childs) {
  const childsDictionary = childs.reduce((obj, category) => {
    return { ...obj, [category.code]: category.count };
  }, {});

  return JSON.stringify(childsDictionary);
}
