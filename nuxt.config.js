/* eslint-disable */

const pkg = require ("./package");
const webpack = require ("webpack");
const path = require ("path");
const staging_domain = "161.117.84.89:2019";
const nodeExternals = require ("webpack-node-externals");

//const SpritePlugin = require("svg-sprite-loader/plugin");
function isDev () {
  return process.env.NODE_ENV !== "production";
}

function hasAddressInSetting () {
  return process.env.SERVER_IP_DOMAIN !== "";
}

function wsGet () {
  if (hasAddressInSetting ()) {
    return "ws://" + process.env.SERVER_IP_DOMAIN + "/ws";
  } else {
    return "ws://" + staging_domain + "/ws";
  }
}

function httpGet () {
  if (hasAddressInSetting ()) {
    return "ws://" + process.env.SERVER_IP_DOMAIN + "/ws";
  } else {
    return "ws://" + staging_domain + "/ws";
  }
}

module.exports = {
  mode : "spa",
  srcDir : "src",

  /*
  ** Headers of the page
  */
  head : {
    // title : "Dark City FF. Survival",
    //title : "Firework New Year 2019 Survival",
    //title : "Summer Sea Monster Battle",
    title : "Capture the Heart of Richman",
    meta : [
      { charset : "utf-8" },
      { name : "viewport", content : "width=device-width, initial-scale=1" },
      //  { hid : "description", name : "description", content : "The Game of Survival series." },
      //{ hid : "description", name : "description", content : "The Game of Bomb Sweeps." }
      { hid : "description", name : "description", content : "The Game of Getting Rich." }
    ],
    link : [
      //  { rel : "icon", type : "image/x-icon", href : "/building.ico" }
      //  { rel : "icon", type : "image/x-icon", href : "/firework.ico" }
      // { rel : "icon", type : "image/x-icon", href : "/favicon_mine_sea.ico" }
      { rel : "icon", type : "image/x-icon", href : "/tmoney.ico" }
    ]
  },
  plugins : [{
    src : "~/plugins/pixi_setup",
    ssr : true
  }, {
    src : "~/plugins/vue-notifications",
    ssr : false
  }, {
    src : "~/plugins/gsap",
    ssr : false
  }],
  axios : {
    baseURL : isDev () ? "localhost:8089/" : httpGet (),
    browserBaseURL : "/"
  },
  /*vendor : [
    "axios", "vue-good-table", "lodash", "vue-dynamic-forms",
    "vue-good-table", "vue-js-modal", "vue-resource", "vue-router",
    "jquery", "lang.js", "ajv", "vue-mqtt", "vue-notifications",
    "noty", "vue-slider-component", "three", "gsap", "vue-qrious", "@nuxt/http", "pixi.js"
  ],*/
  css : [{
    src : "./assets/styles/init.scss",
    lang : "scss",
  }],
  router : {
    extendRoutes (routes, resolve) {
      let index = routes.findIndex (route => route.name === "index");
      routes[index] = {
        ...routes[index],
        // component : resolve (__dirname, "src/pages/index_city.vue"),
        // component : resolve (__dirname, "src/pages/index_fx.vue"),
        // component : resolve (__dirname, "src/pages/index_mine.vue"),
        component : resolve (__dirname, "src/pages/index_monopoly.vue"),
      };
      // console.log(routes[index]);
    }
  },
  modules : [
    /*   "@nuxtjs/router",
       ["@nuxtjs/router", { }]*/
  ],
  build : {
    //publicPath : "/fbi/",
    //publicPath : "_vx",
    //assetsPublicPath: "./assets",
    /*
    extractCSS: {
      allChunks: true
    },
    */
    filenames : {
      app : "[name].[chunkhash].js",
    },
    analyze : {
      analyzerMode : "static",
      generateStatsFile : true,
      statsFilename : "webpack-stats.json",
      openAnalyzer : true
    },
    plugins : [
      /* new webpack.ProvidePlugin ({
           "$" : "jquery",
           "_" : "lodash"
       }),*/
      new webpack.DefinePlugin ({
        "process.VERSION" : require ("./package.json").version,
        "process.WS_URL" : wsGet ()
      }),
    ],
    extend (config, { isDev, Client, isServer }) {
      // Extends Webpack Configuration
      // Add typescript extension to resolve list
      config.resolve.extensions.push ("ts", "tsx");
      // Add rule for typescript loader
      config.module.rules.push ({
        test : /\.tsx?$/,
        loader : "ts-loader",
        exclude : /node_modules/,
        options : {
          appendTsSuffixTo : [/\.vue$/]
        }
      });
      if (isDev && Client) {
        config.module.rules.push ({
          enforce : "pre",
          test : /\.(js|vue)$/,
          loader : "eslint-loader",
          exclude : /(node_modules)/
        });
      }
      /*   const vueLoader = config.module.rules.find ((loader) => loader.loader === "vue-loader")
         vueLoader.options.transformToRequire = {
           audio : "src"
         };
         */
      /*const vueLoader = config.module.rules.find ((loader) => loader.loader === "vue-loader")
          vueLoader.options.transformToRequire = {
                  audio : "src"
              }*/
      /* config.module.rules.delete("images");
       config.module.rules.push ({
         test : /\.(png|jpe?g|gif|jpg|webp)$/,
         loader : "file-loader",
         exclude : /(assets\/svg)/,
         include : [
           path.resolve (__dirname, "assets/img"),
           path.resolve (__dirname, "static/textures"),
         ],
         options : {
           limit : 4096, // 1KB
           name : "img/[name].[hash:7].[ext]",
         },
       });
 */

      /* config.module.rules.push ({
         test : /\.(mp3)(\?.*)?$/,
         loader : "file-loader",
         include : [
           path.resolve (__dirname, "static/media"),
         ],
       });*/

      /*
       config.module.rules.push ({
         test : /\.mp3$/,
         loader : "url-loader",
         options : {
           limit : 10000,
           name : utils.assetsPath ("audio/[name].[hash:7].[ext]")
         }
       });
       */

      /* config.module.rules.push ({
         test : /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
         use : {
           loader : "url-loader",
           options : {
             limit : 1000, //bytes
             name : "[hash:7].[ext]",
             outputPath : "assets"
           }
         }
       });*/
      /*  config.module.rules.push ({
          test : /\.svg$/,
          include : [
            path.resolve (__dirname, "assets/svg"),
          ],
          use : "svg-sprite-loader",
        });*/

      if (isServer) {
        config.externals = [
          nodeExternals ({
            // default value for `whitelist` is
            // [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i]
            whitelist : [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-echarts/]
          })
        ]
      }
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading : { color : "#ff363a" }
};
