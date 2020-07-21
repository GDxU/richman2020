export default {
  methods : {
    SelectBetControl (arr, curreny_coin_name) {
      const that = this;
      let found = false;
      //  console.log ("select 1111");
      //   console.log (arr);
      arr.forEach (function (extra, index, array) {
        if (String (extra.c).toLowerCase () === String (curreny_coin_name).toLowerCase ()) {
          that.bet.x_1 = extra.b1;
          that.bet.x_2 = extra.b2;
          that.bet.x_3 = extra.b3;
          that.bet.x_4 = extra.b4;
          that.bet.bet_max = extra.max;
          // console.log ("bet updates");
          found = true;
        }
        // console.log (extra);
      });
      if (!found) {
        that.bet.x_1 = 1.0;
        that.bet.x_2 = 5.0;
        that.bet.x_3 = 10.0;
        that.bet.x_4 = 15.0;
        that.bet.bet_max = 1;
      }
    },
    get_local_request () {
      const that = this;
      const bet_max_v = this.bet.bet_max;
      let k = 9000000000;
      that.local_pots.forEach (function (extra, index, array) {
        if (String (extra.s).toLowerCase () === String (that.bet.currency).toLowerCase ()) {
          k = (parseFloat (extra.total) - parseFloat (extra.locked)) * bet_max_v;
        }
      });
      return k
    },
    useCurrency (e) {
      if (this.update_status === 88 && !this.bet.status) {
        this.bet.currency = e.target.attributes['data-coin'].value;
        this.SelectBetControl (this.buttonExtras, this.bet.currency);
        this.$emit ("selection_coin", this.bet.currency);
      } else {
        console.log ("the current status is not working with the betting status...");
      }
    },
    CoinUse (coin_name) {
      if (this.update_status === 88 && !this.bet.status) {
        this.SelectBetControl (this.buttonExtras, coin_name);
        this.bet.currency = coin_name;
      } else {
        console.log ("The current status is not working with the betting status...");
      }
    },
    SelectCoinToDisplayBankInfo (coin, callback) {
      this.bank_rolls.forEach ((bank, i) => {
        if (String (coin).toLowerCase () === String (bank.s).toLowerCase ()) {
          callback (bank);
          // console.log ("found bank item", this.bank_rolls);
        }
      });
    }
  },

}
