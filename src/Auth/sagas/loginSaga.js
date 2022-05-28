import { call, put } from "redux-saga/effects";
import { CookieUtils } from "../../redux/api";
import { SET_USER } from "../authReducer";
import { loginPending, setLoginError } from "../authReducer";
import { getUserInfo, signIn } from "./authSagaHelpers";
import { signInWithSber } from "./sberSaga";

export default function* loginWatcher(action) {
  yield put(loginPending(true));
  yield put(setLoginError(null));

  const { one_time_pass } = action.payload;

  const { token, signInError } = one_time_pass
    ? yield call(signInWithSber, one_time_pass)
    : yield call(signIn, action.payload);

  if (signInError) {
    if (signInError.response.data) {
      yield put(setLoginError(signInError.response.data));
    }
    yield put(loginPending(false));
    return;
  }

  yield call(CookieUtils.setToken, token);
  const { userInfo, userInfoError } = yield call(getUserInfo);
  if (userInfoError) return;

  yield put({ type: SET_USER, userInfo });
  yield put(loginPending(false));
}

export function* logoutWatcher(action) {
  yield call(CookieUtils.clearToken);
}
