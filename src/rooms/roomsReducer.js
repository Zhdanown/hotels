export const REQUEST_ROOMS = "REQUEST_ROOMS";
export const FOUND_ROOMS = "FOUND_ROOMS";
export const LOADING_ROOMS = "LOADING_ROOMS";

const initialState = {
  rooms: [],
  isLoadingRooms: false,
};

export const getRooms = state => state.rooms.rooms;
export const getRoomsLoadState = state => state.rooms.isLoadingRooms;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FOUND_ROOMS:
      return { ...state, rooms: action.payload };

    case LOADING_ROOMS:
      return { ...state, isLoadingRooms: action.payload };

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
