import { all } from "redux-saga/effects";
import roomsSaga from "../Step2/roomsSaga";
import { bookingSaga } from "./booking/bookingSaga";
import authSaga from "../Auth/sagas/authSaga";
import { createGuestSaga } from "../Step3/AddedGuests.saga";

export default function* rootSaga() {
  yield all([roomsSaga(), bookingSaga(), authSaga(), createGuestSaga()]);
}
