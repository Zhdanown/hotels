import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import axios from "axios";

const api = axios.create({
  ...(process.env.NODE_ENV === "production" && {
    baseURL: "https://nlb.agex.space/",
  }),
});

const initialState = {
  config: null,
  // user: null,
};

const SET_CONFIG = "config/SET";

export const loadConfig = slug => async dispatch => {
  const url = "api/v1/hotel-config/welna_kaluga/";
  const response = await api.get(url);

  dispatch({ type: SET_CONFIG, config: response.data });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return { ...state, config: action.config };

    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
