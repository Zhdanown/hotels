import { takeEvery, put, call, select } from "redux-saga/effects";
import api from "../redux/api";
import { REQUEST_ROOMS, FOUND_ROOMS } from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../redux/booking";
import { getProfileId } from "../Auth/authReducer";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, requestRooms);
}

function* requestRooms(action) {
  const searchParams = yield select(getParams);
  const profileId = yield select(getProfileId);

  yield put(isLoadingRooms(true));
  const payload = yield call(fetchRooms, { ...searchParams, profileId });
  yield put({ type: FOUND_ROOMS, payload });
  yield put(isLoadingRooms(false));
}

async function fetchRooms(searchParams) {
  const {
    arrival,
    departure,
    adults,
    profileId,
    promo_code,
    childs,
  } = searchParams;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

  const url = `/api/v1/fidelio/avilability/1/`;

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
