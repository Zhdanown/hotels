import axios from "axios";

const api = axios.create({
  ...(process.env.NODE_ENV === "production" && {
    baseURL: "https://nlb.agex.space/",
    headers: {
      'Content-type': 'application/json'
    }
  }),
});

export default api;
