import { all } from "redux-saga/effects";
import roomsSaga from "../rooms/roomsSaga";
import { bookingSaga } from "./booking/bookingSaga";
import authSaga from "../Auth/sagas/authSaga";

export default function* rootSaga() {
  yield all([roomsSaga(), bookingSaga(), authSaga()]);
}
