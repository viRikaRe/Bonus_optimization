//no longer used.

const tax_rates = [0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45];
const quick_deducts = [0, 105, 555, 1005, 2755, 5505, 13505];
const base_thresholds = [-3500, 1500, 4500, 9000, 35000, 55000, 80000];


function calc_bonus(bonus, monthly) {
  let ref = Math.max(0, bonus + Math.min(0, monthly)) / 12;
  let i = 6;
  while (ref <= base_thresholds[i]) i--;
  return bonus * tax_rates[i] - quick_deducts[i];
}

function calc_monthly(monthly) {
  let i = 6;
  while (monthly < base_thresholds[i]) i--;
  return monthly * tax_rates[i] - quick_deducts[i];
}

function calc_ttl(bonus, monthly, alloc_months) {
  return calc_bonus(bonus, monthly) + calc_monthly(monthly) * alloc_months;
}

function find_best(pretax, alloc_months) {
  let iit_best = pretax;
  let iit_current;
  let solution = [0, 0, 0];

  for (let bonus = 0; bonus <= pretax; bonus += 1) {
    let monthly = (pretax - bonus) / alloc_months;
    let iit_current = calc_ttl(bonus, monthly, alloc_months);
    if (iit_current < iit_best - 0.01) {
      iit_best = iit_current;
      solution[0] = bonus;
      solution[1] = monthly;
      solution[2] = pretax - iit_best;
    }
  }
  return solution;
}


document.addEventListener("DOMContentLoaded", function () {
  let pretax = 31700;
  let alloc_months = 1;

  document.getElementById("result").innerHTML = find_best(pretax, alloc_months);
});