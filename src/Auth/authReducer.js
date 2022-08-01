const initialState = {
  isLoginPending: false,
  isRegistrationPending: false,
  loginError: null,

  user: null,
  registerError: null,
};

export const START_SESSION = "auth/START_SESSION";
export const REGISTER = "auth/REGISTER";
export const SET_REGISTER_ERROR = "auth/SET_REGISTER_ERROR";
export const REGISTRATION_PENDING = "auth/REGISTRATION_PENDING";
export const LOGIN = "auth/LOGIN";
export const LOGIN_PENDING = "auth/LOGIN_PENDING";
export const SET_LOGIN_ERROR = "auth/SET_LOGIN_ERROR";
export const LOGOUT = "auth/LOGOUT";
export const SET_USER = "auth/SET_USER";

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
      };

    case SET_USER:
      return {
        ...state,
        user: action.userInfo,
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

export function loginPending(payload) {
  return { type: LOGIN_PENDING, payload };
}

export function registrationPending(payload) {
  return { type: REGISTRATION_PENDING, payload };
}

export function setLoginError(error) {
  return { type: SET_LOGIN_ERROR, error };
}

export function logout() {
  return { type: LOGOUT };
}

export const getIsLoginPending = state => state.auth.isLoginPending;
export const getIsRegistrationPending = state => state.auth.isLoginPending;
export const getUser = state => state.auth.user;
export const getIsSberEmploye = state => state.auth.user?.teamID_info?.is_active;
export const getUserGuest = (state, guestId) => state.auth.user.user_guests.find(g => g.id === guestId)
export const getRegisterError = state => state.auth.registerError;
export const getLoginError = state => state.auth.loginError;
