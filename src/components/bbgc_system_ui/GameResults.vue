<template>
  <div class="container_surivialcity">
    <div class="row">
      <div class="col col-12-of-12 center">BLOCK HISTORY</div>
    </div>
    <div class="row blockhash">
      <div class="col col-3-of-12">Block</div>
      <div class="col col-8-of-12">Hash</div>
      <div class="col col-1-of-12">N</div>
    </div>
    <div class="row blockhash smallsize" :key="nqc" v-for="(t, nqc) in dot_list.slice(0, 13)">
      <div class="col col-3-of-12">{{t.i}}</div>
      <div class="col col-8-of-12">{{get_hash_display_block_wide(t)}}</div>
      <div class="col col-1-of-12">{{t.d | fix6}}</div>
    </div>

    <div class="row">
      <nuxt-link class="bbg_login_back" to="#" @click.native="$emit('back')">
        <small>Return 返回</small>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  import StringFilter from "../../plugins/mixins/tools/string_tx"

  export default {
    name : "game-results",
    mixins : [StringFilter],
    data () {
      return { dot_list : [], time_refresh : 0 }
    },
    methods : {
      countTime () {
        const that = this;
        that.time_refresh = setInterval (() => {
          that.$store.dispatch ("survival/blockhistory_init");
        }, 10000);
      }
    },
    mounted () {
      const that = this;
      that.$store.subscribe ((mutations, state) => {
        const { game_history } = state.survival;
        that.dot_list = game_history;
      });
      that.$nextTick (() => {
        that.$store.dispatch ("survival/blockhistory_init");
        that.countTime ();
      });
    },
    beforeDestroy () {
      clearInterval (this.time_refresh)
    }
  }
</script>

<style scoped lang="scss">
  tbody.zhisto_dialog tr:hover {
    background-color: #0DFF92;
  }

  .smallsize {
    font-size: 10px;
  }

  .blockhash {
    .col {
      margin: 5px;
    }
  }
</style>
