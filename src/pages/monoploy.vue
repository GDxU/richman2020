<template>
  <section id="indexbox" class="indexcolor">
    <div class="backee lightgrass interactive">
      <bg_game ref="main_canvas_game"/>
    </div>
    <div class="box"></div>
    <div class="footer grid_interactive is-sticky">
      <div class="flexhitem grid">
        <div class="flex-row row">
          <div class="col col-1-of-4 qbtnswitch" @click="exit_game">Exit</div>
          <div class="col col-1-of-4 qbtnswitch"
               @click="toggle_audio_switch"
               :class="sfx_enabled?'sound-enabled':'sound-disabled'">
            {{sfx_enabled?"🔉 AUDIO":"🔇 AUDIO"}}
          </div>
          <div class="col col-1-of-4 qbtnswitch" @click="playDice">
            {{autobet?"DICE AUTO":"DICE"}}
          </div>
          <div class="col col-1-of-8 result">
            <div :class="result_dice_class">
              {{result_dice}}
            </div>
          </div>
          <div class="col col-1-of-4 cryptos">
            <div class="human_play">
              BTC {{cash_online}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ui_popup ref="startDialog"/>
    <ui-pass-event ref="passEvt"/>
    <ui-stop-event ref="stopEvt"/>
  </section>
</template>
<style scoped lang="scss">
  .grid_interactive {
    z-index: 3;
  }

  #indexbox {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 500px;
    padding: 20px;
    text-align: center;
    font-weight: 700;
    &.is-sticky {
      border-top: none;
      background-color: #000;
      color: #fff;
    }
    .col {
      margin: 2px;
      &.result {
        text-align: center;
        align-items: center;
        width: 50px;
        line-height: 30px;
        > div {
          border-radius: 6px;
          border-width: 2px;
          border-color: #0DFF92;
        }
        .auto_play {
          border-color: #0DFF92;
        }
        .human_play {
          border-color: #3d3fff;
        }
      }
    }
  }

  @media(min-width: 510px) {
    .footer {
      align-items: center;
    }
  }

  @media(max-width: 510px) {
    .footer {
      align-items: flex-start;
      width: 100%;
    }
  }

  #view_pixel_vp {
    position: absolute;
    top: 0em;
    width: 100%;
    height: calc(100% - 4em);
  }
