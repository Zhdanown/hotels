export const REQUEST_ROOMS = "Step2/REQUEST_ROOMS";
export const SET_ROOMS = "Step2/SET_ROOMS";
export const SET_SERVICES = "Step2/SET_SERVICES";
export const LOADING_ROOMS = "Step2/LOADING_ROOMS";
export const SET_FETCH_ROOM_ERROR = "Step2/SET_FETCH_ROOM_ERROR";

const initialState = {
  rooms: [],
  services: [],
  isLoadingRooms: false,
  loadRoomsError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ROOMS:
      return { ...state, rooms: action.payload };

    case SET_SERVICES:
      return { ...state, services: action.payload };

    case LOADING_ROOMS:
      return { ...state, isLoadingRooms: action.payload };

    case SET_FETCH_ROOM_ERROR:
      return { ...state, loadRoomsError: action.error };

    default:
      return state;
  }
}

export function searchRooms() {
  return { type: REQUEST_ROOMS };
}

export function isLoadingRooms(payload) {
  return { type: LOADING_ROOMS, payload };
}

export function setFetchRoomsError(error) {
  return { type: SET_FETCH_ROOM_ERROR, error };
}

export const getRooms = state => state.rooms.rooms;
export const getExtraServices = state => state.rooms.services;
export const getRoomsLoadState = state => state.rooms.isLoadingRooms;
export const getRoomLoadError = state => state.rooms.loadRoomsError;

export const getServiceCost = {
  EVERY_NIGHT: (price, nightsCount) => price * nightsCount,
  FIRST_NIGHT: price => price,
};
