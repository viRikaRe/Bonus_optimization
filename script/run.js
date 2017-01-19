function addDropdownOption() {
  let s = "";
  s = "<option value=\"1\" selected=\"selected\">1</option>";
  for (let i = 2; i <= 12; i++)
    s += "<option value=\"" + i + "\">" + i + "</option>";
  document.getElementById("alloc_months").innerHTML = s;
}

document.addEventListener("DOMContentLoaded", addDropdownOption());

document.getElementById("btn_run").addEventListener("click", function () {
  let pre_bonus = parseFloat(document.getElementById("pre_bonus").value);
  let pre_sal = parseFloat(document.getElementById("pre_sal").value);
  let si = parseFloat(document.getElementById("pre_si").value);
  let hf = parseFloat(document.getElementById("pre_hf").value);
  let non_tax = parseFloat(document.getElementById("non_tax").value);

  let M = document.getElementById("alloc_months").value;
  let S = pre_bonus + (pre_sal - si - hf - non_tax) * M;

  let post_bonus = find_best(S, M).bonus; document.getElementById("post_bonus").innerHTML = post_bonus;
  let post_sal = find_best(S, M).salary + si + hf + non_tax; document.getElementById("post_sal").innerHTML = post_sal;
  let post_netpay = find_best(S, M).netpay; document.getElementById("post_netpay").innerHTML = post_netpay + non_tax;

  let pre_iit = iit_ttl(pre_bonus / 12, pre_sal - si - hf - non_tax, M); document.getElementById("pre_iit").innerHTML = pre_iit;
  let post_iit = find_best(S, M).iit; document.getElementById("post_iit").innerHTML = post_iit;
  document.getElementById("sav_iit").innerHTML = RoundX(pre_iit - post_iit, 2);
});