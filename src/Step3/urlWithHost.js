export const urlWithHost = path =>
process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_API + path
  : path;