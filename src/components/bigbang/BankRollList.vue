<template>
  <div class="bank_roll_data flexhitem onlywidthscreen">
    <table class="table_proend tron">
      <thead>
      <tr class="headline">
        <th>符号</th>
        <th>盆资产</th>
        <th>投</th>
        <th>杀</th>
      </tr>
      </thead>
      <tbody>
      <tr class="banner_button" :key="nqs" v-for="(t, nqs) in bank_rolls_list">
        <td @click="SelectCoin" :data-coin="t.s">{{t.s}}</td>
        <td :ref="bankroll_label(t.s)" @click="SelectCoin" :data-coin="t.s">{{get_current_total_amount_in_pot(t) |
          coinbalance}}
        </td>
        <td :ref="betroll_label(t.s)" @click="SelectCoin" :data-coin="t.s">{{t.folks}}</td>
        <td :ref="betroll_label(t.s)" @click="SelectCoin" :data-coin="t.s">{{get_current_pot_percentage(t) |
          percentage}}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
  .bank_roll_data {
    color: #7fff72;
    //position: absolute;
    table {
      border-collapse: collapse;
      border-spacing: 1em;
      border: 0;
      td, th {
        border: 0;
      }
      tbody td {
        border: 0;
        padding: 4px;
      }
      tr.banner_button {
        cursor: pointer;
        box-sizing: inherit;
        transition-property: all;
        transition-duration: .3s;
        transition-timing-function: ease;
        &:hover {
          color: #b3ffa5;
          background: #00952d;
        }
      }
    }
  }
</style>

<script>
  import StringFilter from "../../plugins/mixins/tools/string_tx"
  import AnimationX from "../../plugins/mixins/mixinbb/bbAnimation"

  export default {
    name : "bank-roll-list",
    mixins : [StringFilter, AnimationX],
    props : ["hover", "hover_color"],
    data () {
      return {
        mock_debug : [
          { s : "thpc", folk : 2, total : 32, locked : 39 },
          { s : "th3pc", folk : 2, total : 32, locked : 39 },
          { s : "th2pc", folk : 2, total : 32, locked : 39 },
          { s : "th1pc", folk : 2, total : 32, locked : 39 },
        ],
        bank_rolls_list : [],
      }
    },
    computed : {
      can_switch_token () {
        const now_state = this.$store.state.survival.game_status;
        return now_state === 88
      }
    },
    methods : {
      UpdateCoinInfo (v) {
        this.$emit ("update_coin_info", v);
      },
      UpdateList (bank_roll) {
        this.bank_rolls_list = bank_roll;
        this.$emit ("bank_rolls_list", bank_roll);
      },
      PlayerUpdate (player_update) {
        this.$emit ("player_update", player_update);
      },
      SelectCoin (data) {
        const coin = data.target.attributes["data-coin"].value;
        // const coin = data.target.innerText;
        //const coin = data;
        // console.log (coin)
        if (this.can_switch_token) {
          this.$emit ("selection_coin", coin);
        } else {
          this.notificationError ("Cannot switch coin yet")
        }
      },
    },
    mounted () {
      const that = this;
      this.$nextTick (() => {
        that.$on ("bank_rolls_list", (val) => {
          that.bank_rolls_list = val;
          //this.pot_update_()
        });
        that.$on ("player_update", (val) => {

        });
        that.$on ("update_coin_info", ({ gain, coin }) => {
          that.pot_update_ (coin, gain);
          // window.console.log ("update_coin_info", gain, coin);
        });
      })

    }
  }
</script>
