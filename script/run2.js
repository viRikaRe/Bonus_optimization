function addDropdownOption() {
  let s = "";
  s = "<option value=\"1\" selected=\"selected\">1</option>";
  for (let i = 2; i <= 12; i++)
    s += "<option value=\"" + i + "\">" + i + "</option>";
  document.getElementById("alloc_months").innerHTML = s;
}

document.addEventListener("DOMContentLoaded", addDropdownOption());

[].forEach.call(document.getElementsByClassName("inputbox"), function (inputbox) {
  inputbox.addEventListener("blur", function () {
    this.value = this.value.replace(/\,/g, "");
  });
});

document.getElementById("btn_run").addEventListener("click", function () {

  /*************** Markup functions ***************/
  let bonus0 = +document.getElementById("input_bonus").value.replace(/\,/g, "");
  let salary0 = +document.getElementById("input_salary").value.replace(/\,/g, "");
  let sihf = +document.getElementById("input_sihf").value.replace(/\,/g, "");
  let ntd = +document.getElementById("input_ntd").value.replace(/\,/g, "");
  let months = +document.getElementById("alloc_months").value;
  if (isNaN(bonus0 + salary0 + sihf + ntd + months)) {
    document.getElementById("lbl_warning").innerHTML = "Wrong input! Please check!";
    return;
  }
  else {
    document.getElementById("lbl_warning").innerHTML = "";
  }

  let total0 = +bonus0 + salary0 * months;
  let taxable0 = +total0 - (sihf + ntd) * months;
  let iit0 = +iit_net_ttl(bonus0 + Math.min(0, salary0 - sihf - ntd), Math.max(0, salary0 - sihf - ntd), months);
  let netpay0 = +total0 - iit0 - sihf * months;

  let solution1 = get_solution(taxable0, months);
  let taxable1 = +solution1.A1;
  let total1 = +taxable1 + (sihf + ntd) * months;
  let bonus1 = +solution1.B1;
  let salary1 = +solution1.S1 + sihf + ntd;
  let iit1 = +solution1.IIT1;
  let netpay1 = +solution1.NET1 + ntd * months;

  let totale = +total1 - total0;
  let bonuse = +bonus1 - bonus0;
  let salarye = +salary1 - salary0;
  let iite = +iit1 - iit0;
  let netpaye = +netpay1 - netpay0;

  document.getElementById("total0").innerHTML = total0.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("bonus0").innerHTML = bonus0.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salary0").innerHTML = salary0.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iit0").innerHTML = iit0.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("netpay0").innerHTML = netpay0.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("total1").innerHTML = total1.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("bonus1").innerHTML = bonus1.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salary1").innerHTML = salary1.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iit1").innerHTML = iit1.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("netpay1").innerHTML = netpay1.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById("totale").innerHTML = totale.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("bonuse").innerHTML = bonuse.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("salarye").innerHTML = salarye.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("iite").innerHTML = iite.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("netpaye").innerHTML = netpaye.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /*Speed Test*/
  /*
  let sss = "";
  let flag = false;
  let last_b = 0;
  let last_s = 0;
  let last_a = 0;

  for (let p = 0; p < 2000000; p += 20) {
    let rs = get_solution(p, 12);

    switch (flag) {
      case true:
        if (rs.B1 != last_b) {
          sss += "<br>" + last_a + "," + last_b + "," + last_s;
          flag = false;
        }
        break;
      case false:
        if (rs.S1 != last_s) {
          sss += "<br>" + last_a + "," + last_b + "," + last_s;
          flag = true;
        }
    }

    last_b = rs.B1;
    last_s = rs.S1;
    last_a = rs.A1;
  }
  document.getElementById("result").innerHTML = sss;
  */
});
