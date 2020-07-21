<template>
    <section>
        <table class="table_proend">
            <tr>
                <th>Player</th>
                <th>Time</th>
                <th>Result</th>
                <th>Profit</th>
                <th>Visual</th>
            </tr>

            <tr :key="n" v-for="(thd, n) in array_ex.slice(0, 10)">
                <td>{{ecp(thd.pid, 5)}}</td>
                <td> ---</td>
                <td>{{thd.result}}</td>
                <td>{{thd.profit| fix4 }}</td>
                <td>
                    <div class="progress" style="min-width:100px;position:relative;margin-bottom:0;height:10px;">
                        <div class="progress-bar"
                             :class="form_color(thd)"
                             :style="form_style(thd)"></div>
                        <div :style="form_bar(thd)">
                        </div>
                    </div>
                </td>
            </tr>

        </table>
    </section>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name : "FuseDiceBox",
        data () {
            return {}
        },
        computed : {
            ...mapState ([
                'ccondition',
                'cnonce',
                'cresult',
            ]),
            array_ex : {
                get () {
                    return this.$store.state.game_bet_history_gid_1;
                },
                set (newValue) {
                }
            },
        },
        methods : {
            ecp (str, maxLength, { side = "end", ellipsis = "..." } = {}) {
                if (str.length > maxLength) {
                    switch (side) {
                        case "start":
                            return ellipsis + str.slice (-(maxLength - ellipsis.length));
                        case "end":
                        default:
                            return str.slice (0, maxLength - ellipsis.length) + ellipsis;
                    }
                }
                return str;
            },
            form_bar (data) {
                var r = data.result;
                return "position:absolute;left:0;top:0;width:" + r + "%;border-right:3px solid #333;height:100%;"
            },
            form_color (data) {
                var _ta, t = data.t;
                var p = data.profit;
                var r = data.result;
                if (r > t && p > 0) {
                    _ta = true
                }
                if (r < t && p > 0) {
                    _ta = true
                }
                if (r > t && p < 0) {
                    _ta = false
                }
                if (r < t && p < 0) {
                    _ta = false
                }
                return {
                    'progress-bar-success' : _ta,
                    'progress-bar-failure' : !_ta,
                }
            },
            form_style (data) {
                var t = data.t;
                //  var c = data.c;
                var p = data.profit;
                var r = data.result;
                var as = "";
                if (r > t && p > 0) {
                    as = "right"
                }
                if (r > t && p < 0) {
                    as = "left"
                }
                if (r < t && p < 0) {
                    as = "right";
                    r = 100 - t
                }
                if (r < t && p > 0) {
                    as = "left";
                    r = 100 - t
                }
                return "float:" + as + ";width:" + r + "%;"
            }
        }
    }
</script>

<style scoped>

</style>