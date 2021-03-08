import { call, put, select } from "redux-saga/effects";
import api, { CookieUtils } from "../../redux/api";
import { getConfigId } from "../../redux/hotelConfig";
import { SET_USER } from "../authReducer";
import { registrationPending, setRegisterError } from "../authReducer";
import { getUserInfo, signIn } from "./authSagaHelpers";

export default function* registerWatcher(action) {
  yield put(registrationPending(true));
  yield put(setRegisterError(null));

  const { registerError } = yield call(registerUser, action.payload);
  if (registerError) {
    if (registerError.response.data) {
      yield put(setRegisterError(registerError.response.data));
    }
    return;
  }

  const { token, signInError } = yield call(signIn, action.payload);
  if (token) {
    yield call(CookieUtils.setToken, token);
  } else {
    if (signInError.response.data) {
      yield put(setRegisterError(signInError.response.data));
    }
    return;
  }

  const hotelId = yield select(getConfigId);
  const { PMSError } = yield call(registerPMSProfile, action.payload, hotelId);
  if (PMSError) return;

  const { userInfo, userInfoError } = yield call(getUserInfo);
  if (userInfoError) return;
  yield put({ type: SET_USER, userInfo });

  yield put(registrationPending(false));
}

async function registerUser(payload) {
  try {
    const response = await api.post(
      "/api/v1/users/accounts/register/",
      payload
    );
    return response.data;
  } catch (error) {
    return { registerError: error };
  }
}

async function registerPMSProfile(payload, hotelId) {
  const bodyRequest = {
    username: payload.username,
    email: payload.email,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone: payload.phone,
    password: payload.password,
  };

  try {
    const response = await api.post(
      `/api/v1/fidelio/create-profile/${hotelId}/`,
      bodyRequest
    );

    return response.data;
  } catch (error) {
    return { PMSError: error };
  }
}
