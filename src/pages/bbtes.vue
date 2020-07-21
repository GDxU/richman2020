<template>
  <section class="container_oke">
    <div class="backee purx">
      <Tunnnel
        ref="xtunne"
        fighter_name="Tempest"
        :track_series="track"
        :debug="true"
        :mode="0"
      />
    </div>
  </section>
</template>
<script>
  import Tunnnel from "../components/background/bg_kgbtunnel";
  import { track_a, track_b, track_c, track_d } from '../plugins/three/assets/tracks';

  export default {
    name : "bbtes",
    components : {
      Tunnnel,
    },
    data () {
      return {
        track : track_b,
      }
    }
  }
</script>

<style scoped>

</style>
