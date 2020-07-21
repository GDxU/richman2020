<template>
  <section>
    <canvas ref="canvas_instance_1"></canvas>
  </section>
</template>
<script>
  /* global PIXI */
  //import Waves from "../../plugins/pixi/shaders/waves"
  import * as PIXI from "pixi.js"
  import { TimelineLite, Back, Power2, Power1, GSDevTools } from "gsap"
  import LoaderScreen from "../../plugins/pixi/LoaderScreen"
  import axios from "../../plugins/axios";
  import { Viewport } from "pixi-viewport";
  function relMouseCoords (event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

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
    name : "pixi-canvas",
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
      onUpdate : {
        type : Object,
        // Object or array defaults must be returned from
        // a factory function
        default : function (dt, df) {
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
      }
    },
    mounted () {
      const that = this;
      const store = that.$store;
      const { canvas_instance_1 } = that.$refs;
      that.$nextTick (() => {
        store.dispatch ("pixiUtil/setRenderSize", { canvasWidth : that.width, canvasHeight : that.height });

        startRender (canvas_instance_1, that,
          function (renderer, stage, src) {
            that.loadedRes = src;
            that.stage = stage;

            that.renderer = renderer;
            //  console.log ("renderer");
            const background_layer = new PIXI.Container ();
            stage.addChild (background_layer);
            that.bg_layer = background_layer;
            const itemsKeeper = new PIXI.Container ();
            stage.addChild (itemsKeeper);
            that.keeper = itemsKeeper;
            //  that.$on ("engineUpdate", that.onUpdate);
            // that.TestDebug ();
            //addFilterWaves (items);
            that.$emit ("init_canvas", {
              renderer : renderer,
              res : src,
              bg_layer : background_layer,
              zoo_keeper : itemsKeeper
            });
          });
      });
    }
  }
</script>

<style scoped>

</style>
