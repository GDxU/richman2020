<template>
  <div class="flexhitem onlynarrowscreen">
    <div class="row qbtnh3">
      <div class="logoFont col col-2-of-4" @click="seeWallet">Wallet</div>
      <div class="c col col-1-of-4">
        <div class="row">
          <div class="f-441 col col-1-of-3 dicemargin"></div>
          <div class="col col-2-of-3 nomargin">{{text_bet_display}}</div>
        </div>
      </div>
      <div class="c col col-1-of-4">{{asset_display}}</div>
    </div>
    <div class="row qbtnh3">
      <div class="logoFont col col-2-of-3" @click="seeBankList">Bank Roll</div>
      <div class="col col-1-of-3" ref="header_bank_roll_display">
        <!-- <div class="row">
           <div class="f-441 col col-1-of-3 dicemargin"></div>
           <div class="col col-2-of-3 nomargin">{{asset_bank_display}}</div>
         </div>-->
        {{asset_bank_display}}
      </div>
    </div>
  </div>

</template>

<script>
  import AnimationX from "../../plugins/mixins/mixinbb/bbAnimation"
  import StringFilter from "../../plugins/mixins/tools/string_tx"

  export default {
    name : "top-money-header",
    mixins : [StringFilter, AnimationX],
    computed : {
      text_bet_display : {
        get () {
          return this.get_asset_display (this.bet_amount, this.bet_symbol);
        },
      },
      asset_bank_display : {
        get () {
          return this.get_asset_display (this.bank_roll.total - this.bank_roll.locked, this.bank_roll.s);
        }
      },
      asset_display : {
        get () {
          return this.get_asset_display (this.coin_asset.b, this.coin_asset.c)
        }
      }
    },
    methods : {
      seeBankList () {
        this.$emit ("lookinto_bank")
      },
      seeWallet () {
        this.$emit ("lookinto_wallet")
      },

      UpdateWalletAsset (coinAssetPacket) {
        if (coinAssetPacket.hasOwnProperty (this.bet_symbol)) {
          this.coin_asset = coinAssetPacket[this.bet_symbol];
        }
      },
      UpdateWalletAssetList (list) {
        this.wallet_list = list;
        if (this.wallet_list.hasOwnProperty (this.bet_symbol)) {
          this.coin_asset = this.wallet_list[this.bet_symbol];
        }
      },
      UpdateCoinAsset (v) {
        v.forEach ((d, i, c) => {
          if (this.equal_assets (d.s, this.bet_symbol)) {
            this.bank_roll = d;
            //  window.console.log ("UpdateCoinAsset", d);
          }
        });
      },
      UpdatePotCoinInfo (v) {
        //  window.console.log ("UpdatePotCoinInfo", v);
        if (this.equal_assets (v.coin, this.bet_symbol)) {

        }
      },
      UpdateBankInfo (v) {
        /**      {s,total,locked,folks} **/
        this.bank_roll = v;
        // this.$emit ("update_coin_info", v);
      },
      UpdateBet (amount) {
        this.bet_amount = amount;
      },
      CoinUse (coin) {
        this.bet_symbol = coin;
        if (this.wallet_list.hasOwnProperty (coin)) {
          this.coin_asset = this.wallet_list[coin];
        }
      },

    },
    data () {
      return {
        my_wallet : 0,
        bet_amount : 0,
        bet_symbol : "---",
        bet_list : [],
        wallet_list : {},
        bank_roll : {},
        coin_asset : {},
      }
    },
    mounted () {
      const that = this;
      this.$nextTick (() => {

        that.$on ("update_coin_info", ({ gain, coin }) => {
          if (String (coin).toLowerCase () === String (that.bet_symbol).toLowerCase ()) {
            that.pot_update_top_header_ (coin, gain);
          }
          // window.console.log ("update_coin_info", gain, coin);
        });
        that.UpdateWalletAssetList (that.$store.state.survival.profile_wallet);
      });
    }
  }
</script>

<style lang="scss" scoped>
  /* font-family: "Playstation3";*/

  .logoFont {
    font-family: "Playstation3";
  }

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
    /*  div:hover {
        display: block;
        background: -webkit-gradient(linear, left top, left bottom, from(#b0d8f6), to(#325c64));
      }*/

  }

  .nomargin {
    margin: 0px;
    margin-left: 25px;
  }

  .dicemargin {
    position: absolute;
    top: 5px;
    width: 20px;
  }
</style>
