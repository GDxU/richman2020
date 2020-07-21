<template>
  <div class="container_surivialcity">
    <div class="row">
      <div class="col col-12-of-12 center">How To Play</div>
    </div>
    <div class="row blockhash">
      <div class="col w-auto smallsize">
        There is a 15 second duration before the game started. When after the fleet started flying, the speed will
        increase from 1.00000X and it will get faster with the bigger digit. You can “Escape” and lock down the current
        speed at anytime during the flight. Your earning will be the current amount x Escape speed. When the later you
        escape from the ship the higher the earning will you receive.

        Caveat: The fleet will breakdown or will be destroyed anytime before the “Escape” taken place and your quiz fund
        can be a total loss.
      </div>
    </div>
    <div class="row">
      <div class="col col-12-of-12 center">Where to get coin</div>
    </div>
    <div class="row blockhash">
      <div class="col w-auto smallsize">
       The player can login the bigbang game platform and make deposit of the token BBGC, HT, ZB, OKB, ETH, GTS and the supported tokens. The player can obtain the tokens from the exchange platforms. HOTBIT.io, FCOIN.com, EXX.com, and ZBG.com.
      </div>
    </div>
    <div class="row">
      <nuxt-link class="bbg_login_back" to="#" @click.native="$emit('back')">
        <small>Return 返回</small>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    name : "instructions.vue"
  }
</script>

<style scoped lang="scss">

  .smallsize {
    font-size: 10px;
  }

  .blockhash {
  .col {
    margin: 5px;
  }
  }
</style>
