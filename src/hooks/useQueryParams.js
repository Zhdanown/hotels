export function useQueryParams() {
  const searchString = window.location.search;
  const params = searchString
    .replace("?", "")
    .split("&")
    .map(searchParam => searchParam.split("="));

  return Object.fromEntries(params);
}
