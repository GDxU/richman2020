<template>
  <div class="flexcontainx grid">
    <div class="flexhitem flex-banner control_face_cover">
      <table class="rblist table_proend tron">
        <thead>
        <tr class="headline">
          <th class="xs">ID</th>
          <th>User</th>
          <th>Bet</th>
          <th>Status</th>
          <th>Profit</th>
          <th>Time</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="ncxv" v-for="(t, ncxv) in users_list.slice(0, 90)">
          <td class="xs">{{t.i}}</td>
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
</template>

<script>
  import StringFilter from "../../plugins/mixins/tools/string_tx"
  import AnimationX from "../../plugins/mixins/mixinbb/bbAnimation"
  import TimeAgo from "vue2-timeago"

  export default {
    name : "player-list",
    mixins : [StringFilter, AnimationX],
    components : { TimeAgo },
    computed : {
      users_list : {
        get () {
          return this.$store.state.survival.players
        }
      },
    }
  }
</script>

<style scoped>

  @media (min-width: 510px) {
    .table_proend .xs {
      display: table-cell;
    }
  }

  @media (max-width: 510px) {
    .table_proend .xs {
      display: none
    }
  }
</style>
