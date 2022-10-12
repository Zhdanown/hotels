import { call, put } from "redux-saga/effects";
import { CookieUtils } from "../../redux/api";
import { resetParams } from "../../redux/booking";
import { resetConfig } from "../../redux/hotelConfig";
import { SET_USER } from "../authReducer";
import { loginPending, setLoginError } from "../authReducer";
import { redirectToMainPage } from "./authSaga";
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
  
  yield put(resetParams());

  yield put(loginPending(false));

  yield call(redirectToMainPage)
}

export function* logoutWatcher(action) {
  yield call(CookieUtils.clearToken);
  yield call(redirectToMainPage);

  yield put(resetParams());
  yield put(resetConfig());
}
