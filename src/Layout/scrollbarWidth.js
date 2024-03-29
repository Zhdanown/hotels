export const scrollbarWidth = (function getScrollbarWidth() {
  const outer = createInvisibleDIV();
  const inner = createInnerDIV();

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;

  function createInvisibleDIV() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    return outer;
  }

  function createInnerDIV() {
    const inner = document.createElement("div");
    outer.appendChild(inner);
    return inner;
  }

})();
