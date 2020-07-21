<template>
  <section class="container_oke">
    <div class="backee purx">
      <Tunnnel
        ref="tunnelx"
        :track_series="tracks[2]"
        :mode="1"
        :debug="false"
      />
    </div>
    <div class="flexhitem grid">
      <div class="flexhitem qbtnswitch" @click="mobileDisplayBalance=true">
        Balance
      </div>
      <div class="flexhitem qbtnswitch" @click="mobileDisplayBank=true">
        Bank Roll
      </div>
    </div>
    <!--    <div class="flexcontainx grid onlywidthscreen">
       <div class="flexhitem onlywidthscreen">
           <table class="table_proend tron">
               <thead>
               <tr class="headline">
                   <th>符号</th>
                   <th>资产</th>
               </tr>
               </thead>
               <tbody>
               <tr :key="nbx" v-for="(t, nbx) in user_wallets">
                   <td><a @click="useCurrency" :data-coin="t.c">{{t.c|coinName}}</a></td>
                   <td :ref="wallet_label(t.c)">{{(t.b) | coinbalance}}</td>
               </tr>
               </tbody>
           </table>
       </div>
    <div class="flexhitem onlywidthscreen">
           <table class="table_proend tron">
               <thead>
               <tr class="headline">
                   <th>符号</th>
                   <th>盆资产</th>
                   <th>Game Bets</th>
               </tr>
               </thead>
               <tbody>
               <tr :key="nqs" v-for="(t, nqs) in bank_rolls">
                   <td>
                       <a @click="useCurrency" :data-coin="t.s">{{t.s}}</a>
                   </td>
                   <td :ref="bankroll_label(t.s)">{{t.total | coinbalance}}</td>
                   <td :ref="betroll_label(t.s)">{{t.folks}}</td>
               </tr>
               </tbody>
           </table>
       </div>
       <div class="flexhitem onlywidthscreen">
           <table class="table_proend tron">
               <thead>
               <tr class="headline">
                   <th>期</th>
                   <th>D</th>
               </tr>
               </thead>
               <tbody ref="zhistory">
               <tr :key="nqx" v-for="(t, nqx) in dot_list.slice(0, 5)">
                   <td>{{t.i}}</td>
                   <td>{{t.d | fix6}}</td>
               </tr>
               </tbody>
           </table>
       </div>
   </div>-->
    <div class="flexcontainx grid">
      <div class="flexhitem flex-banner jiangchi">
        <span class="bet_amount_basic">第{{current_round}}期</span><br>
        <span class="ticker_display" :class="classes.additional_state">{{text_tick_timer}}</span><br>
        <span class="bet_amount_basic" :class="classes.bet_status">{{text_bet_display}}</span><br>
      </div>

      <div class="flexhitem flex-banner middle_msg">
        <span ref="status_text_display">{{status_text}}</span>
      </div>

      <div class="flexhitem flex-banner control_alpha_set" :class="classes.all_bet_buttons">
        <a class="bet_icon_x" :class="classes.all_bet_buttons"
           @click="button_x1">{{bet.x_1|bet_n}}</a>
        <a class="bet_icon_x" :class="classes.all_bet_buttons"
           @click="button_x2">{{bet.x_2|bet_n}}</a>
        <a class="bet_icon_x" :class="classes.all_bet_buttons"
           @click="button_x3">{{bet.x_3|bet_n}}</a>
        <a class="bet_icon_x" :class="classes.all_bet_buttons"
           @click="button_x4">{{bet.x_4|bet_n}}</a>
      </div>
      <div class="flexhitem flex-banner control_alpha_set" :class="classes.all_bet_buttons">
        <a class="bet_icon_f" :class="classes.all_bet_buttons" @click="doubled">X2</a>
        <a class="bet_icon_f" :class="classes.all_bet_buttons" @click="half">/2</a>
      </div>
      <div class="flexhitem flex-banner">
        <a class="bet_run_red ready_bet" :class="classes.all_bet_buttons" @click="betEnter"><span>投注</span></a>
        <a class="bet_run_blue ready_bet" :class="classes.confirm_escape"
           @click="escapeEnter"><span>偷跑</span></a>
      </div>
      <div class="flexhitem flex-banner">
        <span class="error" ref="notificationLablel"> {{message_notice}}</span>
      </div>
    </div>
    <div class="flexcontainx grid">
      <div class="flexhitem flex-banner bbg_bet_customer_board">
        <table class="rblist tron">
          <thead>
          <tr class="headline">
            <th>ID</th>
            <th>User</th>
            <th>Bet</th>
            <th>Status</th>
            <th>Profit</th>
            <th>Time</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="ncxv" v-for="(t, ncxv) in users_list.slice(0, 90)">
            <td>{{t.i}}</td>
            <td>{{t.j}}</td>
            <td>{{t.c | coinName}} {{t.b}}</td>
            <td class="st_ico">
              <div class="box_icon_status" :class="status_display(t.s)"></div>
            </td>
            <td class="profit">{{(t.e - t.b) | changeprofit}}</td>
            <td>
              <time-ago :datetime="t.t" :refresh="10"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flexcontainx grid">
      <div class="flexhitem qbtnswitch" @click="exit_game">Exit</div>
      <div class="flexhitem qbtnswitch" @click="toggleMusic"
           :class="sfx_enabled?'sound-enabled':'sound-disabled'">
        {{sfx_enabled?'🔉 NO':'🔇 OFF'}}
      </div>
      <div class="flexhitem qbtnswitch" @click="toggleAutoBet">
        {{bet.autobet?'AUTO NO':'AUTO OFF'}}
      </div>
      <div class="flexhitem qbtnswitch" @click="toggleFlash">
        {{animations.flash?'Anim NO':'Anim OFF'}}
      </div>
    </div>

    <!--   <simple-pop v-if="msgHistoryBox" window_mask="bbg_window_mask" class="windowed_table_x"
                   window_background_class="bbg_long_info_window">
           <span slot="header" class="advertistment smaller">History</span>
           <div slot="body">
               &lt;!&ndash;<statsboxhistory ref="statsbox"/>&ndash;&gt;
           </div>
       </simple-pop>-->
    <!--

            <statsboxhistory ref="statsbox"/>
    -->


    <simple-pop v-if="mobileDisplayBalance" window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
      <span slot="header" class="advertistment">Balance</span>
      <div slot="body" @click="mobileDisplayBalance=false">
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
    </simple-pop>

    <simple-pop v-if="mobileDisplayBank" window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
      <span slot="header" class="advertistment">Bank</span>
      <div slot="body">
        <table class="table_proend tron">
          <tr class="headline">
            <th>Symbol</th>
            <th>Balance</th>
            <th>Game Bets</th>
            <th>Impact</th>
          </tr>
          <tr :key="nqs" v-for="(t, nqs) in bank_rolls">
            <td>
              <a @click="useCurrency" :data-coin="t.s">{{t.s}}</a>
            </td>
            <td :ref="bankroll_label(t.s)">{{t.total | coinbalance}}</td>
            <td :ref="betroll_label(t.s)">{{t.folks}}</td>
            <td :ref="betroll_label(t.s)">{{parseFloat(t.locked) / parseFloat(t.total) | percentage}}</td>
          </tr>
        </table>
      </div>
      <div slot="window_footer">
        <div class="bg-c0" @click="mobileDisplayBank=false"></div>
      </div>
    </simple-pop>
    <!-- v-if="msgGameWait"  -->
    <simple-pop v-if="msgGameWait" window_mask="bbg_window_mask" window_background_class="bbg_waiting_window">
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
    </simple-pop>

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
<script>
  import TimeAgo from "vue2-timeago"
  import ArrayTools from '../plugins/mixins/mixinbb/bbArrayTool'
  import Operations from '../plugins/mixins/mixinbb/bbBetOperations'
  import MainGame from '../plugins/mixins/mixinbb/bbMain'
  import GameSFX from '../plugins/mixins/mixinbb/bbGameSFXBase'
  import GameGundamSound from '../plugins/mixins/mixinbb/bbGameSFXGundam'
  import ComputedVals from '../plugins/mixins/mixinbb/bbAnimation'
  import AnimationX from '../plugins/mixins/mixinbb/bbComputedValuables'
  import SimplePop from "../components/util/SimplePop";
  import Tunnnel from "../components/background/bg_kgbtunnel";
  import { track_a, track_b, track_c, track_d } from '../plugins/three/assets/tracks';
  import Statsboxhistory from "../components/bigbang/statsboxhistory";

  export default {
    mixins : [GameSFX, GameGundamSound, MainGame, AnimationX, ArrayTools, Operations, ComputedVals],
    components : {
      Statsboxhistory,
      TimeAgo,
      Tunnnel,
      SimplePop,
    },
    computed : {
      fighter_kx () {
        return "";
      }
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
        currencies : ["thpc", "eth", "bbr"],
        buttonExtras : [],
        tracks : [track_c, track_d, track_b, track_a],
        stats_box : null,
      }
    },
    methods : {
      afterTicker (a, seed) {
        // if (this.tunnel_animation != undefined) {
        this.tunnel_animation.pushFactor (a, seed);
        // }
      },
      status_display (m) {
        return 'f-' + m;
      },
      status_div_span (m) {
        return m === 441 ? "✅" : (m === 443 ? "💹" : "❌");
      },
      redirec () {
        if (window !== undefined) {
          window.location = process.env.BASE_URL;
        }
      },
      after_confirm () {
        // this.msgErrorBox = false;
        // EventBus.$emit ("submit_lotto_ticket_exec", this.bet_confirmation_bill);
        // this.playNewTicket ();
      },
      wallet_label (coin_name) {
        return "coin_" + String (coin_name).toLowerCase ();
      },
      bankroll_label (coin_name) {
        return "bankroll_" + String (coin_name).toLowerCase ();
      },
      betroll_label (coin_name) {
        return "betctrl_" + String (coin_name).toLowerCase ();
      },
      dot_list_label (t) {
        return "dot_a_" + t.i;
      },
      /**
       * implementations
       */
      eventClearChart () {
        //   if (this.tunnel_animation != undefined) {
        this.tunnel_animation.clearData ();
        //   }
      },
      eventKillChart () {
        //    if (this.tunnel_animation != undefined) {
        this.tunnel_animation.kill ();
        //  }
      },
      eventStartChart () {
        // if (this.tunnel_animation != undefined) {
        this.tunnel_animation.startJump (this.bet.status);
        //   }
      },
      eventUpdateState (x, json) {
        this.tunnel_animation.updateState (x);
        const { status_text_display } = this.$refs;
        if (x === 100) {
          if (this.bet.status) {
            this.classes.additional_state = "count_active";
          } else {
            this.classes.additional_state = "count_disabled";
          }
          this.fadeOutText (status_text_display);
        }
        if (x === 101) {
          this.fadeInInstantText (status_text_display);
        }
        if (x === 120) {
          /*

                              const {
                                  tunnelx,
                                  statsbox,
                              } = this.$refs;

                              console.log ("stats box", statsbox);
                              if (statsbox) {
                                  statsbox.update_chart ();
                              }*/


        }
      },
    },
    mounted () {
      const that = this;
      this.$nextTick (() => {
        const {
          tunnelx,
          statsbox,
        } = that.$refs;

        //  if (tunnelx != undefined) {
        that.tunnel_animation = tunnelx;
        that.stats_box = statsbox;
        //}
      })
    }
  }
