<template>

  <div class="container_surivialcity">
    <div class="row">
      <div class="col col-12-of-12 center">How To Play</div>
    </div>
    <div class="row blockhash">
      <div class="col w-auto smallsize">
        Note: in Minesweeper mode, you need to click at least 7 times with 1 bomb, 5 times with 3 bombs, 3 times with 5
        bombs or once with 24 bombs in order to receive wager.
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
    name : "mine-game-instructions"
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
