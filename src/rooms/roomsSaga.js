import { takeEvery, put, call, select } from "redux-saga/effects";
import api from "../redux/api";
import { REQUEST_ROOMS, FOUND_ROOMS } from "./roomsReducer";
import { isLoadingRooms } from "./roomsReducer";
import { getParams } from "../reservation";

export default function* watcher() {
  yield takeEvery(REQUEST_ROOMS, requestRooms);
}

function* requestRooms(action) {
  const searchParams = yield select(getParams);

  yield put(isLoadingRooms(true));
  const payload = yield call(fetchRooms, searchParams);
  yield put({ type: FOUND_ROOMS, payload });
  yield put(isLoadingRooms(false));
}

async function fetchRooms(searchParams) {
  const { arrival, departure, adults } = searchParams;

  if (!(arrival && departure && adults)) {
    throw Error("Unexpected search parameters");
  }

  const url = `api/v1/fidelio/avilability/1/?arrival=${arrival}&departure=${departure}&adults=${adults}`;
  const response = await api.get(url);

  return response.data;
}
