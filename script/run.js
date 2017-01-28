function addDropdownOption() {
  let s = "";

  //Months dropdown
  s = "<option value=\"1\" selected=\"selected\">1</option>";
  for (let i = 2; i <= 12; i++)
    s += "<option value=\"" + i + "\">" + i + "</option>";
  document.getElementById("input_months").innerHTML = s;

  //Deduction dropdown
  s = "<option value=\"3500\" selected=\"selected\">3500</option>";
  s += "<option value=\"4800\">4800</option>";
  document.getElementById("input_deduction").innerHTML = s;
}

document.addEventListener("DOMContentLoaded", function () {
  addDropdownOption();
});

document.getElementById("btn_run").addEventListener("click", function () {
  let in_months = +document.getElementById("input_months").value;
  let in_bonus = +document.getElementById("input_bonus").value;
  let in_salary = +document.getElementById("input_salary").value;
  let in_nta = +document.getElementById("input_nta").value;
  let in_sihf = +document.getElementById("input_sihf").value;
  let in_deduction = +document.getElementById("input_deduction").value;
  if (isNaN(in_months + in_salary + in_bonus + in_nta + in_sihf + in_deduction)) {
    document.getElementById("lbl_warning").innerHTML = "输入错误！<br>请检查！";
    return;
  }
  else {
    document.getElementById("lbl_warning").innerHTML = "";
  }

  let [sol_0, sol_1] = opt(in_months, in_bonus, in_salary, in_nta, in_sihf, in_deduction);

  document.getElementById("bonus_0").innerHTML = sol_0.bonus.gross.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salary_0").innerHTML = sol_0.salary.gross.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("sihf_0").innerHTML = sol_0.sihf.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iit_0").innerHTML = sol_0.total.iit.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("net_0").innerHTML = sol_0.total.net.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("bonus_1").innerHTML = sol_1.bonus.gross.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salary_1").innerHTML = sol_1.salary.gross.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("sihf_1").innerHTML = sol_1.sihf.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iit_1").innerHTML = sol_1.total.iit.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("net_1").innerHTML = sol_1.total.net.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("bonus_change").innerHTML = (sol_1.bonus.gross-sol_0.bonus.gross).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salary_change").innerHTML = (sol_1.salary.gross-sol_0.salary.gross).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("sihf_change").innerHTML = (sol_1.sihf-sol_0.sihf).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iit_change").innerHTML = (sol_1.total.iit-sol_0.total.iit).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("net_change").innerHTML = (sol_1.total.net-sol_0.total.net).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("amount").innerHTML = (sol_1.total.net-sol_0.total.net).toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
});
