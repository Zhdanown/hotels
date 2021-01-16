import { all } from "redux-saga/effects";
import roomsSaga from "../rooms/roomsSaga";
import { reservationWatcher } from "../reservation";

export default function* rootSaga() {
  yield all([roomsSaga(), reservationWatcher()]);
}
