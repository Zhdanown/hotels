import { call, put, select } from "redux-saga/effects";
import { CookieUtils } from "../../redux/api";
import { getConfigId } from "../../redux/hotelConfig";
import { SET_USER } from "../authReducer";
import { loginPending, setLoginError } from "../authReducer";
import { findProfileId, getUserInfo, signIn } from "./authSagaHelpers";

export default function* loginWatcher(action) {
  yield put(loginPending(true));
  yield put(setLoginError(null));

  const { token, signInError } = yield call(signIn, action.payload);
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

  const hotelId = yield select(getConfigId);
  const profileId = yield call(findProfileId, userInfo, hotelId);

  yield put({ type: SET_USER, userInfo: { ...userInfo, profileId } });

  yield put(loginPending(false));
}

export function* logoutWatcher(action) {
  yield call(CookieUtils.clearToken);
}
