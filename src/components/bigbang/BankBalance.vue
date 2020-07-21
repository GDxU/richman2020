<template>
    <simple-pop v-if="display_window" window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
        <span slot="header" class="advertistment">Bank</span>
        <div slot="body">
            <table class="table_proend tron">
                <tr class="headline">
                    <th>Symbol</th>
                    <th>Balance</th>
                    <th>Game Bets</th>
                    <th>Impact</th>
                </tr>
                <tr :key="nqs" v-for="(t, nqs) in bankRolls">
                    <td>
                        <a @click="useCurrency" :data-coin="t.s">{{t.s}}</a>
                    </td>
                    <td :ref="bankroll_label(t.s)">{{t.total | coinbalance}}</td>
                    <td :ref="betroll_label(t.s)">{{t.folks}}</td>
                    <td :ref="betroll_label(t.s)">{{parseFloat(t.locked) / parseFloat(t.total) | percentage}}</td>
                </tr>
            </table>
        </div>
        <div slot="window_footer">
            <div class="bg-c0" @click="display_window=false"></div>
        </div>
    </simple-pop>
</template>

<script>
    import SimplePop from "../../components/util/SimplePop";

    export default {
        name : "asset-selection",
        components : {
            SimplePop,
        },
        computed : {
            bankRolls : {
                get () {
                    return this.$store.state.survival.pots;
                }
            },
        },
        watch : {
            bankRolls : {
                handler (z, o) {
                    //      console.log ("update detection bankRolls");
                    const vm = this;
                    z.every ((newItem) => {
                        o.every ((oldItem) => {
                            if (newItem.s === oldItem.s) {

                                //console.log ("3 update detection bank_roll coin, ", parseFloat (oldItem.total));
                                if (parseFloat (newItem.total) > parseFloat (oldItem.total)) {
                                    vm.pot_update_ (oldItem.s, true);
                                    // console.log ("1 update detection bank_roll coin, ", oldItem.s);
                                }

                                if (parseFloat (newItem.total) < parseFloat (oldItem.total)) {
                                    vm.pot_update_ (oldItem.s, false);
                                    //  console.log ("2 update detection bank_roll coin, ", oldItem.s);
                                }
                                return false;
                            }
                        })
                    })
                },
                deep : true,
            },
        },
        data () {
            return {
                display_window : false,
            }
        },
        methods : {
            toggleDisplayBalanceBox () {
                this.display_window = !this.display_window;
            }
        }
    }
</script>
