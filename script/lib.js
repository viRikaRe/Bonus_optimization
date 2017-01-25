//Thanks to MDN
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function RoundX(value, exp) {
  if (+value < 0) return -RoundX(-value, exp);

  if (typeof exp === "undefined" || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split("e");
  value = Math.round(+(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp));
}

