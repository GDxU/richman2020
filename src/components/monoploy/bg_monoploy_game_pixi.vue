<template>
  <div id="container">
    <canvas id="stage" width="300" height="300"></canvas>
  </div>
</template>
<script>
  //style="width: 100%, height:100%"
  import * as PIXI from "pixi.js"
  import { TimelineLite, Back, Power2, Power1, GSDevTools } from "gsap"
  import LoaderScreen from "../../plugins/pixi/LoaderScreen"
  import { Assets } from "../../static/mmonoploy/soinasemc"
  import basesnd from "../../plugins/mixins/minesweep/audiobase"
  import sndmine from "../../plugins/mixins/minesweep/miniGameMines"


  function shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor (Math.random () * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function addFilterWaves (targetSprite, res) {
    const texture_dis = res.filter_map_displacement.texture;
    texture_dis.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementSprite = new PIXI.Sprite (texture_dis);
    const wave_filter = new PIXI.filters.DisplacementFilter (displacementSprite);
    wave_filter.scale.x = 70;
    wave_filter.scale.y = 50;
    targetSprite.filters = [wave_filter];
  }

  export default {
    name : "bg_monoploy_game_pixi",
    mixins : [basesnd, sndmine],
    data () {
      return {
        stage : null, renderer : null, areas : new Map (), total_balls : 0, target_mines : 1, loadedRes : null,
        requested_draw_loc : -1, confirmed_draw : false, playlock : false, pickhistory : [], showInAnimation : true,
      }
    },
    methods : {
      init_ready () {

      }
    },
    mounted () {
      const that = this;
      that.$nextTick (() => {
        const domElement = document.querySelector ('#container');
        const initWidth = domElement.offsetWidth;
        const initHeight = domElement.offsetHeight;
        const el_stage = document.querySelector ('#stage');
        // const App = new MapLogic (initWidth, initHeight, el_stage);
        const loader = new LoaderScreen (that.$store);

        loader.onLoaded (function (_load, resources) {
          //     context_src.packedim.spritesheet.textures[""]
          //     setup areas
          //  console.log (resources);
          // that.renderer =

          // App.RemoveBanner (loader);
          // App.loadMap (resources);
          /// that.init_ready (renderer, App.stage, resources);
        });

        // App.AddItem (loader);
        loader.start (Assets);
      });


    }
  }
</script>

<style scoped>

</style>
