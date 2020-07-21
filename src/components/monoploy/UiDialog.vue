<template>
  <simple-pop v-if="display_window" window_mask="bbg_window_mask">
    <div slot="header">
      <span>{{title}}</span>
    </div>
    <div slot="body">
      <div id="dialog_content">
        <span>{{statement}}</span>
      </div>
    </div>
    <div slot="footer">
      <div class="grid">
        <div class="row">
          <div class="col">
            <a @click="acceptOffer">{{positive}}</a>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <a @click="denyOffer">{{negative}}</a>
          </div>
        </div>
      </div>
      <span>Available credit: {{cash}}</span>
      <div class="display_person">
        <img src="~assets/img/mono_web/talking_91_.png"/>
      </div>
    </div>
  </simple-pop>
</template>
<script>
  import SimplePop from "../util/SimplePop";
  import MapLogic from "../../plugins/mono_2dx/MapLogic";
  import StringFilter from "../../plugins/mixins/tools/string_tx"

  export default {
    name : "ui_popup",
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
      denyOffer (e) {
        e.preventDefault ();
        this.closeBox ();
      },
      acceptOffer (e) {
        e.preventDefault ();
        if (this.unlock_at_price < this.player_focus.finance.cash) {
          const _map = this.map_logic_altas;
          const _land = this.map_logic_altas.status.current_event.land;
          if (_map instanceof MapLogic) {
            if (_land.level === 0) {
              _land.Acquire (this.player_focus);
            }

            const result = _map.LevelUp (this.map_logic_altas.status.current_event.land);

            if (result) {
              this.closeBox ();
            }
          }
          this.player_focus.finance.ReduceCash (this.unlock_at_price);
        } else {
          this.statement = "Wallet asset is not sufficient"
        }
      },
      closeBox () {
        this.display_window = false;
        this.$emit ("close_pop_up");
      },
      popDialogEvent (logic, event) {
        this.player_focus = event.player;
        this.map_logic_altas = logic;
        this.display_window = true;
        console.log ("event stop in pop:", logic);
        const land = event.land;
        if (land.price_schedule) {
          const price_mark = land.price_schedule[land.level];
          if (land.level === 0) {
            this.property_land (price_mark);
          } else if (land.level === 1) {
            this.property_start_constructions (price_mark);
          } else {
            this.property_upgrade (price_mark);
          }
        }
      },
      property_start_constructions (cost) {
        this.title = "LAND DEVELOPMENT OFFER"
        this.positive = "Take this opportunity to develop the first house at this for BTC " + cost;
        this.negative = "Leave the deal and wait for the next opportunity"
        this.statement = "A land development offer is found from the local area"
        this.unlock_at_price = cost;
      },
      property_upgrade (cost) {
        this.title = "UPGRADE BUILDING OFFER"
        this.positive = "Take this opportunity to upgrade the building for BTC " + cost;
        this.negative = "Leave the deal and wait for the next opportunity"
        this.statement = "An Upgrade Offer is found from the local area"
        this.unlock_at_price = cost;
      },
      property_land (cost) {
        this.title = "UNDEVELOPED LAND OFFER"
        this.positive = "Take this opportunity and acquire this land for BTC " + cost;
        this.negative = "Leave the deal and wait for the next opportunity"
        this.statement = "An offer is found from the local area"
        this.unlock_at_price = cost;
      }
    },
    mounted () {
      //only for demo
      // this.property_land ();
    },
    data () {
      return {
        title : "",
        positive : "",
        negative : "",
        map_logic_altas : null,
        player_focus : null,
        display_window : false,
        unlock_at_price : 0,
      }
    }
  }
</script>
<style scoped lang="scss">
  $backgroundColor: #fff8c8aa;
  .modal-container {
    width: 500px !important;
    .modal-header {
      > div {
        background-color: #b3ffa5;
        padding: 5px;
      }
    }

    #dialog_content {
      display: block;
      height: calc(100vh - 400px);
      padding: 15px;
      border-radius: 3px;
      background: $backgroundColor;
      color: black;
    }

    .modal-footer {
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
    }
  }

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
  }
</style>
