// export function hexToRgb(hex = "#aaaaaa", opacity) {
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

//   const r = parseInt(result[1], 16);
//   const g = parseInt(result[2], 16);
//   const b = parseInt(result[3], 16);

//   return `${r},${g},${b}, ${opacity}`;
// }

export function hexToRgb(hex = "#aaaaaa", opacity) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;

}

export function withOpacity (rgb, opacity = 1) {
  const {r,g,b} = rgb;
  return rgb ? `${r},${g},${b}, ${opacity}` : '';
}