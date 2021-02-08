import axios from "axios";

const api = axios.create({
  ...(process.env.NODE_ENV === "production" && {
    baseURL: process.env.REACT_APP_API,
    headers: {
      'Content-type': 'application/json'
    }
  }),
});

export default api;
