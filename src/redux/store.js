import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import reservationReducer from "./booking";
import configReducer from "./hotelConfig";
import roomsReducer from "../Step2/roomsReducer";
import authReducer from "../Auth/authReducer";
import rootSaga from "./rootSaga";

const rootReducer = combineReducers({
  rooms: roomsReducer,
  reservation: reservationReducer,
  hotelConfig: configReducer,
  auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, thunk))
);

sagaMiddleware.run(rootSaga);

export default store;
