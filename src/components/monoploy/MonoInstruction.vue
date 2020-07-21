<template>

  <div class="container_surivialcity">
    <div class="row">
      <div class="col col-12-of-12 center">How To Play</div>
    </div>
    <div class="row blockhash">
      <div class="col w-auto smallsize">
        You will need to make your way out of the game and becoming the richman in the game. All members go bankrupes
        and you are the only one who survived.
      </div>
    </div>
    <div class="row">
      <div class="col col-12-of-12 center">Where to get coin</div>
    </div>
    <div class="row blockhash">
      <div class="col w-auto smallsize">
        The player can login the bigbang game platform and make deposit of the token BBGC, HT, ZB, OKB, ETH, GTS and the
        supported tokens. The player can obtain the tokens from the exchange platforms. HOTBIT.io, FCOIN.com, EXX.com,
        and ZBG.com.
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
    name : "mono-game-instructions"
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
