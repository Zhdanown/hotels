import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  ...(process.env.NODE_ENV === "production" && {
    baseURL: process.env.REACT_APP_API,
    headers: {
      "Content-type": "application/json",
    },
  }),
});

function whitelisted(url) {
  const list = [
    "/users/info",
    "/create-profile",
    "/users/guest",
    "/users/attachments/upload/",
    "users/delete-guest-attachments",
    "users/delete-guest",
    "account-reservation",
    "reservation-status",
    "color-availability",
    "reservation/edit/guests",
  ];
  return list.some(listItem => url.includes(listItem));
}

api.interceptors.request.use(request => {
  const token = CookieUtils.getToken();

  if (token && whitelisted(request.url)) {
    request.headers.common["Authorization"] = `NLB ${token}`;
  }
  return request;
});

export default api;

window.api = api;

export const CookieUtils = {
  setToken: token => Cookies.set("nlb_token", token),
  getToken: () => Cookies.get("nlb_token"),
  clearToken: () => Cookies.remove("nlb_token"),
};

export const getAuthHeaderIfTokenPresent = () => {
  const token = CookieUtils.getToken();

  if (token) return { Authorization: `NLB ${token}` };
  return {};
};
