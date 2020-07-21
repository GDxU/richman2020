import Vue from "vue";
import { TimelineLite } from "gsap";


const module = {
  install : (Vue, opts) => {
//    that.$GSLite = new TimelineLite ();
    Vue.prototype.$GSLite = function (data) {
      return new new TimelineLite ()
    }
  }
};

Vue.use (module);


