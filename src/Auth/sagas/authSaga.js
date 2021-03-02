import { all, call, put, select, take, takeEvery } from "redux-saga/effects";
import history from "../../history";
import { CookieUtils } from "../../redux/api";
import { getConfigId, SET_CONFIG } from "../../redux/hotelConfig";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  SET_USER,
  START_SESSION,
} from "../authReducer";
import { loginPending } from "../authReducer";
import loginWatcher, { logoutWatcher } from "./loginSaga";
import registerWatcher from "./registerSaga";
import { findProfileId, getUserInfo } from "./authSagaHelpers";

export default function* authSaga() {
  yield takeEvery(START_SESSION, startSessionWatcher);
  yield takeEvery(REGISTER, registerWatcher);
  yield takeEvery(LOGIN, loginWatcher);
  yield takeEvery(LOGOUT, logoutWatcher);
}

function* startSessionWatcher() {
  const token = yield call(CookieUtils.getToken);
  if (!token) return;

  yield put(loginPending(true));

  const [hotelId, { userInfo, userInfoError }] = yield all([
    call(getHotelId),
    call(getUserInfo),
  ]);

  if (userInfo) {
    const profileId = yield call(findProfileId, userInfo, hotelId);

    yield put({ type: SET_USER, userInfo: { ...userInfo, profileId } });
  } else {
    if (userInfoError.response.status === 401) {
      yield call(redirectToLoginPage);
    }
  }
  yield put(loginPending(false));
}

function* getHotelId() {
  yield take(SET_CONFIG);
  const hotelId = yield select(getConfigId);
  return hotelId;
}

function* redirectToLoginPage() {
  let { pathname } = window.location;

  const match = pathname.match(/^(?<path>\/\w*)(\/login\/?)?/);
  if (match) {
    const { path } = match.groups;
    yield call(history.push, `${path}/login`);
  }
}
