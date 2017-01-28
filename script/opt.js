/* ESLint Globals */
/* global RoundX:false */

const boundaries = [
  [0, 1500, 19500, 31700, 58500, 121500, 195250, 455000, 620000, 715000],
  [0, 3000, 21000, 37700, 63000, 166500, 247500, 490000, 691666.667, 770000],
  [0, 4500, 22500, 43050, 67500, 204000, 292500, 525000, 763333.333, 825000],
  [0, 6000, 24000, 47550, 72000, 239000, 337500, 560000, 835000, 880000],
  [0, 7500, 25500, 52050, 76500, 274000, 382000, 595000, 906666.667, 935000],
  [0, 9000, 27000, 56550, 81000, 309000, 417000, 630000, 978333.333, 990000],
  [0, 10500, 28500, 61050, 85500, 344000, 452000, 665000, 1052500, 1052500],
  [0, 12000, 30000, 65550, 90000, 379000, 487000, 700000, 1132500, 1132500],
  [0, 13500, 31500, 70050, 94500, 414000, 522000, 735000, 1212500, 1212500],
  [0, 15000, 33000, 74550, 99000, 449000, 557000, 770000, 1292500, 1292500],
  [0, 16500, 34500, 79050, 103500, 484000, 592000, 805000, 1372500, 1372500],
  [0, 18000, 36000, 83550, 108000, 519000, 627000, 840000, 1452500, 1452500]
];

const strategies = {
  fixed_sal_base: [0, 1500, 0, 4500, 0, 0, 35000, 0, 55000, 0],
  fixed_sal_bool: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
  fixed_bonus_base: [0, 0, 18000, 0, 54000, 108000, 0, 420000, 0, 660000],
  fixed_bonus_bool: [0, 0, 1, 0, 1, 1, 0, 1, 0, 1]
};

const thrhd = [0, 1500, 4500, 9000, 35000, 55000, 80000];
const r = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
const q = [0, 105, 555, 1005, 2755, 5505, 13505];


/*************** Core functions ***************/
//Calculate IIT based on taxable bonus
//Input (Bonus); Return [IIT, TaxRate, QuickDeduction]
function iit_net_b(B) {
  if (B <= 0) return [0, 0, 0];

  let b = B / 12;
  let i = -1;
  while (b > thrhd[i + 1]) i++; //comparing undefined always returns false
  return [RoundX(B * r[i] - q[i], 2), r[i], q[i]];
}

//Calculate IIT based on taxable salary
//Input (Salary); Return [IIT, TaxRate, QuickDeduction]
function iit_net_s(S) {
  if (S <= 0) return [0, 0, 0];

  let i = -1;
  while (S > thrhd[i + 1]) i++; //comparing undefined always returns false
  return [RoundX(S * r[i] - q[i], 2), r[i], q[i]];
}

class solution {
  constructor(alloc_months = 1, bonus = 0, monthly_salary = 0, non_taxable_allowance = 0, social_insurance = 0, deductible = 3500) {
    this.months = +alloc_months;
    this.bonus = { gross: +bonus };
    this.salary = { gross: +monthly_salary };
    this.total = {};
    this.nta = +non_taxable_allowance;
    this.sihf = +social_insurance;
    this.d = +deductible;

    this.bonus.taxable = Math.max(0, this.bonus.gross + Math.min(0, this.salary.gross - this.sihf - this.d));
    [this.bonus.iit, this.bonus.iit_r, this.bonus.iit_q] = iit_net_b(this.bonus.taxable);
    this.bonus.net = this.bonus.gross - this.bonus.iit;
    this.salary.taxable = Math.max(0, this.salary.gross - this.sihf - this.d);
    [this.salary.iit, this.salary.iit_r, this.salary.iit_q] = iit_net_s(this.salary.taxable);
    this.salary.net = this.salary.gross + this.nta - this.sihf - this.salary.iit;
    this.total.gross = this.bonus.gross + (this.salary.gross + this.nta) * this.months;
    this.total.taxable = Math.max(0, this.bonus.gross + (this.salary.gross - this.sihf - this.d) * this.months);  //for optimization purpose
    this.total.iit = this.bonus.iit + this.salary.iit * this.months;
    this.total.net = this.bonus.net + this.salary.net * this.months;
  }
}

function opt(months, bonus_0, salary_0, nta_0, sihf_0, d_0) {
  let sol_0 = new solution(months, bonus_0, salary_0, nta_0, sihf_0, d_0);

  let i = -1;
  while (sol_0.total.taxable - 0.001 > boundaries[+months-1][i + 1]) i++;
  if (i == -1) i = 0;
  let new_net_bonus = (sol_0.total.taxable - strategies.fixed_sal_base[i] * months) * strategies.fixed_sal_bool[i]
    + strategies.fixed_bonus_base[i] * strategies.fixed_bonus_bool[i];
  let new_net_salary = RoundX((sol_0.total.taxable - new_net_bonus) / months, 2);

  let sol_1 = new solution(
    months,
    new_net_bonus,
    new_net_salary + Math.min(sol_0.sihf + sol_0.d, sol_0.salary.gross + RoundX(sol_0.bonus.gross / months, 2)),
    sol_0.nta,
    sol_0.sihf,
    sol_0.d
  );

  return [sol_0, sol_1];
}
