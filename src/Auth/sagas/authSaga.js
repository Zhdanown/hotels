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
} from "../authReducer";
import { loginPending } from "../authReducer";
import loginWatcher, { logoutWatcher } from "./loginSaga";
import registerWatcher from "./registerSaga";
import { getUserInfo } from "./authSagaHelpers";

export default function* authSaga() {
  yield takeEvery(START_SESSION, fetchUserInfo);
  yield takeEvery(REGISTER, registerWatcher);
  yield takeEvery(LOGIN, loginWatcher);
  yield takeEvery(LOGOUT, logoutWatcher);
}

export function* fetchUserInfo() {
  const token = yield call(CookieUtils.getToken);
  if (!token) {
    yield call(redirectToLoginPage);
    return;
  }

  yield put(loginPending(true));

  const { userInfo, userInfoError } = yield call(getUserInfo);

  if (userInfo) {
    yield put({ type: SET_USER, userInfo });
  } else {
    if (userInfoError.response.status === 401) {
      yield call(redirectToLoginPage);
      yield put(logout())
    }
  }
  yield put(loginPending(false));
}

function* redirectToPage(redirectPath) {
  let { pathname } = window.location;

  const match = pathname.match(/^(?<path>\/\w*)(\/login\/?)?/);
  if (match) {
    const { path } = match.groups;
    yield call(history.push, `${path}${redirectPath}`);
  }
}

function* redirectToLoginPage() {
  yield call(redirectToPage, '/login')
}
export function* redirectToMainPage() {
  yield call(redirectToPage, '/')
}