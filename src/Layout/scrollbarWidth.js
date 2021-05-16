function createInvisibleDIV() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  outer.style.msOverflowStyle = "scrollbar";
  document.body.appendChild(outer);
  return outer;
}
function createInnerDIV(outer) {
  const inner = document.createElement("div");
  outer.appendChild(inner);
  return inner;
}

export const scrollbarWidth = (function getScrollbarWidth() {
  const outer = createInvisibleDIV();
  const inner = createInnerDIV(outer);

  const witdh = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return witdh;
})();
