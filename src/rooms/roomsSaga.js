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
  const { arrival, departure, adults, profileId } = searchParams;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

  const url = `/api/v1/fidelio/avilability/1/?arrival=${arrival}&departure=${departure}&adults=${adults}&profile_id=${profileId}`;
  const response = await api.get(url);

  return response.data;
}
