import Vuex from "vuex";
import Vue from "vue";
//import mutations from "./mutations";
//import actions from "./actions";
//import getters from "./getters";
import _mines from "./_mines";
import _survival from "./_survival";
import _sfx from "./_sfx";
import _pixi from "./_pixi";
import _mono from "./_mono";

const createStore = function () {
  const storex = new Vuex.Store ({});
  const opts = {};
  storex.registerModule ("mines", _mines, opts);
  storex.registerModule ("survival", _survival, opts);
  storex.registerModule ("sfx", _sfx, opts);
  storex.registerModule ("pixiUtil", _pixi, opts);
  storex.registerModule ("mono", _mono, opts);
  return storex;
};
Vue.use (Vuex);
export default createStore;
