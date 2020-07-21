import { EventBus } from "../../EventBus";
import axios from "../../axios";
import { TimelineLite } from "gsap";

export default {
  data () {
    return {
      bet : {
        bet_amount : 0.00,
        currency : "---",
        x_1 : 4.0,
        x_2 : 10.0,
        x_3 : 15.0,
        x_4 : 20.0,
        bet_max : 1,
        bet_min : 4,
        //true: now betting, false: not betting
        status : false,
        escaped : false,
        autobet : false,
      },
      local_pots : [],
      local_wallet : {},
      notification_tx : null,
      npbgfactor : null,
      tunnel_animation : null,

    }
  },
  watch : {
    bank_rolls : {
      handler (z, o) {
        //      console.log ("update detection bank_rolls");
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

    user_wallets : {
      handler (z, o) {
        const vm = this;
        console.log ("k1 g");
        for (let [keynewItem, newItem] of Object.entries (z)) {
          console.log ("k1 n, ", keynewItem);
          for (let [keyoldItem, oldItem] of Object.entries (o)) {
            if (keynewItem === keyoldItem) {

              console.log ("3 update detection coin, ", newItem.b, oldItem.b);
              if (parseFloat (newItem.b) > parseFloat (oldItem.b)) {
                vm.profile_update_wallet (oldItem.c, true);
                console.log ("1 update detection coin, ", oldItem.c);
              }

              if (parseFloat (newItem.b) < parseFloat (oldItem.b)) {
                vm.profile_update_wallet (oldItem.c, false);
                console.log ("2 update detection coin, ", oldItem.c);
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
  methods : {
    /*  handle_diff (z, o) {
          const vm = this;
          z.every ((newItem) => {
              o.every ((oldItem) => {
                  if (newItem.c === oldItem.c) {

                      console.log ("3 update detection coin, ", newItem.b, oldItem.b);
                      if (parseFloat (newItem.b) > parseFloat (oldItem.b)) {
                          vm.profile_update_wallet (oldItem.c, true);
                          console.log ("1 update detection coin, ", oldItem.c);
                      }

                      if (parseFloat (newItem.b) < parseFloat (oldItem.b)) {
                          vm.profile_update_wallet (oldItem.c, false);
                          console.log ("2 update detection coin, ", oldItem.c);
                      }
                      return false;
                  }
              })
          })
      },*/
    afterTicker (f, seed) {
      return;
    },
    updateStatus (json) {
    },
    bet_request (json) {
      //call when success betting
    },
    escape_request (json) {
    },
    disconnected_popbox (message) {
      this.message_notice = message;
      this.msgErrorBox = true;
    },
    betUpdate () {
    },
    pot_update (potx) {
    },
    connected () {
      this.message_notice = "";
      this.msgErrorBox = false;
      // this.$store.dispatch ("blockhistory");
    }
  },
  mounted () {
    const that = this;
    EventBus.$on ("bb_status", this.updateStatus);
    EventBus.$on ("bet_request", this.bet_request);
    EventBus.$on ("escape_request", this.escape_request);
    EventBus.$on ("disconnected", this.disconnected_popbox);
    // EventBus.$on ("connected", this.connected);
    // EventBus.$on ("pot_ls_update_c", this.history_update);
    EventBus.$on ("pot_update", this.pot_update);

    // EventBus.$on ("profile_update", this.profile_update);
    this.$nextTick (() => {
      const {
        notificationLablel,
      } = that.$refs;

      if (notificationLablel !== undefined) {
        that.notification_tx = notificationLablel;
      }
      // that.local_wallet = that.$store.state.survival.profile_wallet;
      EventBus.$emit ("join_game", { add : "bb" });
      EventBus.$emit ("request_snapshot_data_packet", "...");
      that.$store.dispatch ("survival/blockhistory_init");
    });
    that.$store.subscribe ((mutations, state) => {
      const { pots, profile_wallet, current_bet_amount, current_bet_coin } = state.survival;
      switch (mutations.type) {
        case  "bb_status":
          that.local_pots = pots;
          //   console.log ("bb status update");
          break;
        case "user_wallet_renew":
          // console.log ("user_wallet_renew", profile_wallet);
          // that.handle_diff (state.survival.profile_wallet, that.local_wallet);
          // that.local_wallet = state.survival.profile_wallet;
          break;
        case "autobet":
          that.bet.bet_amount = current_bet_amount;
          that.bet.currency = current_bet_coin;
          that.betUpdate ();
          that.betEnter ();
          break;
      }
    });
    this.$GSLite = new TimelineLite ();
  },
  destroyed () {
    EventBus.$emit ("exit_game", { remove : "bb" });
    EventBus.$off ("disconnected", this.disconnected_popbox);
    EventBus.$off ("connected", this.connected);
    EventBus.$off ("bb_status", this.updateStatus);
    EventBus.$off ("bb_tick", this.updateTick);
    EventBus.$off ("bet_request", this.bet_request);
    EventBus.$off ("escape_request", this.escape_request);
    EventBus.$off ("pot_ls_update_c", this.history_update);
    EventBus.$off ("pot_update", this.pot_update);
    // EventBus.$off ("profile_update", this.profile_update);
    // this.$GSLite = null;

  }
}
