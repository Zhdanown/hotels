import produce from "immer";
import api from "./api";

export const SET_CONFIG = "config/SET";
const LOADING_CONFIG = "config/LOADING";
const CONFIG_ERROR = "config/ERROR";

const initialState = {
  params: null,
  configLoading: false,
  configError: null,
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return { ...draft, params: action.payload, configLoading: false };

    case LOADING_CONFIG:
      return { ...draft, configLoading: false };

    case CONFIG_ERROR:
      return { ...draft, configError: action.error, configLoading: false };

    default:
      return draft;
  }
}, initialState);

export default reducer;

export const loadConfig = slug => async dispatch => {
  dispatch({ type: LOADING_CONFIG, payload: true });
  try {
    const url = `/api/v1/hotel-config/${slug}/`;
    const response = await api.get(url);

    dispatch({ type: SET_CONFIG, payload: response.data });
  } catch (error) {
    if (!error.response) {
      dispatch({ type: CONFIG_ERROR, error: "Не удалось загрузить данные :(" });
    } else if (error.response.status === 404) {
      dispatch({ type: CONFIG_ERROR, error: "Отель не найден :(" });
    } else {
      throw Error(error);
    }
  }
};

export const getConfig = state => state.hotelConfig.params;
export const getConfigId = state => getConfig(state).id;
export const getConfigLoading = state => state.configLoading;
export const getConfigError = state => state.configError;
export const getIsShowNavbar = state =>
  getConfig(state).hotel_style_config.show_header;
export const getHotelName = state => getConfig(state).name;
export const getMenuItems = state => getConfig(state).hotel_menu_items;
export const getPrimaryColor = state =>
  getConfig(state).hotel_style_config.primary_color;
export const getHoverColor = state =>
  getConfig(state).hotel_style_config.hover_color;
export const getMenuColor = state =>
  getConfig(state).hotel_style_config.menu_background_color;
export const getSvgBgColor = state => {
  const config = getConfig(state);
  return config ? config.hotel_style_config.svg_background_color : null;
};
export const getSvgUrl = state => {
  const config = getConfig(state);
  return config ? config.hotel_style_config.svg : null;
};
export const getCssUrl = state => {
  const config = getConfig(state);
  return config ? config.hotel_style_config.splash : null;
};
export const getArrivalDepartureTime = state => {
  const { time_arrival, time_departure } = getConfig(state);
  return { arrivalTime: time_arrival, departureTime: time_departure };
};
export const getChildCategories = state =>
  getConfig(state).hotel_child_categories;
export const getAvailabilityColors = state =>
  getConfig(state).hotel_availability_colors;
export const getPackages = state => getConfig(state).hotel_packages;
export const getPaymentOptions = state =>
  getConfig(state).hotel_payment_methods;
export const getPaymentForm = state => getConfig(state).payment_form;
