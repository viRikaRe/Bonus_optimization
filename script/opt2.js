/* ESLint Globals */
/* global RoundX:false */

const thrhd = [0, 1500, 4500, 9000, 35000, 55000, 80000];
const r = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
const q = [0, 105, 555, 1005, 2755, 5505, 13505];


/*************** Core functions ***************/
//Calculate IIT based on taxable bonus
//Input (Bonus); Return [IIT, TaxRate, QuickDeduction]
function iit_net_b(B) {
  if (B <= 0) return { IIT: 0, R: 0, Q: 0 };

  let b = B / 12;
  let i = -1;
  while (b > thrhd[i + 1]) i++;
  return { IIT: RoundX(B * r[i] - q[i], 2), R: r[i], Q: q[i] };
}

//Calculate IIT based on taxable salary
//Input (Salary); Return [IIT, TaxRate, QuickDeduction]
function iit_net_s(S) {
  if (S <= 0) return { IIT: 0, R: 0, Q: 0 };

  let i = -1;
  while (S > thrhd[i + 1]) i++;
  return { IIT: RoundX(S * r[i] - q[i], 2), R: r[i], Q: q[i] };
}

//Calculate IIT based on taxable bonus, taxable salary & months
//Input (Bonus, Salary, Months); Return IIT
function iit_net_ttl(B, S, M) {
  return RoundX(iit_net_b(B).IIT + iit_net_s(S).IIT * M, 2);
}

//Reallocate between bonus & salary
//Input (All, Bonus, Months); Return [All', Bonus, Salary', Months]
function alloc(A0, B, M) {
  let S = RoundX((A0 - B) / M, 2);
  let A = B + S * M;
  return { A, B, S, M };
}

//Find singlarities of bonus
//Input (All, Months); Return [...BonusSingularities]
function get_sngl(A, M) {
  let sngl = [];

  for (let i = 0; i < 7; i++) {
    if (thrhd[i] * 12 <= A)
      sngl.push(thrhd[i] * 12);
    if (thrhd[i] * M <= A)
      sngl.push(A - thrhd[i] * M);
    else
      break;
  }
  sngl.sort(function (a, b) { return a - b; });

  for (let i = 1; i < sngl.length; i++) {
    if (sngl[i] == sngl[i - 1]) sngl.splice(i, 1);
  }
  return sngl;
}

//Find all results for each singularity
//Input (All, Months); Return [...{Bonus, IIT}]
function get_all_results(A, M) {
  let results = [];

  for (let B of get_sngl(A, M)) {
    let S = alloc(A, B, M).S;
    let IIT = iit_net_ttl(B, S, M);
    results.push({ B, IIT });
  }
  results.sort(function (a, b) { return a.IIT - b.IIT; });
  return results;
}

//Find the best result
//Input (All, Months); Return [...{Bonus, IIT}]
function get_best_result(A, M, K = 1) {
  let B = 0;
  let IIT = iit_net_s(alloc(A, 0, M).S).IIT * M;

  for (let B_current of get_sngl(A, M)) {
    let S_current = alloc(A, B_current, M).S;
    let IIT_current = iit_net_ttl(B_current, S_current, M);
    if (IIT_current < IIT - K) {
      B = B_current;
      IIT = IIT_current;
    }
  }
  return { B, IIT };
}

function get_all_solutions(A0, M) {
  let result = get_all_results(A0, M);
  let sol = [];

  for (let i = 0; i < result.length; i++) {
    sol[i] = {};
    sol[i].A1 = alloc(A0, result[i].B, M).A;
    sol[i].B1 = result[i].B;
    sol[i].S1 = alloc(A0, result[i].B, M).S;
    sol[i].IIT1 = result[i].IIT;
    sol[i].NET1 = sol[i].A1 - sol[i].IIT1;
  }
  return sol;
}

function get_solution(A0, M) {
  let result = get_best_result(A0, M);

  let sol = {};
  sol.A1 = alloc(A0, result.B, M).A;
  sol.B1 = result.B;
  sol.S1 = alloc(A0, result.B, M).S;
  sol.IIT1 = result.IIT;
  sol.NET1 = sol.A1 - sol.IIT1;
  return sol;
}
