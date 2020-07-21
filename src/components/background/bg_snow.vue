<template>
  <canvas id="SnowFX"></canvas>
</template>
<script>
  import { Snow } from "../../plugins/three/assets/fx_flake";

  export default {
    name : "bg_snow",
    mounted () {

      let SnowFall = new Snow ("#SnowFX", {
        images : [
          "http://e-webdev.ru/assets/images/flakes/flake1.png",
          "http://e-webdev.ru/assets/images/flakes/flake2.png",
          "http://e-webdev.ru/assets/images/flakes/flake3.png",
          "http://e-webdev.ru/assets/images/flakes/flake4.png",
          "http://e-webdev.ru/assets/images/flakes/flake5.png",
          "http://e-webdev.ru/assets/images/flakes/flake6.png",
          "http://e-webdev.ru/assets/images/flakes/flake7.png"
        ]
      });
      SnowFall.start ();
    }
  }
</script>
<style lang="scss" scoped>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    background: #163651;
  }
</style>
