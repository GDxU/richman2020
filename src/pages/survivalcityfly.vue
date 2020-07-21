<template>
  <section class="container_surivialcity">
    <div class="backee">
      <bg_movingcity ref="city_move" @LAUNCH="UFO_EFFEC"/>
    </div>
    <div class="flexhitem grid">
      <top-money-header ref="wallet_bar_module"/>
    </div>
    <div class="flexcontainx grid">
      <bank-roll-list ref="bank_roll_list" hover="#00b236" hover_color="#b3ffa5"/>
      <wallet-simple ref="wsc_wallet"/>
    </div>
    <div class="flexcontainx grid bet_display_wrapper">
      <div class="flexhitem flex-banner">
        <span class="bet_amount_basic">第{{current_round}}期</span><br>
        <span>{{status_text}}</span><br>
        <span class="ticker_display" :class="classes.additional_state">{{text_tick_timer}}</span><br>
        <span class="bet_amount_basic" :class="classes.bet_status">{{text_bet_display}}</span>
      </div>

      <div class="flexhitem flex-banner bet_selections" :class="classes.bet_status">
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x1">{{bet.x_1}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x2">{{bet.x_2}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x3">{{bet.x_3}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x4">{{bet.x_4}}</a>
      </div>

      <div class="flexhitem flex-banner bet_projections" :class="classes.bet_status">
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons" @click="doubled">X2</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons" @click="half">/2</a>
      </div>
      <div class="flexhitem flex-banner">
        <a class="btn-3d small red ready_bet" :class="classes.all_bet_buttons" @click="betEnter">GUESS</a>
        <a class="btn-3d small green ready_bet" :class="classes.confirm_escape" @click="escapeEnter">EXPLODE</a>
      </div>
    </div>

    <player-list/>

    <div class="flexcontainx grid">
      <div class="flexhitem qbtnswitch" @click="exit_game">Exit</div>
      <div class="flexhitem qbtnswitch" @click="toggleMusic"
           :class="sfx_enabled?'sound-enabled':'sound-disabled'">
        {{sfx_enabled?"🔉 AUDIO":"🔇 AUDIO"}}
      </div>
      <div class="flexhitem qbtnswitch" @click="toggleAutoBet">
        {{bet.autobet?"AUTO ♻️":"AUTO ❎"}}
      </div>
      <div class="flexhitem qbtnswitch" @click="change_background">
        BG
      </div>
    </div>

    <pop-block-history v-if="msgHistoryBox"/>

    <simple-pop v-if="mobileDisplayBalance" window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
      <span slot="header" class="advertistment">Balance</span>
      <div slot="body">
        <table class="table_proend tron">
          <tr class="headline">
            <th>Coin Name</th>
            <th>Balance</th>
          </tr>
          <tr :key="nbx" v-for="(t, nbx) in user_wallets">
            <td><a @click="useCurrency" :data-coin="t.c">{{t.c|coinName}}</a></td>
            <td :ref="wallet_label(t.c)">{{(t.b) | coinbalance}}</td>
          </tr>
        </table>
      </div>
      <div slot="window_footer">
        <div class="bg-c0" @click="mobileDisplayBalance=false"></div>
      </div>
    </simple-pop>

    <simple-pop v-if="mobileDisplayBank"
                window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
      <span slot="header" class="advertistment">Bank</span>
      <div slot="body">
        <table class="table_proend tron">
          <tr class="headline">
            <th>Symbol</th>
            <th>Balance</th>
            <th>Game Bets</th>
            <!-- <th>Impact</th>-->
          </tr>
          <tr :key="nqs" v-for="(t, nqs) in bank_rolls">
            <td>
              <a @click="useCurrency" :data-coin="t.s">{{t.s}}</a>
            </td>
            <td :ref="bankroll_label(t.s)">{{t.total | coinbalance}}</td>
            <td :ref="betroll_label(t.s)">{{t.folks}}</td>
            <!--  <td :ref="betroll_label(t.s)">{{parseFloat(t.locked) / parseFloat(t.total) | percentage}}</td>-->
          </tr>
        </table>
      </div>
      <div slot="window_footer">
        <div class="bg-c0" @click="mobileDisplayBank=false"></div>
      </div>
    </simple-pop>
    <!-- v-if="msgGameWait"  -->

    <!--<simple-pop  window_mask="bbg_window_mask" window_background_class="bbg_waiting_window">
      <h3 slot="header">Ready? {{user_name}}</h3>
      <div slot="body">
        🚥 请准备好, 稍等一会<br>
        <small>{{status_text}}...</small>
      </div>
      <div slot="footer">
        <div class="qbtnswitch" @click="toggleMusic" :class="sfx_enabled?'sound-enabled':'sound-disabled'">
          {{sfx_enabled?'🔉 NO':'🔇 OFF'}}
        </div>
        <div class="qbtnswitch" @click="toggleAutoBet">
          {{bet.autobet?'AUTO BET NO':'AUTO BET OFF'}}
        </div>
        <div class="qbtnswitch" @click="exit_game">
          EXIT
        </div>
      </div>
    </simple-pop>-->

    <!--<simple-pop v-if="msgErrorBox">-->
    <simple-pop v-if="msgErrorBox" window_mask="bbg_window_mask" window_background_class="bbg_warning_window">
      <h3 slot="header">Error</h3>
      <div slot="body">
        {{message_notice}}
      </div>
      <div slot="footer">
        <a href="/" @click="redirec">
          <p>Logout</p>
        </a>
      </div>
    </simple-pop>
  </section>
</template>

<style lang="scss" scoped>
  // $btnxxsize: 44px;
  $green: #d8ffef;
  $blue: #adebf2;
  $purple: #93648D;
  $black: #34495e;
  $red: #ff6666;

  .error {
    color: $red;
    font-size: 10px;
  }

  .bet_amount_basic {
    font-size: 15px;
    line-height: 20px;
    display: inline-block;
    text-shadow: #7dff74 -0.7px 1.7px 1.1em;
  }

  /**
      bet status
   */
  .bet_success {
    color: $green;
    text-shadow: #7dff74 -0.7px 1.7px 1.1em;
  }

  .bet_progress {
    color: $blue;
  }

  .bet_failure {
    color: $black;
  }

  .headline {
    height: 40px;
  }

  .sound-enabled {

  }

  .sound-disabled {

  }

  .box_icon_status {
    display: block;
  }

  .st_ico {
    text-align: center;
  }

  .ticker_display {
    font-family: "Starworld";
    // font-family: "Prida";
    &.warned {
      color: #f84441;
      text-shadow: #e2664f 0px 0px 15px, #bc4532 0px 0px 45px;
    }
    &.ready {
      color: #b3f8bc;
      text-shadow: #39a465 0px 0px 15px, #1d5334 0px 0px 45px;
    }
    &.count_down_bet {
      font-family: "Prida";
    }
    &.deepblue {
      color: #6fd4ff;
      text-shadow: #327ab7 0px 0px 15px, #1d4669 0px 0px 45px;
    }
  }

  .bet_selections {
    &.bet_success {
      opacity: 0.0;
    }
    &.bet_failure {
      opacity: 0.1;
    }
  }

  .bet_projections {
    &.bet_success {
      opacity: 0.0;
    }
    &.bet_failure {
      opacity: 0.1;
    }
  }

  @media(min-width: 510px) {
    .ticker_display {
      font-size: 1.43em;
      &.count_down_bet {
        font-size: 1.21em;
      }
    }
  }

  @media(max-width: 510px) {
    .ticker_display {
      font-size: 1.0em;
      &.count_down_bet {
        font-size: 0.982em;
      }
    }
    .bet_display_wrapper {
      padding-top: 0;
    }
  }


</style>
<script>
  //  import "vue2-timeago/dist/vue2-timeago.css"
  import TimeAgo from "vue2-timeago"
  import ArrayTools from "../plugins/mixins/mixinbb/bbArrayTool"
  import Operations from "../plugins/mixins/mixinbb/bbBetOperations"
  import MainGame from "../plugins/mixins/mixinbb/bbMain"
  import StringFilter from "../plugins/mixins/tools/string_tx"
  import GameSFXBase from "../plugins/mixins/mixinbb/bbGameSFXBase"
  import TickerHeart from "../plugins/mixins/mixinbb/bbTickerHeart"
  import ComputedVals from "../plugins/mixins/mixinbb/bbComputedValuables"
  import AnimationX from "../plugins/mixins/mixinbb/bbAnimation"
  import CityFly from "../plugins/mixins/mixinbb/bbGameSFXCityFly"
  import SimplePop from "../components/util/SimplePop";
  import Bg_firework_v3 from "../components/background/bg_firework_V3";
  import WalletSimple from "../components/bigbang/WalletSimple";
  import BankRollList from "../components/bigbang/BankRollList";
  import PopBlockHistory from "../components/bigbang/PopBlockHistory";
  import PlayerList from "../components/bigbang/PlayerList";
  import TopMoneyHeader from "../components/bigbang/TopMoneyHeader";
  import TopBankBar from "../components/bigbang/TopBankBar";
  import Bg_movingcity from "../components/background/bg_movingcity";

  export default {
    mixins : [GameSFXBase, CityFly, MainGame, AnimationX, ArrayTools, TickerHeart, Operations, ComputedVals, StringFilter],
    components : {
      Bg_movingcity,
      TopBankBar,
      TopMoneyHeader,
      PlayerList,
      BankRollList,
      WalletSimple,
      Bg_firework_v3,
      TimeAgo,
      SimplePop,
      PopBlockHistory,
    },
    data () {
      return {
        mobileDisplayBalance : false,
        mobileDisplayBank : false,
        msgHistoryBox : false,
        msgErrorBox : false,
        msgGameWait : true,
        status_text : "",
        message_notice : "",
        update_status : -1,
        classes : {
          confirm_escape : "disabled",
          confirm_bet : "disabled",
          all_bet_buttons : "disabled",
          bet_status : "bet_progress",
          additional_state : "",
        },
        clock : 0,
        countdownclock : 0,
        buttonExtras : [],
        currencies : [],
        bg : 0,
      }
    },
    methods : {
      change_background () {
        //this.bg++;
        //this.bg = this.bg % 5;
        //this.SFxUIClick ();
      },
      status_div_span (m) {
        return m === 441 ? "✅" : (m === 443 ? "💹" : "❌");
      },
      redirec () {
        if (window !== undefined) {
          window.location = process.env.BASE_URL;
        }
      },
    },
    mounted () {
      const that = this;
      that.$nextTick (() => {
        const {
          wsc_wallet,
          bank_roll_list,
          wallet_bar_module,
          city_move,
        } = that.$refs;
        wallet_bar_module.$on ("lookinto_wallet", () => {
          that.mobileDisplayBalance = true
        });
        wallet_bar_module.$on ("lookinto_bank", () => {
          that.mobileDisplayBank = true
        });
        bank_roll_list.$on ("selection_coin", (coin) => {
          that.CoinUse (coin);
          that.notificationInfo ("Switched to " + coin.toUpperCase ());
          that.SFxClick ();
        });
        wsc_wallet.$on ("selection_coin", (coin) => {
          that.CoinUse (coin);
          that.notificationInfo ("Switched to " + coin.toUpperCase ());
          that.SFxClick ();
        });
        that.$on ("selection_coin", (coin) => {
          that.CoinUse (coin);
          wallet_bar_module.CoinUse (coin);
          that.SelectCoinToDisplayBankInfo (coin, (bank) => {
            wallet_bar_module.UpdateBankInfo (bank);
          })
        });
        that.$on ("update_bet_enter", ({ Amount }) => {
          wallet_bar_module.UpdateBet (Amount);
          // wallet_bar_module.CoinUse (coin);
        });
        that.$on ("bb_escape", () => {
          that.SFxESC ();
        });
        that.$on ("event_bet_start", (state_n) => {
          that.status_text = "现已公开 💵";
        });
        that.$on ("event_close_bet", (state_n) => {
          that.status_text = "NO MORE GUESS";
        });
        that.$on ("event_game_start", (state_n) => {
          that.status_text = "-SKY FLY-";
        });
        that.$on ("event_explode", (state_n) => {
          city_move.MoveExplode ();
          that.status_text = that.randomGameOverText ();
        });
        that.$on ("event_show_result", (state_n) => {
          that.status_text = "游戏结果";
        });
        that.$on ("ticker_emit", ({ tick }) => {
          city_move.MoveSpeed (tick);
        });
        that.$on ("subscribe_state", ({ type, state }) => {
          // console.log ("sub ", state);
          const { profile_wallet, pots, players, update_pot_info } = state;
          switch (type) {
            case "survival/user_wallet_renew":
              wsc_wallet.UpdateList (profile_wallet);
              wallet_bar_module.UpdateWalletAsset (profile_wallet);
              break;
            case "survival/player_update":
              bank_roll_list.PlayerUpdate (players);
              break;
            case "survival/pot_ls_update":
              bank_roll_list.UpdateList (pots);
              break;
            case "survival/pot_update":
              bank_roll_list.UpdateList (pots);
              bank_roll_list.UpdateCoinInfo (update_pot_info);
              wallet_bar_module.UpdateCoinAsset (pots);
              wallet_bar_module.UpdatePotCoinInfo (update_pot_info);
              break;
          }
        });
      })

      that.$store.subscribe ((mutations, state) => {
        //  const { profile_wallet, pots, players, update_pot_info } = state.survival;
        that.$emit ("subscribe_state", {
          type : mutations.type,
          state : state.survival,
        });
      })
    },
    destroyed () {
      const that = this;
      const {
        wsc_wallet,
        bank_roll_list
      } = that.$refs;

      // bank_roll_list.$off ("selection_coin");
      // wsc_wallet.$off ("selection_coin");

    }
  }
</script>

