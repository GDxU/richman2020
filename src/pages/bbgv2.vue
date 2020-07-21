w<template>
  <section class="container_oke">
    <div class="backee">
      <!-- <bg_firework_v3 v-if="bg===0"/>-->
      <bg_ps3 v-if="bg===3"/>
      <bg_psx v-if="bg===1" :psx_title="current_round"/>
      <Bg_mountain_c v-if="bg===2" :air_title="current_round"/>
      <bg_snow v-if="bg===0"/>
    </div>
    <div class="flexhitem grid">
      <div class="flexhitem qbtnswitch onlynarrowscreen" @click="mobileDisplayBalance=true">
        Balance
      </div>
      <div class="flexhitem qbtnswitch onlynarrowscreen" @click="mobileDisplayBank=true">
        Bank Roll
      </div>
    </div>
    <div class="flexcontainx grid onlywidthscreen">
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
            <th>Impact</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="nqs" v-for="(t, nqs) in bank_rolls">
            <td>
              <a @click="useCurrency" :data-coin="t.s">{{t.s}}</a>
            </td>
            <td :ref="bankroll_label(t.s)">{{t.total | coinbalance}}</td>
            <td :ref="betroll_label(t.s)">{{t.folks}}</td>
            <td :ref="betroll_label(t.s)">{{parseFloat(t.locked) / parseFloat(t.total) | percentage}}</td>
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
    </div>
    <div class="flexcontainx grid">
      <div class="flexhitem flex-banner">
        <span class="bet_amount_basic">第{{current_round}}期</span><br>
        <span>{{status_text}}</span><br>
        <span class="ticker_display" :class="classes.additional_state">{{text_tick_timer}}</span><br>
        <span class="bet_amount_basic" :class="classes.bet_status">{{text_bet_display}}</span>
      </div>

      <div class="flexhitem flex-banner">
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x1">{{bet.x_1}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x2">{{bet.x_2}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x3">{{bet.x_3}}</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons"
           @click="button_x4">{{bet.x_4}}</a>
      </div>
      <div class="flexhitem flex-banner">
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons" @click="doubled">X2</a>
        <a class="btn-3d small gold ready_bet" :class="classes.all_bet_buttons" @click="half">/2</a>
      </div>
      <div class="flexhitem flex-banner">
        <a class="btn-3d small red ready_bet" :class="classes.all_bet_buttons" @click="betEnter">投注</a>
        <a class="btn-3d small green ready_bet" :class="classes.confirm_escape" @click="escapeEnter">偷跑</a>
      </div>
      <div class="flexhitem flex-banner">
        <span class="error" ref="notificationLablel"> {{message_notice}}</span>
      </div>
    </div>
    <div class="flexcontainx grid">
      <div class="flexhitem flex-banner control_face_cover">
        <table class="rblist table_proend tron">
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
      <div class="flexhitem qbtnswitch" @click="change_background">
        BG
      </div>
    </div>
    <simple-pop v-if="msgHistoryBox" window_mask="bbg_window_mask"
                class="windowed_table_x" window_background_class="bbg_long_info_window">
      <span slot="header" class="advertistment smaller">D History</span>
      <div slot="body">
        <table class="table_proend tron">
          <thead>
          <tr class="headline">
            <th class="columnA">Period</th>
            <th class="ch">Hash</th>
            <th class="columnB">D</th>
          </tr>
          </thead>
          <tbody ref="zhisto_dialog">
          <tr :key="nqc" v-for="(t, nqc) in dot_list.slice(0, 13)">
            <td class="columnA">{{t.i}}</td>
            <td class="ch">{{t.h}}</td>
            <td class="columnB">{{t.d | fix6}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </simple-pop>

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
  // import "vue2-timeago/dist/vue2-timeago.css"
  import TimeAgo from "vue2-timeago"
  import ArrayTools from "../plugins/mixins/mixinbb/bbArrayTool"
  import Operations from "../plugins/mixins/mixinbb/bbBetOperations"
  import MainGame from "../plugins/mixins/mixinbb/bbMain"
  import GameSFX from "../plugins/mixins/mixinbb/bbGameSFXBase"
  import GameClassic from "../plugins/mixins/mixinbb/bbGameSFXClassic"
  import ComputedVals from "../plugins/mixins/mixinbb/bbComputedValuables"
  import AnimationX from "../plugins/mixins/mixinbb/bbAnimation"
  import SimplePop from "../components/util/SimplePop";
  import Bg_psx from "../components/background/bg_psx";
  import Bg_ps3 from "../components/background/bg_ps3";
  import Bg_mountain_c from "../components/background/bg_mountain_c";
  import Bg_snow from "../components/background/bg_snow";
  import Bg_firework_v3 from "../components/background/bg_firework_V3";

  export default {
    mixins : [GameSFX, GameClassic, MainGame, AnimationX, ArrayTools, Operations, ComputedVals],
    components : {
      Bg_firework_v3,
      Bg_snow,
      Bg_mountain_c,
      Bg_ps3,
      TimeAgo,
      Bg_psx,
      SimplePop,
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
        bg : 0,
      }
    },
    methods : {
      change_background () {
        this.bg++;
        this.bg = this.bg % 4;
        this.SFxUIClick ();
      },
      status_display (m) {
        return "f-" + m;
      },
      status_div_span (m) {
        return m === 441 ? "✅" : (m === 443 ? "💹" : "❌");
      },
      redirec () {
        if (window !== undefined) {
          window.location = process.env.BASE_URL;
        }
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
    },
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
    font-size: 20px;
    line-height: 20px;
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

  @media(min-width: 510px) {

    .ticker_display {
      font-size: 2em;
      &.count_down_bet {
        font-size: 1.512em;
      }

    }

  }

  @media(max-width: 510px) {
    .ticker_display {
      font-size: 1.1em;
      &.count_down_bet {
        font-size: 0.982em;
      }
    }

  }


</style>
