<template>
  <simple-pop v-if="display_window" window_mask="bbg_window_mask">
    <div slot="header"></div>
    <div slot="body">
      <div id="dialog_content">
        <div class="backback">
          <div class="backgroundCardSunShine">
            <div class="pie">
              <p class="p1"></p>
              <p class="p2"></p>
              <p class="p3"></p>
              <p class="p4"></p>
              <p class="p5"></p>
              <p class="p6"></p>
              <p class="p7"></p>
              <p class="p8"></p>
              <p class="p9"></p>
              <p class="p10"></p>
              <p class="p11"></p>
              <p class="p12"></p>
              <p class="p13"></p>
              <p class="p14"></p>
              <p class="p15"></p>
              <p class="p16"></p>
              <p class="p17"></p>
              <p class="p18"></p>
              <p class="p19"></p>
              <p class="p20"></p>
            </div>
          </div>
        </div>
        <div class="boximg">
          <img src="~assets/img/mono_web/func01_.png"/>
        </div>
        <div class="bottom_wrap">
          <div class="boxtext">
            <span class="title">{{title}}</span>
            <span class="smallfont dark">{{statement}}</span>
          </div>
          <div class="boxout">
            <span class="cooldown" :style="{width: cooldown + '%'}"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
    </div>
  </simple-pop>
</template>
<script>
  // import image_dice from "~assets/img/mono_web/func01_.png"
  import SimplePop from "../util/SimplePop";
  import StringFilter from "../../plugins/mixins/tools/string_tx"
  import { TimelineLite } from "gsap"

  export default {
    name : "ui-pass-event",
    mixins : [StringFilter],
    components : { SimplePop },
    computed : {
      object_name () {
        return "land"
      },
      cash () {
        if (this.player_focus) {
          if (this.player_focus.finance) {
            return this.player_focus.finance.cash;
          }
          return 0
        } else {
          return 0
        }
      }
    },
    methods : {
      closeBox () {
        this.display_window = false;
        this.$emit ("close_pop_up", this.data_payload);
      },
      popDialogEvent (logic, eventPayload) {
        this.data_payload = eventPayload;
        this.player_focus = eventPayload.player;
        this.map_logic_altas = logic;
        this.display_window = true;
        //  console.log ("event stop in pop:", logic);
        //  const land = event.land;
        //  const code = eventPayload.event;
        console.log ("event code found", eventPayload);
        this.statement = eventPayload.card.description;
        this.title = eventPayload.card.name;
        this.CountDown (3);
      },
      CountDown (sec) {
        if (this.cooldown === 0) {
          this.cooldown = 100;
          this.$GSLite.to (this, sec, { cooldown : 0 });
          this.$GSLite.eventCallback ("onComplete", this.closeBox);
        }
      },
    },
    mounted () {
      const timeline = new TimelineLite ();
      this.$GSLite = timeline;
      //this.display_window = true;
      //this.popDialogNewCard (100);
    },
    data () {
      return {
        title : "...",
        statement : "...",
        data_payload : {},
        map_logic_altas : null,
        player_focus : null,
        display_window : false,
        cooldown : 0,
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "~assets/styles/core/utilities/coloru";
  @import "~assets/styles/core/utilities/fun";
  @import "~assets/styles/core/_bootstrap-variables";
  @import "~assets/styles/core/_animate";

  $backgroundColor: #fff8c8aa;
  $colorUp: rgb(76, 255, 80);
  $colorDown: rgb(0, 128, 40);

  .modal-container {
    width: 600px !important;

    //animation: grow 3s linear infinite;
    .modal-header {
      > div {
        background-color: #141585;
        color: whitesmoke;
      }
    }

    #dialog_content {
      display: block;
      height: calc(100vh - 300px);
      border-radius: 10px;
      background: $backgroundColor;
      color: black;
      overflow: hidden;
      position: relative;
      @include back_spot_light(3);
      .boximg {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        > img {
          width: auto;
          height: auto;
        }
      }

      .bottom_wrap {
        display: block;
        position: absolute;
        bottom: 0;
        width: 100%;
        .boxtext {
          width: 100%;
          padding: 10px;
          display: block;
          position: relative;
          flex-direction: column;
          background: $backgroundColor;
          text-align: center;
          flex: 1;
          span {
            align-self: center;
            display: flex;
            flex-direction: column;
          }
          .title {
            font-size: 1em;
            color: black;
          }
        }
        .boxout {
          margin: 0;
          background: linear-gradient(-135deg, $colorUp 0%, $colorDown 100%);
          padding: 1px;
          display: block;
          position: relative;
          z-index: 2;
          width: 100%;
          .cooldown {
            bottom: 0;
            position: absolute;
            height: 4px;
            width: 100%;
            background: $colorUp;
            background: linear-gradient(-135deg, $colorUp 0%, $colorDown 100%);
            left: 0;
            z-index: 2;
          }
        }
      }

      .backback {
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        position: absolute;
        z-index: 0;
        .backgroundCardSunShine {
          height: 100%;
          width: 100%;
          z-index: 0;
          position: absolute;

          $n: 20; // density

          .pie {
            width: 500%;
            height: 500%;
            position: relative;
            overflow: hidden;
            top: -200%;
            left: -200%;
            animation: rot 111s linear infinite;
          }

          .pie p {
            width: 50%;
            height: 50%;
            position: absolute;
            background: #ff9500;
            transform-origin: right bottom;
            &:nth-child(2n) {
              background: #ffb127;
            }
          }

          @for $i from 1 through $n {
            .p#{$i} {
              transform: rotate(#{$i * 360/$n}deg) skew(#{90 - 360/$n}deg)
            }
          }
        }
      }
    }

    /* .modal-footer {
       .grid {
         border-radius: 3px;
         background-color: whitesmoke;
         a {
           cursor: pointer;
           text-decoration: underline;
           color: blue;
         }
       }
       span {
         font-size: 8px;
         float: right;
         color: yellow;
       }
       .display_person {
         bottom: -10px;
         right: calc(50% - 450px);
         position: absolute;
         z-index: 1;
       }
     }*/
  }

  /*
    @media(min-width: 510px) {

      .modal-footer {
        .display_person {
          img {
            width: 400px;
            height: auto;
          }
        }

      }
    }

    @media(max-width: 510px) {
      .modal-footer {
        width: 180px;
        .grid {
          width: 170px;
        }
        .display_person {
          img {
            width: 210px;
            height: auto;
          }
          bottom: -10px;
          right: calc(50% - 200px);
          z-index: 0;
        }
      }
    }*/

  @keyframes rot {
    to {
      transform: rotate(360deg);
    }
  }

</style>
