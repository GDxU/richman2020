<template>
  <section>
    <canvas id="view_pixel_vp" ref="gameContentInstance"></canvas>
  </section>
</template>
<script>
  /* global PIXI */
  //import Waves from "../../plugins/pixi/shaders/waves"
  //import axios from "../../plugins/axios";
  import * as PIXI from "pixi.js"
  import { TimelineLite, Back, Power2, Power1, GSDevTools } from "gsap"
  import LoaderScreen from "../../plugins/pixi/LoaderScreen"
  import { Viewport } from "pixi-viewport";

  function relMouseCoords (event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = this;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return { x : canvasX, y : canvasY }
  }

  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

  function disableContextMenu (canvas) {
    canvas.addEventListener ('contextmenu', (e) => {
      e.preventDefault ();
    });
  }


  function startRender (canvas, vue, callbacknext) {

    function getOffset (d) {
      const a = d.offsetTop;
      const b = d.offsetLeft;
      return {
        x : a,
        y : b
      }
    }

    function fixedPosMousePos (elem, event) {
      const k = getOffset (elem);
      return {
        x : event.pageX - k.x - document.body.scrollLeft,
        y : event.pageY - k.y - document.body.scrollTop
      }
    }

    function fixedPosMousePos2 (elem, event) {
      const k = elem.relMouseCoords (event);
      return k;
    }

    function clickEvent (elem) {
// Add event listener for `click` events.
      elem.addEventListener ('mouseup', function (event) {
        // console.log("mouse event");
        const k = fixedPosMousePos2 (elem, event);
        vue.$emit ("pointer_click", k)
      }, false);
      elem.addEventListener ("touchend", function (event) {
        const k = fixedPosMousePos2 (elem, event);
        vue.$emit ("pointer_click", k)
      }, false)
    }


    const loader = new LoaderScreen (vue.$store); // Basic Loading screen

    //console.log ("find out there");
    //console.log (canvas);
    //console.log (PIXI);
    //return

    const renderer = PIXI.autoDetectRenderer ({
      backgroundColor : 0xffffff,
      width : vue.width,
      height : vue.height,
      view : canvas,
      antialias : true,
      clearBeforeRender : true,
    });

    // setup renderer and ticker
    // let renderer = new PIXI.Renderer ({ width : 800, height : 600, backgroundColor : 0x1099bb });
    // document.body.appendChild (renderer.view);
    //context = renderer.context;
    let stage = new PIXI.Container ();

    loader.onLoaded (function (_load, resources) {
      //     context_src.packedim.spritesheet.textures[""]
      //     setup areas
      console.log ("loaded resources in textures");
      //console.log (resources);
      callbacknext (renderer, stage, resources);
      disableContextMenu (canvas);
      clickEvent (canvas);
      requestAnimationFrame (animate);

    });
    // setup RAF
    let oldTime = Date.now ();

    function animate () {
      let newTime = Date.now ();
      let deltaTime = newTime - oldTime;
      oldTime = newTime;
      if (deltaTime < 0) deltaTime = 0;
      if (deltaTime > 1000) deltaTime = 1000;
      let deltaFrame = deltaTime * 60 / 1000; //1.0 is for single frame
      // update your game there
      vue.$emit ("engineUpdate", { dt : deltaTime, df : deltaFrame });
      renderer.render (stage);
      requestAnimationFrame (animate);
    }

//    const Assets = require (vue.asset_path);
    stage.addChild (loader);

    /* axios.post (vue.asset_path, {})
       .then (function (response) {
         console.log (response);
       })
       .catch (function (error) {
         console.log ("post data got er", error);
       });*/
    //console.log (vue.asset_js);
    loader.start (vue.asset_js);
  }


  export default {
    name : "pixi-viewport-canvas",
    props : {
      asset_path : String,
      asset_js : Array,
      width : {
        type : Number,
        default : 400
      },
      height : {
        type : Number,
        default : 400
      },
      viewport_c : {
        type : Object,
        // Object or array defaults must be returned from
        // a factory function
        default : {
          screenWidth : 400,
          screenHeight : 400,
          worldWidth : 20000,
          worldHeight : 20000,
        }
      },
    },
    data () {
      return {
        stage : null,
        renderer : null,
        areas : new Map (),
        loadedRes : null,
        keeper : null,
        bg_layer : null,
      }
    },
    methods : {
      DebugShowAllItems () {
        console.log (this.areas);
      },
      AddItem (name, anything) {
        this.stage.addChild (anything);
        this.areas.set (name, anything);
      },
      Remove (name) {
        if (this.areas.get (name) !== undefined) {
          const sprite = this.areas.get (name);
          this.stage.removeChild (sprite);
          this.areas.delete (name);
        }
      },
      setBackground (sprite) {
        this.bg_layer.addChild (sprite);
      },
      getAllItemsContainer () {
        return this.keeper;
      },
      getRenderer () {
        return this.renderer;
      }
    },
    mounted () {
      const that = this;
      const store = that.$store;
      const { gameContentInstance } = that.$refs;
      that.$nextTick (() => {
        store.dispatch ("pixiUtil/setRenderSize", { canvasWidth : that.width, canvasHeight : that.height });

        startRender (gameContentInstance, that,
          function (renderer, stage, src) {
            that.loadedRes = src;
            that.stage = stage;
            that.renderer = renderer;

            const viewportconfig = that.viewport_c;
            viewportconfig.interaction = renderer.plugins.interaction;
            //  console.log ("renderer");
            const itemsKeeper = new PIXI.Container ();
            const background_layer = new PIXI.Container ();
            const ui = new PIXI.Container ();

            const world = new Viewport (viewportconfig);
            stage.addChild (world);
            stage.addChild (ui);
            world.addChildAt (background_layer, 0);
            world.addChildAt (itemsKeeper, 1);
            that.bg_layer = background_layer;
            that.keeper = itemsKeeper;
            //  that.$on ("engineUpdate", that.onUpdate);
            // that.TestDebug ();
            //addFilterWaves (items);
            //console.log (world);
            that.$emit ("init_canvas", {
              renderer : renderer,
              res : src,
              bg_layer : background_layer,
              zoo_keeper : itemsKeeper,
              ui_layer : ui,
              panel_world : world,
            });
          });
      });
    }
  }
</script>

<style scoped>

</style>