</script>
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
    line-height: 15px;
    display: inline-block;
  }

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
    // font-family: "Starworld";
    font-family: "Prida";
    &.warned {
      color: #f84441;
      text-shadow: #e2664f 0px 0px 15px, #bc4532 0px 0px 45px;
    }
    &.ready {
      color: #b3f8bc;
      text-shadow: #39a465 0px 0px 15px, #1d5334 0px 0px 45px;
    }
    &.count_down_bet {

    }
    /*   &.count_disabled {

       }*/
    &.deepblue {
      color: #6fd4ff;
      text-shadow: #327ab7 0px 0px 15px, #1d4669 0px 0px 45px;
    }
  }

  .control_alpha_set {
    //  transform: translate3d(0, $btn-box-height + 1, 0);
    // -webkit-transform: translate3d(0, $btn-box-height + 1, 0);
    opacity: 1.0;
    margin-bottom: 50px;
    &.disabled {
      opacity: 0.0;
      cursor: default;
    }
  }

  .middle_msg {
    margin-bottom: 100px;
  }

  @media(min-width: 510px) {
    .ticker_display {
      font-size: 0.9em;
      &.count_disabled {
        font-size: 0.9em;
      }
      &.count_active {
        font-size: 2em;
      }
    }
  }

  @media(max-width: 510px) {
    .ticker_display {
      font-size: 0.8em;
    }
  }
</style>
