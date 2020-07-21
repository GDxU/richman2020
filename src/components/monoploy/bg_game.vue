<template>
  <pixi-viewport-canvas
    class="flex-row"
    ref="game_play_canvas"
    :asset_js="loaded_asset_list"
    :width="viewport_control.screenWidth"
    :height="viewport_control.screenHeight"
    :viewport_c="viewport_control"
  />
</template>

<script>

  import basesnd from "../../plugins/mixins/monoploy/audiobase"
  import sndmono2d from "../../plugins/mixins/monoploy/mono_2d"
  import asset_module from "../../plugins/mixins/monoploy/theme_jd"
  import MapLogic from "../../plugins/mono_2dx/MapLogic";
  import PixiViewportCanvas from "./pixi_viewport_canvas";
  import StringFilter from "../../plugins/mixins/tools/string_tx"

  export default {
    components : { PixiViewportCanvas },
    name : "bg_game",
    mixins : [basesnd, sndmono2d, asset_module, StringFilter],
    methods : {
      getRenderer () {
        const { game_play_canvas } = this.$refs;
        return game_play_canvas.getRenderer ()
      },
      getViewPort () {
        return this.viewport;
      },
      gGameLogic () {
        return this.mapIo;
      },
      setupMapSize (data) {
        if (MapLogic.isValidMapData (data)) {
          const map = MapLogic.extractMapSize (data, (cc) => {
            this.viewport_control.worldWidth = cc.ww;
            this.viewport_control.worldHeight = cc.wh;
            this.viewport_control.screenWidth = window.innerWidth;
            this.viewport_control.screenHeight = window.innerHeight;
            this.viewport.resize (data.sw, data.sh, this.viewport_control.screenWidth, this.viewport_control.screenHeight);
          });
        }
      },
      resize () {
        const that = this;
        return function () {
          const w = window.innerWidth;
          const h = window.innerHeight;
          that.getRenderer ().resize (w, h);
          that.getViewPort ().resize (w, h);
        }
      },
      reflectEventName (event_name) {
        const that = this;
        that.$on (event_name, function (e) {
          that.$emit (event_name + "_", e);
        })
      }
    },
    data () {
      return {
        viewport : null,
        mapIo : null,
        viewport_control : {
          screenWidth : 512,
          screenHeight : 600,
          worldWidth : 512,
          worldHeight : 1016,
        },
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
        animationChars : [],
        items : [],
      };
      const that = this;
      config.arenaSizeX = config.tileSize * config.tileScale * config.tileX;
      config.arenaSizeY = config.tileSize * config.tileScale * config.tileY;
      if (window) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        that.viewport_control.screenHeight = h;
        that.viewport_control.screenWidth = w;
      }
      const { game_play_canvas } = that.$refs;
      that.$nextTick (function () {
        //game_play_canvas.DebugShowAllItems ();
        game_play_canvas.$on ("init_canvas", function (payload) {

          that.reflectEventName ("stop_event");
          that.reflectEventName ("player_turn");
          that.reflectEventName ("dice_result");
          that.reflectEventName ("start_dice");
          that.reflectEventName ("transfer_cash");
          that.reflectEventName ("pass_event");

          const list = that.assetList (payload.res);
          const { res, zoo_keeper, bg_layer, panel_world } = payload;
          config.brushTiles = list;
          config.animationChars = that.assetCharactors (payload.res);
          config.items = that.assetPathItems (payload.res);
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
          //console.log ("MapLogic 1");
          that.mapIo = new MapLogic (res, zoo_keeper, bg_layer, config, that);
          // console.log ("MapLogic 2");
          that.viewport = panel_world;
          /**
           * window resize event
           */
          if (window) {
            window.onresize = that.resize ();
            that.resize () ();
          }
          that.$emit ("main_start");
          that.$on ("cam_focus", (data) => {
            panel_world.snap (data.x, data.y, {
              time : data.time,
              removeOnComplete : true,
            });
          });
          that.$on ("focus_moving", (data) => {
            panel_world.moveCenter (data.x, data.y);
          })
        });
        /*
          game_play_canvas.$on ("pointer_click", (pos) => {});
        */
      })

    }
  }
</script>
<style scoped>

</style>
