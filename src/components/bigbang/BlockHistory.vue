<template>

</template>

<script>
  import StringFilter from '../../plugins/mixins/tools/string_tx'

  export default {
    name : "block-history",
    mixins : [StringFilter],
    methods : {
      UpdateList (v) {
        this.$emit ("block_history_list", v);
      },
      AppendBlock (player_update) {
        this.$emit ("player_update", player_update);
      },
      SelectCoin (data) {
        const coin = data.target.attributes['data-coin'].value;
        this.$emit ("selection_coin", coin);
      },
    },
    data () {
      return {
        block_history_list : [],
      }
    },
    mounted () {
      const that = this;
      this.$nextTick (() => {
        that.$on ("block_history_list", (val) => {
          window.console.log ("block_history_list", val);
          for (let k in val) {
            if (typeof k === "object") {
              if (k.s === "BBGC") {
                window.console.log ("player for bbgc now:: ", k.folks);
              }
            }
          }
          this.block_history_list = val;
        });
        that.$on ("player_update", (val) => {
          // window.console.log ("player", val);
        });
      })

    }
  }
</script>

<style scoped>

</style>
