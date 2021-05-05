import { takeEvery, put, call, select, all } from "redux-saga/effects";
import api, { getAuthHeaderIfTokenPresent } from "../redux/api";
import {
  REQUEST_ROOMS,
  SET_ROOMS,
  SET_SERVICES,
  setFetchRoomsError,
} from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../redux/booking";
import { getConfigId, getHotelPms } from "../redux/hotelConfig";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, roomsSaga);
}

function* roomsSaga() {
  yield put(isLoadingRooms(true));
  const params = yield call(getRequestParams);

  const [[rooms, roomError], [services, serviceError]] = yield all([
    call(fetchRooms, params),
    call(fetchServices, params),
  ]);

  if (roomError || serviceError) {
    console.error(roomError || serviceError);
    yield put(setFetchRoomsError("При загрузке данных произошла ошибка"));
  } else {
    yield put({ type: SET_ROOMS, payload: rooms });
    yield put({ type: SET_SERVICES, payload: services });
  }

  yield put(isLoadingRooms(false));
}

function* getRequestParams() {
  const searchParams = yield select(getParams);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);
  return { ...searchParams, hotel_id, pms_type };
}

function* fetchRooms({ pms_type, hotel_id, ...params }) {
  const url = `/api/v1/availability/${hotel_id}/`;
  const { payload, error } = yield call(fetchWithParams, params, url);
  return [payload, error];
}

function* fetchServices({ pms_type, hotel_id, ...params }) {
  const url = `/api/v1/packages/${hotel_id}/`;
  const { payload, error } = yield call(fetchWithParams, params, url);
  return [payload, error];
}

async function fetchWithParams(params, url) {
  const { arrival, departure, adults, childs } = params;

  const { promo_code, rooms_count: rooms } = params;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

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
      rooms,
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
