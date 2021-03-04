import { takeEvery, put, call, select } from "redux-saga/effects";
import api from "../redux/api";
import { REQUEST_ROOMS, FOUND_ROOMS } from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../redux/booking";
import { getProfileId } from "../Auth/authReducer";
import { getConfigId, getHotelPms } from "../redux/hotelConfig";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, requestRooms);
}

function* requestRooms() {
  yield put(isLoadingRooms(true));
  const payload = yield call(getParamsAndFetch);
  yield put({ type: FOUND_ROOMS, payload });
  yield put(isLoadingRooms(false));
}

function* getParamsAndFetch() {
  const searchParams = yield select(getParams);
  const profileId = yield select(getProfileId);
  const hotel_id = yield select(getConfigId);
  const pms_type = yield select(getHotelPms);

  const payload = yield call(fetchRooms, {
    ...searchParams,
    profileId,
    hotel_id,
    pms_type,
  });
  return payload;
}

async function fetchRooms(params) {
  const {
    arrival,
    departure,
    adults,
    profileId,
    promo_code,
    childs,
    hotel_id,
    pms_type,
  } = params;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

  const url = `/api/v1/${pms_type}/avilability/${hotel_id}/`;

  const response = await api.get(url, {
    params: {
      arrival,
      departure,
      adults,
      childs: serializeChilds(childs),
      promo_code,
      profile_id: profileId,
    },
  });

  return response.data;
}

function serializeChilds(childs) {
  const childsDictionary = childs.reduce((obj, category) => {
    return { ...obj, [category.code]: category.count };
  }, {});

  return JSON.stringify(childsDictionary);
}