</style>
<script>
  import TopMoneyHeader from "../components/bigbang/TopMoneyHeader";
  import WalletSimple from "../components/bigbang/WalletSimple";
  import BankRollList from "../components/bigbang/BankRollList";
  import StringFilter from "../plugins/mixins/tools/string_tx"
  import Codex from "../components/monoploy/Codex";
  import Bg_game from "../components/monoploy/bg_game";
  import Ui_popup from "../components/monoploy/UiDialog";
  import basesnd from "../plugins/mixins/monoploy/audiobase"
  import sndmono2d from "../plugins/mixins/monoploy/mono_2d"
  import UiPassEvent from "../components/monoploy/UiPassEvent";
  import UiStopEvent from "../components/monoploy/UiStopEvent";

  export default {
    mixins : [basesnd, sndmono2d, StringFilter],
    components : {
      UiStopEvent,
      UiPassEvent,
      Ui_popup,
      Bg_game,
      Codex,
      BankRollList,
      WalletSimple,
      TopMoneyHeader,
    },
    name : "app_monoploy_frontend",
    methods : {
      exit_game (e) {
        e.preventDefault ();
        this.$router.push ("/")
      },
      toggleAutoBet (e) {
        e.preventDefault ();
        this.autobet = !this.autobet;
        this.SFxUIClick ();
      },
      playDice (e) {
        e.preventDefault ();
        const { main_canvas_game } = this.$refs;
        main_canvas_game.gGameLogic ().Dice ();
        //main_canvas_game.gGameLogic ().DebugTrigger ();

      }
    },
    computed : {
      cash_online () {
        return this.$store.getters["mono/get_cash_value"];
      }
    },
    data () {
      return { autobet : false, result_dice : 0, result_dice_class : "human_play" }
    },
    mounted () {
      const that = this;
      const { main_canvas_game, passEvt, stopEvt, startDialog } = that.$refs;
      that.$nextTick (() => {
        that.$store.dispatch ("mono/myUserId", 300);

        const map_d = "&m=ja,1,14,hs,5,14&g=1,8,0,0,0,1,7,0,0,1,1,6,0,0,2,1,5,0,0,3,1,4,0,0,4,1,3,0,0,5,2,3,0,0,6,3,3,0,0,7,4,3,0,0,8,5,3,0,0,9,5,4,0,0,10,5,6,0,0,11,5,7,0,0,12,5,9,0,0,13,5,10,0,0,14,5,12,0,0,15,4,12,0,0,16,3,12,0,0,17,1,12,0,0,18,1,11,0,0,19&l=2,4,0,-1,-1,-1,0,gs,3,4,0,-1,-1,-1,0,gs,4,4,0,-1,-1,-1,0,gs,3,2,0,0,-1,7,0,l,2,2,0,0,-1,6,0,l,1,2,0,0,-1,-1,0,l,0,3,0,0,-1,5,0,gs,0,2,0,0,-1,-1,0,gs,0,1,0,-1,-1,-1,0,gs,1,1,0,-1,-1,-1,0,gs,1,0,0,-1,-1,-1,0,gs,0,0,0,-1,-1,-1,0,gs,2,0,0,-1,-1,-1,0,gs,2,1,0,-1,-1,-1,0,gs,3,1,0,-1,-1,-1,0,gs,3,0,0,-1,-1,-1,0,gs,4,0,0,-1,-1,-1,0,gs,4,1,0,-1,-1,-1,0,gs,5,1,0,-1,-1,-1,0,gs,5,0,0,-1,-1,-1,0,gs,6,0,0,-1,-1,-1,0,gs,6,1,0,-1,-1,-1,0,gs,6,3,0,0,-1,9,0,gs,6,4,0,0,-1,10,0,gs,0,4,0,0,-1,4,0,gs,2,6,0,0,-1,2,0,gs,3,6,0,-1,-1,-1,0,gs,3,5,0,-1,-1,-1,0,gs,2,5,0,0,-1,3,0,gs,4,5,0,-1,-1,-1,0,gs,4,6,0,-1,-1,-1,0,gs,5,5,0,-1,-1,-1,0,gs,6,5,0,-1,-1,-1,0,gs,6,6,0,0,-1,11,0,gs,0,6,0,-1,-1,-1,0,gs,0,5,0,-1,-1,-1,0,gs,0,7,0,0,-1,1,0,gs,2,8,0,-1,-1,-1,0,gs,4,8,0,-1,-1,-1,0,gs,5,8,0,-1,-1,-1,0,gs,2,7,0,-1,-1,-1,0,gs,3,7,0,-1,-1,-1,0,gs,4,7,0,-1,-1,-1,0,gs,3,8,0,-1,-1,-1,0,gs,6,7,0,0,-1,12,0,gs,4,2,0,0,-1,8,0,gs,5,2,0,-1,-1,-1,0,gs,6,2,0,-1,-1,-1,0,gs,3,9,0,-1,-1,-1,0,gs,3,10,0,-1,-1,-1,0,gs,3,11,0,0,-1,17,0,gs,4,9,0,-1,-1,-1,0,gs,4,10,0,-1,-1,-1,0,gs,4,11,0,0,-1,16,0,gs,3,13,0,-1,-1,-1,0,gs,2,13,0,-1,-1,-1,0,gs,2,12,0,-1,-1,-1,0,gs,0,11,0,-1,-1,-1,0,gs,2,9,0,-1,-1,-1,0,l,1,9,0,-1,-1,-1,0,l,0,8,0,0,-1,0,0,l,0,10,0,0,-1,-1,0,l,1,10,0,0,-1,19,0,l,0,9,0,-1,-1,-1,0,l,2,10,0,-1,-1,-1,0,l,2,11,0,0,-1,-1,0,l,5,11,0,-1,-1,-1,0,l,6,8,0,0,-1,-1,0,l,6,10,0,0,-1,14,0,l,6,9,0,0,-1,13,0,l,6,12,0,0,-1,15,0,l,6,11,0,-1,-1,-1,0,l,5,13,0,-1,-1,-1,0,l,4,13,0,-1,-1,-1,0,l,6,13,0,-1,-1,-1,0,l,1,13,0,-1,-1,-1,0,l,0,12,0,0,-1,18,0,l,0,14,0,-1,-1,-1,0,l,0,13,0,-1,-1,-1,0,l,1,15,0,-1,-1,-1,0,l,2,15,0,-1,-1,-1,0,l,3,15,0,-1,-1,-1,0,l,2,14,0,-1,-1,-1,0,l,3,14,0,-1,-1,-1,0,l,1,14,0,-1,-1,-1,0,l,4,14,0,-1,-1,-1,0,l,4,15,0,-1,-1,-1,0,l,5,14,0,-1,-1,-1,0,l,5,15,0,-1,-1,-1,0,l,6,14,0,-1,-1,-1,0,l,6,15,0,-1,-1,-1,0,l,0,15,0,-1,-1,-1,0,l&map=6,16,72,1";
        //  main_canvas_game.setup(map_d);
        main_canvas_game.$on ("main_start", () => {
          // main_canvas_game.setupMapSize (map_d);
          main_canvas_game.gGameLogic ().InitGame (1, 4, map_d);
        });

        /* main_canvas_game.gGameLogic ().on ("stop_event", (payload) => {
           console.log("got event now");
           that.stopEvt (payload);
         });  */
        main_canvas_game.$on ("pass_event_", function (payload) {
          // const code = payload.event;

          passEvt.popDialogEvent (main_canvas_game.gGameLogic (), payload);
          that.SFxOpenDialog ();
        });
        main_canvas_game.$on ("stop_event_", function (payload) {
          that.result_dice_class = "human_play";
          const code = payload.outstanding_events[0];
          switch (code) {
            case 0:
              startDialog.popDialogEvent (main_canvas_game.gGameLogic (), payload);
              that.SFxOpenDialog ();
              break;
            case 2122:
              break;
            default:
              console.log ("no event here: ", code);
              if (code > 10000) {
                stopEvt.popDialogNewCard (payload);
              }
              break;
          }
        });
        startDialog.$on ("close_pop_up", () => {
          main_canvas_game.gGameLogic ().OnNextEvent ();
          that.SFxCloseDialog ();
        });
        stopEvt.$on ("close_pop_up", () => {
          main_canvas_game.gGameLogic ().OnNextEvent();
          that.SFxCloseDialog ();
        });
        passEvt.$on ("close_pop_up", (payload) => {
          main_canvas_game.gGameLogic ().OnPassReturn (payload);
          that.SFxCloseDialog ();
        });
        main_canvas_game.$on ("dice_result_", (payload) => {
          that.result_dice = payload.total_steps;
          that.result_dice_class = payload.auto ? "auto_play" : "human_play";
          that.SfxDiceResult ();
        });
        main_canvas_game.$on ("player_turn_", (payload) => {
          that.result_dice_class = "human_play";
          that.SfxGameStart ();
        });
        main_canvas_game.$on ("transfer_cash_", (payload) => {
          that.SfxTransfer ()
        });
        main_canvas_game.$on ("start_dice_", (payload) => {
          // that.result_dice_class = "human_play";
          // that.SfxGameStart ();
        });
      })
    }
  }
</script>

