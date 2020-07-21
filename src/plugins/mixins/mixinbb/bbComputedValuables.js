export default {
  computed : {
    user_name : {
      get () {
        return this.$store.state.survival.profile.username;
      }
    },
    current_round : {
      get () {
        return this.$store.state.survival.up_next;
      }
    },
    text_bet_display : {
      get () {
        return Number (this.bet.bet_amount).toFixed (3) + " " + String (this.bet.currency).toUpperCase ()
      }
    },
    text_tick_timer : {
      get () {
        if (this.update_status >= 100 && this.update_status <= 101) {
          return Number (this.escape_factor).toFixed (3) + "x"
        } else {
          let c = Math.floor (this.time_second - 1);
          let dots = "";
          for (let i = 0; i < c; i++) {
            dots = dots + "."
          }
          if (this.update_status === 88) {
            if (c > 4) {
              return dots
            } else {
              return c + "s"
            }
          } else {
            return "ready " + c + "s"
          }
        }
      }
    },
    time_second : {
      get () {
        return this.$store.state.survival.waiting_time;
      }
    },
    user_wallets : {
      get () {
        return this.$store.state.survival.profile_wallet;
      }
    },

    bank_rolls : {
      get () {
        return this.$store.state.survival.pots;
      }
    },
  },
}
