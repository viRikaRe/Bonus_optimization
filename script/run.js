function addDropdownOption() {
  let s = "";
  s = "<option value=\"1\" selected=\"selected\">1</option>";
  for (let i = 2; i <= 12; i++)
    s += "<option value=\"" + i + "\">" + i + "</option>";
  document.getElementById("alloc_months").innerHTML = s;
}

document.addEventListener("DOMContentLoaded", addDropdownOption());

document.getElementById("btn_run").addEventListener("click", function () {

  //Actual code here...

  /*Speed Test*/
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
});
