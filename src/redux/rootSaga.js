import { all } from "redux-saga/effects";
import roomsSaga from "../rooms/roomsSaga";
import { bookingSaga } from "./booking";
import { authSaga } from "../Auth/authReducer";

export default function* rootSaga() {
  yield all([roomsSaga(), bookingSaga(), authSaga()]);
}
