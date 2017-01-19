const thrhd = [0, 1500, 4500, 9000, 35000, 55000, 80000];
const r = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
const q = [0, 105, 555, 1005, 2755, 5505, 13505];

/*** Library ***/
//Thanks to MDN
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
//Precaution: doesn't work "awayfromzero" for negative numbers
function RoundX(value, exp) {
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


/*** Core functions ***/
function iit_bonus(b) {
  let i = 6;
  while (i > 0 && b <= thrhd[i]) i--;
  return RoundX(RoundX(b * 12, 2) * r[i] - q[i], 2);
}

function iit_monthly(x) {
  let i = 6;
  while (i > 0 && x <= thrhd[i]) i--;
  return RoundX(x * r[i] - q[i], 2);
}

function iit_ttl(b, x, M) {
  return iit_bonus(b) + iit_monthly(x) * M;
}

function gen_boundary(S, M) {
  let bounds = [];
  let i = 0;

  while (thrhd[i] * M <= S) {
    bounds.push(thrhd[i]);
    bounds.push(RoundX((S - thrhd[i] * M) / 12, 3));
    i++;
  }
  bounds.sort(function (a, b) { return a - b; });
  return bounds;
}

function find_best(S, M) {
  let iit_best = S;
  let solution = [];
  solution["bonus"] = 0;
  solution["salary"] = 0;
  solution["iit"] = 0;
  solution["netpay"] = 0;

  for (let b of gen_boundary(S, M)) {
    let x = RoundX((S - b * 12) / M, 2);
    let iit_current = iit_ttl(b, x, M);
    if (iit_current < iit_best - 0.12) {
      iit_best = iit_current;
      solution["bonus"] = RoundX(b * 12, 2);
      solution["salary"] = RoundX((S - b * 12) / M, 2);
      solution["iit"] = iit_best;
      solution["netpay"] = RoundX(S - iit_best, 2);
    }
  }
  solution["Sum"] = S;
  return solution;
}



/*** Wrap-up functions ***/