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
  const list = ["/users/info", "/create-profile"];
  return list.some(listItem => url.includes(listItem));
}

export const CookieUtils = {
  setToken: token => Cookies.set("nlb_token", token),
  getToken: () => Cookies.get("nlb_token"),
  clearToken: () => Cookies.remove("nlb_token"),
};

api.interceptors.request.use(request => {
  const token = CookieUtils.getToken();

  if (token && whitelisted(request.url)) {
    request.headers.common.Authorization = `NLB ${token}`;
  }
  return request;
});

export default api;

export const getAuthHeaderIfTokenPresent = () => {
  const token = CookieUtils.getToken();

  if (token) return { Authorization: `NLB ${token}` };
  return {};
};
