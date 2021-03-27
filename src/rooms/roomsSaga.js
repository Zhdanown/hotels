import { takeEvery, put, call, select, all } from "redux-saga/effects";
import api, { getAuthHeaderIfTokenPresent } from "../redux/api";
import {
  REQUEST_ROOMS,
  SET_ROOMS,
  SET_PACKAGES,
  setFetchRoomsError,
} from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../redux/booking";
import { getConfigId, getHotelPms, getPackages } from "../redux/hotelConfig";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, roomsSaga);
}

function* roomsSaga() {
  yield put(isLoadingRooms(true));
  const params = yield call(getRequestParams);

  const [[rooms, roomError], [packages, packageError]] = yield all([
    call(fetchRooms, params),
    call(fetchPackages, params),
  ]);

  if (roomError || packageError) {
    console.error(roomError || packageError);
    yield put(setFetchRoomsError("Не удалось загрузить данные"));
  } else {
    yield put({ type: SET_ROOMS, payload: rooms });
    yield call(setPricedPackages, packages);
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
  const url = `/api/v1/${pms_type}/avilability/${hotel_id}/`;
  const { payload, error } = yield call(fetchWithParams, params, url);
  return [payload, error];
}

function* fetchPackages({ pms_type, hotel_id, ...params }) {
  const url = `/api/v1/${pms_type}/pakages/${hotel_id}/`;
  const { payload, error } = yield call(fetchWithParams, params, url);
  return [payload, error];
}

function* setPricedPackages(packages) {
  let configPackages = yield select(getPackages);
  const pricedPackages = configPackages.map(pkg => {
    const found = packages.find(x => x.id === pkg.id);
    return { ...pkg, price: found.package_price };
  });
  yield put({ type: SET_PACKAGES, payload: pricedPackages });
}

async function fetchWithParams(params, url) {
  const { arrival, departure, adults, promo_code, childs } = params;

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
