import { createStore, applyMiddleware, compose } from "redux";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import reservationReducer from "../reservation";
import roomsReducer from "../rooms/roomsReducer";
import rootSaga from "./rootSaga";

const rootReducer = combineReducers({
  rooms: roomsReducer,
  reservation: reservationReducer,
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, thunk, ))
);

sagaMiddleware.run(rootSaga);

export default store;
