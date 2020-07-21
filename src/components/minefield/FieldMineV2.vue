<template>
  <section>
    <pixi-renderer
      @tick="update"
      :backgroundColor="0x0078FF"
      :height="600"
      :width="600">
      <pixi-container
        :x="320" :y="240"
        :rotation="-t / 40">
        <pixi-sprite v-for="(sprite, key) in sprites" :key="key"
                     src="mmines/imgs/dice.png"
                     :x="sprite.x" :y="sprite.y"
                     :scaleX="sprite.scale" :scaleY="sprite.scale"
                     :anchorX="0.5" :anchorY="0.5"
                     :rotation="sprite.angle + t / 60"/>
      </pixi-container>
    </pixi-renderer>
  </section>
</template>

<script>
  import PixiRenderer from "vue-pixi-onode/src/components/Renderer"
  import PixiContainer from "vue-pixi-onode/src/components/Container"
  import PixiSprite from "vue-pixi-onode/src/components/Sprite"

  export default {
    name : "field-mine-core",
    components : { PixiRenderer, PixiContainer, PixiSprite },
    data () {
      return { t : 0, sprites : [] }
    },
    methods : {
      addSprite () {
        this.sprites.push ({
          x : 640 * (0.5 - Math.random ()),
          y : 480 * (0.5 - Math.random ()),
          angle : 2 * Math.PI * Math.random (),
          scale : 0.25 + 0.5 * Math.random (),
        })
      },
      update (dt) {
        this.t += dt
      }
    },
    created () {
      this.addSprite ()
      this.addSprite ()
      this.addSprite ()
    }

  }
</script>

<style scoped>

</style>
