import Vue from "vue";

/*

import lodash from "lodash";
Object.defineProperty(Vue.prototype, "$L", { value: lodash });
*/

//must have this
export const WEBSOCKSW = {
  active : false
};
Number.prototype.formatCurrency = function (thou = ",", dec = ".", sym = "$") {
  return this.toFixed (2).toString ().split (/[-.]/).reverse ().reduceRight (function (t, c, i) {
    return (i === 2) ? "-" + t : (i === 1) ? t + c.replace (/(\d)(?=(\d{3})+$)/g, "$1" + thou) : t + dec + c;
  }, sym);
};

Vue.filter ("fix4", function (value) {
  return Number (value).toFixed (4);
});
Vue.filter ("fix3", function (value) {
  return Number (value).toFixed (3);
});
Vue.filter ("fix6", function (value) {
  return Number (value).toFixed (6);
});
Vue.filter ("uppercase", function (value) {
  return String (value).toUpperCase ();
});

function FillZero (p, fill_up) {
  return new Array (fill_up - String (p).length + 1).join ("0") + String (p);
}

Vue.filter ("fill_zero_5", function (value) {
  return FillZero (value, 5);
});
Vue.filter ("notification_code", function (value) {
  if (value === 0) {
    return ""
  } else {
    return String (value)
  }
});
Vue.filter ("changeprofit", function (value) {
  if (value > 0) {
    return "+" + Number (value).toFixed (4);
  } else {
    return "0.0"
  }
});
Vue.filter ("coinName", function (value) {
  return String (value).toUpperCase ()
});
Vue.filter ("coinbalance", function (value) {
  if (value > 0) {
    return Number (value).formatCurrency (",", ".", "");
  } else {
    return ""
  }
});
Vue.filter ("percentage", function (value) {
  let j = (Number (value) * 100).toFixed (4);
  if (j > 0) {
    return j + "%";
  } else {
    return "--"
  }
});
Vue.filter ("bet_n", function (value) {

  let j = parseInt (value);
  if (j < 10 && j > 0) {
    return "0" + Number (j);
  } else {
    return j;
  }
});

export const EventBus = new Vue ();
//import { PIXI } from "pixi.js"
//Vue.use (PIXI);
