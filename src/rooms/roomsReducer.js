export const REQUEST_ROOMS = "rooms/REQUEST_ROOMS";
export const SET_ROOMS = "rooms/SET_ROOMS";
export const SET_SERVICES = "rooms/SET_SERVICES";
export const HANDLE_SERVICE_SELECTION = "rooms/HANDLE_SERVICE_SELECTION";
export const LOADING_ROOMS = "rooms/LOADING_ROOMS";
export const SET_FETCH_ROOM_ERROR = "rooms/SET_FETCH_ROOM_ERROR";

const initialState = {
  rooms: [],
  services: [],
  selectedServices: [],
  isLoadingRooms: false,
  loadRoomsError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ROOMS:
      return { ...state, rooms: action.payload };

    case SET_SERVICES:
      return { ...state, services: action.payload };

    case HANDLE_SERVICE_SELECTION:
      return {
        ...state,
        selectedServices: [
          ...state.selectedServices.filter(x => x.id !== action.service.id),
          action.service,
        ].filter(x => x.selected),
      };

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

export function handleExtraService(service) {
  return { type: HANDLE_SERVICE_SELECTION, service };
}

export const getRooms = state => state.rooms.rooms;
export const getPricedServices = state => state.rooms.services;
export const getRoomsLoadState = state => state.rooms.isLoadingRooms;
export const getRoomLoadError = state => state.rooms.loadRoomsError;
