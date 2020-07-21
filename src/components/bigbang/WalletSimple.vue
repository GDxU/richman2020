<template>
  <!-- <div class="flexcontainx grid onlywidthscreen personal_wallet">-->
  <div class="flexhitem personal_wallet onlywidthscreen">
    <table class="table_proend tron">
      <thead>
      <tr class="headline">
        <th>符号</th>
        <th>资产</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="nbx" v-for="(t, nbx) in user_wallet_list">
        <td @click="SelectCoin" :data-coin="t.c">{{t.c|coinName}}</td>
        <td :ref="wallet_label(t.c)" @click="SelectCoin" :data-coin="t.c">{{(t.b) | coinbalance}}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <!--  </div>-->
</template>
<style scoped lang="scss">
  .personal_wallet {
    color: #dcff7c;
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
  import StringFilter from '../../plugins/mixins/tools/string_tx'

  /*

    Array.prototype.ProfileWalletArray = () => {
      const array = this;
      const obj = [];
      array.every ((element) => {
        obj.push (element);
      });
      return obj;
    };

  */
  function filter (list) {
    let list_out = [];
    const lst = Object.keys (list);
    for (let i = 0; i < lst.length; i++) {
      const symbol = lst[i];
      if (list[symbol].hasOwnProperty ("b")) {
        if (list[symbol].b > 0) {
          list_out.push (list[symbol])
        }
      }
    }
    return list_out;
  }

  export default {
    name : "wallet-simple",
    mixins : [StringFilter],
    methods : {
      UpdateList (walletList) {
        this.$emit ("user_wallet_list", walletList);
      },
      SelectCoin (data) {
        const coin = data.target.attributes['data-coin'].value;
        this.$emit ("selection_coin", coin);
      },
    },
  /*  computed : {
      wallet_list () {
        const list = this.$store.state.survival.profile_wallet;
        return filter (list);
      }
    },*/
    data () {
      return { user_wallet_list : {} }
    },
    mounted () {
      const that = this;
      this.$nextTick (() => {
        const list = this.$store.state.survival.profile_wallet;
        that.user_wallet_list = filter (list);
        that.$on ("user_wallet_list", (val) => {
          window.console.log (val);
          that.user_wallet_list =  filter (val);
        })
      })

    }
  }
</script>
