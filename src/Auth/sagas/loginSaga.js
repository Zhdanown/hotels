import { call, put } from "redux-saga/effects";
import { CookieUtils } from "../../redux/api";
import { SET_USER } from "../authReducer";
import { loginPending, setLoginError } from "../authReducer";
import { getUserInfo, sberSignIn, signIn } from "./authSagaHelpers";

export default function* loginWatcher(action) {
  yield put(loginPending(true));
  yield put(setLoginError(null));

  const { sberLogin, ...bodyRequest } = action.payload;
  const { token, signInError } = yield call(
    sberLogin ? sberSignIn : signIn,
    bodyRequest
  );
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
