<template>
  <section id="indexbox" class="container indexcolor">
    <div class="backee home">

    </div>
    <div class="flexhitem grid">
      <top-money-header ref="wallet_bar_module"/>
    </div>
    <!--<wallet-simple ref="wsc_wallet"/>-->
    <!--<bank-roll-list ref="bank_roll_list"/>-->

    <div class="wgrid">
      <div class="row">
        <field-bet ref="mine_bet_control">
          <div slot="content-play">
            <!-- <field-box ref="gamefield"/>-->
            <!-- <field-mine-core ref="mine_field"/>-->
            <field-mine-v1 ref="mine_field"/>
          </div>
        </field-bet>
      </div>
      <div class="row">
        <div class="col col-1-of-4 qbtnswitch" @click="exit_game">Exit</div>
        <div class="col col-1-of-3 qbtnswitch" @click="toggle_audio_switch"
             :class="sfx_enabled?'sound-enabled':'sound-disabled'">
          {{sfx_enabled?"🔉 AUDIO":"🔇 AUDIO"}}
        </div>
        <div class="col col-1-of-3 qbtnswitch" @click="toggleAutoBet">
          {{autobet?"AUTO ♻️":"AUTO ❎"}}
        </div>
      </div>
    </div>

  </section>
</template>

<script>
  import Bg_movingcity from "../components/background/bg_movingcity";
  import TopMoneyHeader from "../components/bigbang/TopMoneyHeader";
  import WalletSimple from "../components/bigbang/WalletSimple";
  import BankRollList from "../components/bigbang/BankRollList";
  import FieldBet from "../components/minefield/FieldBet";
  import FieldMineV1 from "../components/minefield/FieldMineV1";
  import { EventBus } from "../plugins/EventBus";
  import sfxMines from "../plugins/mixins/minesweep/miniGameMines"
  import sndbase from "../plugins/mixins/minesweep/audiobase"
  import StringFilter from '../plugins/mixins/tools/string_tx'

  export default {
    mixins : [sndbase, sfxMines, StringFilter],
    components : {
      FieldMineV1,
      FieldBet,
      BankRollList,
      WalletSimple,
      TopMoneyHeader,
      Bg_movingcity
    },
    name : "app_sexy_mine",
    methods : {
      exit_game () {
        this.$router.push ("/")
      },
      toggleAutoBet () {
        this.autobet = !this.autobet;
        this.SFxUIClick ();
      },
    },
    data () {
      return { autobet : false }
    },
    mounted () {
      const that = this;

      that.$nextTick (() => {
        const { mine_field, mine_bet_control } = that.$refs;
        //only offline play
        /*mine_bet_control.$on ("update_target_mines", (n) => {
          mine_field.SetTargetMines (n);
        });
        */
        mine_field.$on ("draws_reveal_complete", () => {
          mine_bet_control.setStatusReleased ();
        });
        EventBus.$on ("draw_result", (payload) => {
          const tr = String (payload.message);
          console.log ("draw_result -message: ", payload);
          that.$store.dispatch ("mines/drawUpdate", payload);
          //mine_bet_control.updatePayout();
          if (tr === "killed") {
            console.log ("draw_result killed");
            mine_field.showMonsters (payload.data.list);
          } else if (tr === "complete") {
            console.log ("draw_result complete");
            //mine_bet_control.setStatusReleased ();
            mine_field.saftyComplete ();
          } else if (tr === "draw") {
            console.log ("draw_result draw");
            mine_field.confirmSafe ();
          } else if (tr === "repeat") {
            console.log ("draw_result repeat");
            mine_field.confirmSafe ();
          } else {
            that.notificationError ("error code: " + payload.code + " and message:" + payload.message);
          }
        });
        EventBus.$on ("bet_result", (payload) => {
          if (payload.code > 1) {
            mine_bet_control.setStatusReleased ();
            that.notificationError ("error with code: " + payload.code);
          } else {
            mine_bet_control.setStatusConfirmStart ();
            mine_field.OnlineStart (5, 5);
            that.SfxGameStart ();
          }
        });
        mine_field.$on ("request_pick_draw", (payload) => {
          EventBus.$emit ("request_draw_step_monster_mine", payload);
        });
        mine_bet_control.$on ("now_play", (payload) => {
          EventBus.$emit ("request_start_game_monster_mine", payload);
          /**
           Only for offline

           mine_field.SetTargetMines (payload.level);
           mine_field.startGame (5, 5);
           */
        });
        EventBus.$on ("mine_game_init", (payload) => {
          console.log ("continue in here", payload);

          /*
                    mine_field.SetTargetMines (payload.level);
                    mine_field.startGame (5, 5);
          */

        })
      })
    }
  }
</script>
<style scoped>

</style>
