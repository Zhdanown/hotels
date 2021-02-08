import { all } from "redux-saga/effects";
import roomsSaga from "../rooms/roomsSaga";
import { bookingSaga } from "./booking";

export default function* rootSaga() {
  yield all([roomsSaga(), bookingSaga()]);
}
