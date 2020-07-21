<template>
  <simple-pop window_mask="bbg_window_mask"
              class="windowed_table_x" window_background_class="bbg_long_info_window">
    <span slot="header" class="advertistment smaller">Block History</span>
    <div slot="body">
      <table class="table_proend tron">
        <thead>
        <tr class="headline">
          <th class="columnA">Block</th>
          <th class="ch">Hash</th>
          <th class="columnB">N</th>
        </tr>
        </thead>
        <tbody ref="zhisto_dialog">
        <tr :key="nqc" v-for="(t, nqc) in dot_list.slice(0, 13)">
          <td class="columnA">{{t.i}}</td>
          <td class="ch">{{get_hash_display_block(t)}}</td>
          <td class="columnB">{{t.d | fix6}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </simple-pop>
</template>

<script>
  import StringFilter from "../../plugins/mixins/tools/string_tx"
  import SimplePop from "../../components/util/SimplePop";

  export default {
    name : "pop-block-history",
    mixins : [StringFilter],
    components : {
      SimplePop,
    },
    methods : {},
    data () {
      return { dot_list : [] }
    },
    mounted () {
      const that = this;
      that.$store.subscribe ((mutations, state) => {
        const { game_history } = state.survival;
        that.dot_list = game_history;
      })
    }
  }
</script>

<style scoped>
  tbody.zhisto_dialog tr:hover {
    background-color: #0DFF92;
  }
</style>
