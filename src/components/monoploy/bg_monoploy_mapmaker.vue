<template>
  <section class="flex-row">

    <!--  <pixi-canvas
        class="flex-row"
        ref="mapmaker_canvas"
        :asset_js="loaded_asset_list"
        :width="512"
        :height="600"/>
  -->
    <pixi-viewport-canvas
      class="flex-row"
      ref="mapmaker_canvas"
      :asset_js="loaded_asset_list"
      :width="512"
      :height="600"
      :viewport_c="viewport_control"
    />
    <div class="toolsetbar flex-row">

      <button class="item"
              :class="brush===index?'active':''"
              :key="index"
              v-for="(t, index) in brushesList"
              :data-brush="index"
              @click="useBrush">
        {{t.name}}
      </button>

      <!--
           <button ref="" class="item" :class="brush===0?'active':''" data-brush="0" @click="useBrush">land</button>
            <button class="item" :class="brush===0?'active':''" data-brush="0" @click="useBrush">land</button>
            <button class="item" :class="brush===1?'active':''" data-brush="1" @click="useBrush">sand</button>
            <button class="item" :class="brush===2?'active':''" data-brush="2" @click="useBrush">tree</button>
            <button class="item" :class="brush===3?'active':''" data-brush="3" @click="useBrush">tree2</button>-->
    </div>
    <!-- <div class="flex-row">
       <div id="share_lnk">
         <button class="import_export" @click="toggleCodex">Show C0dex</button>
       </div>
     </div>-->

  </section>
</template>

<style scoped lang="scss">
  .import_export {
    background: #00b236;
    color: #0e5902;
  }

  .btn, button {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0;
    -webkit-transition: all .4s ease;
    -moz-transition: all .4s ease;
    -o-transition: all .4s ease;
    transition: all .4s ease;
    display: inline-block;
    //cursor: pointer
  }

  /*  .share_lnk {
      width: 100%;
      display: block;
    background: #b1b0b2;
      color: blue;
      font-family: "Source Code Pro";
      font-size: xx-small;
    }*/

  //@include "@assets/styles/fo"
  .toolsetbar {
    .item {
      background: #00b236;
      color: #0e5902;
      padding: 5px;
      &.active {
        color: #ffebb6;
        background: #00d541;
      }
    }
  }
</style>

<script>
  /*var player = null;
  var entities = [];
  var mobBrush = "player-knight";

  var tileScale = 8;
  var tileSize = tileScale * 9;
  var tileOffset = tileScale / 2;


  var Gap = function (x, y) {
    this.x = x;
    this.y = y;
  };
  var gaps = [];


  var arenaSizeX = 14;
  var arenaSizeY = 7;*/

  import basesnd from "../../plugins/mixins/monoploy/audiobase"
  import sndmono2d from "../../plugins/mixins/monoploy/mono_2d"
  import asset_module from "../../plugins/mixins/monoploy/theme_jd"
  import MapMaker from "../../plugins/mono_2dx/MapMaker";
  import Codex from "./Codex";
  import PixiViewportCanvas from "./pixi_viewport_canvas";

  export default {
    components : {
      PixiViewportCanvas,
      Codex,
    },
    name : "bg_monoploy_mapmaker",
    mixins : [basesnd, sndmono2d, asset_module],
    methods : {
      useBrush (data) {
        const brush = data.target.attributes["data-brush"].value;
        // const BrushO = this.brushesList[parseInt (brush)];
        this.brush = parseInt (brush);
        this.mapMaker.use (parseInt (brush));
        //console.log ("use this brush: ", BrushO, brush);
      },
      loadMapData (memory_data) {
        const str = String (memory_data);
        this.mapMaker.loadMapEditor (str.trim ());
      }
    },
    data () {
      return {
        brush : "",
        mapMaker : null,
        brushesList : [],
        shared_link_data : "",
        canvasSize : {
          x : 0, y : 0
        },
        viewport_control : {
          screenWidth : 512,
          screenHeight : 600,
          worldWidth : 512,
          worldHeight : 1016,
        }
      }
    },
    mounted () {
      let config = {
        tileSize : 72,
        tileScale : 1,
        tileOffset : 2,
        arenaSizeX : 7,
        arenaSizeY : 9,
        tileX : 7,
        tileY : 16,
        brushTiles : [],
      };

      const that = this;
      config.arenaSizeX = config.tileSize * config.tileScale * config.tileX;
      config.arenaSizeY = config.tileSize * config.tileScale * config.tileY;

      that.canvasSize.x = config.arenaSizeX;
      that.canvasSize.y = config.arenaSizeY;

      const { mapmaker_canvas, codex_box } = that.$refs;

      that.$nextTick (() => {

        mapmaker_canvas.DebugShowAllItems ();
        mapmaker_canvas.$on ("init_canvas", (payload) => {
          // console.log ("=====payload ====");

          const list = that.assetList (payload.res);
          const { res, zoo_keeper, bg_layer, panel_world } = payload;

          config.brushTiles = list;
          that.brushesList = list;

          panel_world.drag ().pinch ().wheel ().decelerate ();

          panel_world.clamp ({
            left : true,
            right : true,
            top : true,
            bottom : true,
            direction : "x",
          });

          panel_world.clampZoom ({
            maxWidth : 512,
          });

          /* tileSize: number,
             tileScale: number,
             tileOffset: number,
             arenaSizeX: number,
             arenaSizeY: number,
             brushTiles: Array<any>
             */
          // console.log (payload, config);


          that.mapMaker = new MapMaker (res, zoo_keeper, bg_layer, config, that);
          panel_world.on ("clicked", (event) => {
            // console.log ("pointer_click", event);
            that.mapMaker.EditorPaintEvent (event.world);
          });
          /* panel_world.on ("frame-end", (event) => {
             console.log ("pointer_click", event);
           });*/
        });

        mapmaker_canvas.$on ("pointer_click", (pos) => {
          //console.log ("pointer_click", pos);

        });


      })
    }

  }
</script>
