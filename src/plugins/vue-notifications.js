// This code will be injected before initializing the root App
import Vue from "vue";
import Noty from "noty";


const options = {
  layout : "topRight",
  theme : "mint",
  timeout : 3000,
};

const module = {
  install : (Vue, opts) => {
    Vue.prototype.$notice = function (data) {
      return new Noty (Object.assign (options, opts, data)).show ()
    }
  }
};

Vue.use (module);
