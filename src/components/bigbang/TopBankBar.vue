<template>
  <div class="flexhitem qbtnswitch onlynarrowscreen">
    <div class="row">
      <div class="banklist col col-2-of-3" @click="seeBankList">Bank Roll</div>
      <div class="c col col-1-of-3">{{asset_display}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name : "top-bank-bar",
    methods : {
      seeBankList () {
        this.$emit ("lookinto_bank")
      },
      update (coinAsset) {
        this.asset_display = getAsset (coinAsset.b, coinAsset.c);
      }
    },
    data () {
      return {
        bet_amount : 0,
        bet_symbol : "---",
        asset_display : "---",
        bet_list : [],
      }
    },
  }
</script>

<style scoped lang="scss">


  .qbtnh3 {
    flex-wrap: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 32px;
    cursor: pointer;
    background: -webkit-gradient(linear, left top, left bottom, from(#2c3b51), to(#325c64));
    background: linear-gradient(to bottom, #2c3b51 0%, #325c64 100%);
    color: #a3ebf8 !important;
    line-height: 10px;
    vertical-align: middle;
    border: 1px #71a3ac solid;
    font-size: 6px !important;
    padding-left: 5px;
    padding-right: 5px;
  }

  .banklist {
    font-family: "Playstation3";
  }

</style>
