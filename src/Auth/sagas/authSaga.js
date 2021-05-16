import { call, put, takeEvery } from "redux-saga/effects";
import history from "../../history";
import { CookieUtils } from "../../redux/api";
import {
  LOGIN,
  logout,
  LOGOUT,
  REGISTER,
  SET_USER,
  START_SESSION,
  loginPending,
} from "../authReducer";
import loginWatcher, { logoutWatcher } from "./loginSaga";
import registerWatcher from "./registerSaga";
import { getUserInfo } from "./authSagaHelpers";

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

  const { userInfo, userInfoError } = yield call(getUserInfo);

  if (userInfo) {
    yield put({ type: SET_USER, userInfo });
  } else if (userInfoError.response.status === 401) {
    yield call(redirectToLoginPage);
    yield put(logout());
  }
  yield put(loginPending(false));
}

function* redirectToLoginPage() {
  const { pathname } = window.location;

  const match = pathname.match(/^(?<path>\/\w*)(\/login\/?)?/);
  if (match) {
    const { path } = match.groups;
    yield call(history.push, `${path}/login`);
  }
}
