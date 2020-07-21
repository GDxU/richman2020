<template>
    <section>
        <table class="table_card_lott">

            <tr>
                <th>Player</th>
                <th>Time</th>
                <th>Key Number</th>
                <th>No.</th>
            </tr>

            <tr :key="n" v-for="(thd, n) in array_ex.slice(0, 10)">
                <td>{{thd.pid}}</td>
                <td> ---</td>
                <td class="key_numb">{{thd.profit | changeprofit}}</td>
                <td class="key_no">

                </td>
            </tr>

        </table>
    </section>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name : "tablecardcheck",
        computed : {
            array_ex : {
                get () {
                    return this.$store.state.game_bet_history_gid_2;
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
            }
        }
    }
</script>

<style scoped>

</style>