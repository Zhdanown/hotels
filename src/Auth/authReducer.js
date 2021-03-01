import { all, call, put, select, take, takeEvery } from "redux-saga/effects";
import api, { CookieUtils } from "../redux/api";
import { getConfigId, SET_CONFIG } from "../redux/hotelConfig";
import history from "../history";

const initialState = {
  isLoginPending: false,
  isRegistrationPending: false,
  loginError: null,
  profileId: null,
  user: null,
  registerError: null,
  //   {
  // email: "test@hard.com",
  // first_name: "John",
  // groups: [],
  // hotel_users: [{ id: 6, external_id: "88237", user: 20, hotel: 1 }],
  // id: 20,
  // is_hotel_guest: true,
  // last_name: "McClane",
  // middle_name: "dfdf",
  // phone: "555-911",
  // username: "tester",
  //   },
};

const START_SESSION = "auth/START_SESSION";
const REGISTER = "auth/REGISTER";
const SET_REGISTER_ERROR = "auth/SET_REGISTER_ERROR";
const REGISTRATION_PENDING = "auth/REGISTRATION_PENDING";
const LOGIN = "auth/LOGIN";
const LOGIN_PENDING = "auth/LOGIN_PENDING";
const SET_LOGIN_ERROR = "auth/SET_LOGIN_ERROR";
const LOGOUT = "auth/LOGOUT";
const SET_USER = "auth/SET_USER";
const SET_PROFILE_ID = "auth/SET_PROFILE_ID";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_REGISTER_ERROR:
      return {
        ...state,
        registerError: action.error,
      };
    case REGISTRATION_PENDING:
      return {
        ...state,
        isRegistrationPending: action.payload,
      };

    case LOGIN_PENDING:
      return {
        ...state,
        isLoginPending: action.payload,
      };

    case SET_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error,
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        profileId: null,
      };

    case SET_USER:
      return {
        ...state,
        user: action.userInfo,
      };
    case SET_PROFILE_ID:
      return {
        ...state,
        profileId: action.profileId,
      };

    default:
      return state;
  }
}

export function startSession() {
  return { type: START_SESSION };
}

export function register(payload) {
  return { type: REGISTER, payload };
}

export function setRegisterError(error) {
  return { type: SET_REGISTER_ERROR, error };
}

export function login(payload) {
  return { type: LOGIN, payload };
}

function loginPending(payload) {
  return { type: LOGIN_PENDING, payload };
}

function registrationPending(payload) {
  return { type: REGISTRATION_PENDING, payload };
}

function setLoginError(error) {
  return { type: SET_LOGIN_ERROR, error };
}

export function logout() {
  return { type: LOGOUT };
}

export function* authSaga() {
  yield takeEvery(START_SESSION, checkToken);
  yield takeEvery(REGISTER, registerUser);
  yield takeEvery(LOGIN, loginUser);
  yield takeEvery(LOGOUT, logoutUser);
}

function* checkToken() {
  const token = yield call(CookieUtils.getToken);
  if (!token) return;

  yield put(loginPending(true));

  const [hotelId, { userInfo, userInfoError }] = yield all([
    call(getHotelId),
    call(getUserInfo),
  ]);

  if (userInfo) {
    const profileId = userInfo.hotel_users.find(x => x.hotel === hotelId)
      .external_id;
    yield put({ type: SET_PROFILE_ID, profileId });
    yield put({ type: SET_USER, userInfo });
  } else {
    if (userInfoError.response.status === 401) {
      yield call(history.push, "/welna_kaluga/login");
    }
  }
  yield put(loginPending(false));
}

function* getHotelId() {
  yield take(SET_CONFIG);
  const hotelId = yield select(getConfigId);
  return hotelId;
}

function* registerUser(action) {
  yield put(registrationPending(true));
  yield put(setRegisterError(null));
  const { registerError } = yield call(requestRegister, action.payload);
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
  const { profileId, PMSError } = yield call(
    registerPMSProfile,
    action.payload,
    hotelId
  );
  if (PMSError) return;

  yield put({ type: SET_PROFILE_ID, profileId });
  const { userInfo, userInfoError } = yield call(getUserInfo);
  if (userInfoError) return;

  yield put({ type: SET_USER, userInfo });
  yield put(registrationPending(false));
}

async function requestRegister(payload) {
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
    const profileId = response.data.profile;
    return { profileId };
  } catch (error) {
    return { PMSError: error };
  }
}

function* loginUser(action) {
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

  const profileId = userInfo.hotel_users.find(x => x.hotel === hotelId)
    .external_id;
  yield put({ type: SET_PROFILE_ID, profileId });

  yield put({ type: SET_USER, userInfo });
  yield put(loginPending(false));
}

function* logoutUser(action) {
  yield call(CookieUtils.clearToken);
}

async function signIn(bodyRequest) {
  try {
    const response = await api.post("/api/v1/users/jwt-token/", bodyRequest);
    const token = response.data.token;
    return { token };
  } catch (error) {
    return { signInError: error };
  }
}

async function getUserInfo() {
  try {
    const response = await api.get("/api/v1/users/info");
    return { userInfo: response.data };
  } catch (error) {
    return { userInfoError: error };
  }
}

export const getIsLoginPending = state => state.auth.isLoginPending;
export const getIsRegistrationPending = state => state.auth.isLoginPending;
export const getUser = state => state.auth.user;
export const getProfileId = state => state.auth.profileId;
export const getRegisterError = state => state.auth.registerError;
export const getLoginError = state => state.auth.loginError;
