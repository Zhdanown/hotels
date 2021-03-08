export const REQUEST_ROOMS = "rooms/REQUEST_ROOMS";
export const FOUND_ROOMS = "rooms/FOUND_ROOMS";
export const LOADING_ROOMS = "rooms/LOADING_ROOMS";
export const SET_FETCH_ROOM_ERROR = "rooms/SET_FETCH_ROOM_ERROR";

const initialState = {
  rooms: [],
  isLoadingRooms: false,
  loadRoomsError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FOUND_ROOMS:
      return { ...state, rooms: action.payload };

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
export const getRoomsLoadState = state => state.rooms.isLoadingRooms;
export const getRoomLoadError = state => state.rooms.loadRoomsError;