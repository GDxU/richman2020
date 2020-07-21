import VueMqtt from "vue-mqtt"
import Vue from "vue"

var mqoptions = { clientId : "WebClient-" + parseInt (Math.random () * 100000) };
Vue.use (VueMqtt, process.env.WS_URL, mqoptions);

var vmmqtt = new Vue ({
  mqtt : {
    "login/result/+/" : function (val) {
      console.log ("login/result/+/")
    },
    "user/+/serverhash/" : function (val) {
      console.log ("server hash/#")
    },
    "user/+/clienthash/" : function (val) {
      console.log ("client hash/#")
    },
    "user/+/play/" : function (val) {
      console.log ("play/#")
    },
    "param/param/param/test" : function (val) {
      console.log ("param/param/param/test")
    },
    "template/+" : function (data, topic) {
      if (topic.split ("/").pop () === "12345") {
        console.log ("topic:", "template/12345")
      }
    },
    "template/+/param/param" : function (data, topic) {
      if (topic.split ("/")[1] === "12345") {
        console.log ("topic:", "template/12345/param/param")
      }
    },
    "ping" : function (va) {
      console.log ("ping")
    },
    "pong" : function (va) {
      console.log ("pong")
    }
  },

  created () {
    const dat = this;
    //this.$mqtt.subscribe ("provisioning/key/confirm/#")
    //this.$mqtt.subscribe ("provisioning/something/something/#")
    dat.$mqtt.subscribe ("/ws");
    dat.$mqtt.on ("error", function (error) {
      console.log ("error: it is s", error.messages);
    });
    dat.$mqtt.on ("message", function (topic, message) {
      console.log ("message", message)
    });
    dat.$mqtt.on ("connect", function () {
      console.log ("Connected")
    });
    dat.$mqtt.on ("close", function () {
      console.log ("connection error or the server is stopped.")
    });
    setTimeout (function () {
      dat.$mqtt.publish ("chat", "");
      dat.$mqtt.publish ("ping", "");
      dat.$mqtt.publish ("pong", "");
      console.log ("chat is chat right now.")
    }, 1000)
  },
  methods : {
    clickSub : function (val) {
    },
    clickPub : function (val) {
      this.$mqtt.publish ("param/param/param/test", val)
    },
  },
  mounted () {
    // console.log("on mount action is now started.")


  }
});

Object.defineProperty (console, "_commandLineAPI",
  {
    get : function () {
      throw "Do not try to do that!"
    }
  });
/*

with ((console && console._commandLineAPI) || {}) {
    console.error ("do not try..")
}


const disableDevtools = callback => {
    const original = Object.getPrototypeOf;

    Object.getPrototypeOf = (...args) => {
        if (Error().stack.includes("getCompletions")) callback();
        return original(...args);
    };
};

disableDevtools(() => {
    console.error("devtools has been disabled");

    while (1);
});
*/
