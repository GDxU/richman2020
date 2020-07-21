<template>
    <simple-pop v-if="display_window" window_mask="bbg_window_mask"
                window_background_class="bbg_long_info_window">
        <span slot="header" class="advertistment">Balance</span>
        <div slot="body">
            <table class="table_proend tron">
                <tr class="headline">
                    <th>Coin Name</th>
                    <th>Balance</th>
                </tr>
                <tr :key="nbx" v-for="(t, nbx) in userWallets">
                    <td><a @click="useCurrency" :data-coin="t.c">{{t.c|coinName}}</a></td>
                    <td :ref="wallet_label(t.c)">{{(t.b) | coinbalance}}</td>
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
            userWallets : {
                get () {
                    return this.$store.state.survival.profile_wallet;
                }
            },
        },
        watch : {
            userWallets : {
                handler (z, o) {
                    const vm = this;
                    // console.log ("k1 g");
                    for (let [keynewItem, newItem] of Object.entries (z)) {
                        // console.log ("k1 n, ", keynewItem);
                        for (let [keyoldItem, oldItem] of Object.entries (o)) {
                            if (keynewItem === keyoldItem) {

                                //   console.log ("3 update detection coin, ", newItem.b, oldItem.b);
                                if (parseFloat (newItem.b) > parseFloat (oldItem.b)) {
                                    //  vm.profile_update_wallet (oldItem.c, true);
                                    //     console.log ("1 update detection coin, ", oldItem.c);
                                }

                                if (parseFloat (newItem.b) < parseFloat (oldItem.b)) {
                                    //  vm.profile_update_wallet (oldItem.c, false);
                                    //   console.log ("2 update detection coin, ", oldItem.c);
                                }
                                //return false;
                            }
                        }
                    }

                    /* let changed = after.filter( function( p, idx ) {
                     return Object.keys(p).some( function( prop ) {
                         return p[prop] !== before[idx][prop];
                     })
                 })

                 console.log(changed)*/

                },
                // lazy : false,
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
