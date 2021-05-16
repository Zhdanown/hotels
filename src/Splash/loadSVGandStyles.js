import api from "../redux/api";

export default async function loadSVGandStyles({ cssUrl, svgUrl }) {
  function getUrl(url) {
    if (process.env.NODE_ENV === "development") {
      return new URL(url).pathname;
    }
    return url;
  }

  const [{ data: styles }, { data: svgTxt }] = await Promise.all([
    api.get(getUrl(cssUrl)),
    api.get(getUrl(svgUrl)),
  ]);

  const { head } = document;
  const style = document.createElement("style");

  head.appendChild(style);

  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = styles;
  } else {
    style.appendChild(document.createTextNode(styles));
  }
  return svgTxt;
}
