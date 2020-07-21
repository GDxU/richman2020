export default {
  methods : {
    notificationError (msg) {
      this.$notice ({
        type : "error",  // alert, success, warning, error, info/information
        text : msg,
      });
    },
    notificationSuccess (msg) {
      this.$notice ({
        type : "success",  // alert, success, warning, error, info/information
        text : msg,
      });
    },
    notificationWarning (msg) {
      this.$notice ({
        type : "warning",  // alert, success, warning, error, info/information
        text : msg,
      });
    },
    notificationInfo (msg) {
      this.$notice ({
        type : "info",  // alert, success, warning, error, info/information
        text : msg,
      });
    },
    notificationAlert (msg) {
      this.$notice ({
        type : "alert",  // alert, success, warning, error, info/information
        text : msg,
      });
    },
    status_display (m) {
      return "f-" + m;
    },
    wallet_label (coin_name) {
      return "coin_" + String (coin_name).toLowerCase ();
    },
    bankroll_label (coin_name) {
      return "bankroll_" + String (coin_name).toLowerCase ();
    },
    betroll_label (coin_name) {
      return "betctrl_" + String (coin_name).toLowerCase ();
    },
    dot_list_label (t) {
      return "dot_a_" + t.i;
    },
    header_bank_roll_display () {
      return "header_bank_roll_display";
    },
    get_current_total_amount_in_pot (t) {
      return parseFloat (t.total) + parseFloat (t.locked)
    },
    get_current_pot_percentage (t) {
      return parseFloat (t.locked) / parseFloat (t.total)
    },
    get_hash_display_block (k) {
      const n = new String (k.h);
      const hash = n.substring (0, 5) + "..." + n.substr (n.length - 5);
      return hash;
    },
    get_hash_display_block_wide (k) {
      const n = new String (k.h);
      const hash = n.substring (0, 10) + "..." + n.substr (n.length - 10);
      return hash;
    },
    equal_assets (coin1, coin2) {
      return String (coin1).toLowerCase () === String (coin2).toLowerCase ()
    },
    get_asset_display (amount, coin) {
      if (coin === "" || coin === undefined) {
        return "0.00 ---"
      } else {
        return Number (amount).toFixed (3) + " " + String (coin).toUpperCase ()
      }
    }
  }
}
