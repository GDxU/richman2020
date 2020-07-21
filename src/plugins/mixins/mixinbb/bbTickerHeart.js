import { EventBus } from "../../EventBus";

/****

 w_second := float64(t) / float64(1000000000)
 //msecond := x.FilterNumeric(wSecond)
 escape_factor := math.Pow(1.06, w_second)
 bet_enter_x := gamePlayer.EnteredBetAmount.Load()

 if escape_factor < x.start_x.Load() {
					//escape_factor = x.start_x.Load()
					//escape too soon
					return 1339, nil
				}

 */

export default {
  methods : {
    startCount () {
      const that = this;
      that.exploded = false;
      const status_origin = new Date ();
      let now_time = new Date ();
      const b = setInterval (function () {
        if (that.exploded) {
          clearInterval (b);
          that.escape_factor = that.ticker_f;
        }
        now_time = new Date ();
        let delta = now_time.getTime () - status_origin.getTime ();
        that.escape_factor = Math.pow (1.06, delta / 1000);
      }, 20);
    },
    stopCount () {
      this.exploded = true;
    },
  },
  data () {
    return {
      ticker_start_time : 0,
      escape_factor : 0,
      ticker_f : 0,
      bindex : 0,
      exploded : false
    }
  },
  mounted () {
    const that = this;
    EventBus.$on ("bb_tick", (json) => {
      that.$emit ("ticker_emit", {
        tick : parseFloat (json.f)
      });
      that.bindex++;
    });
    that.$nextTick (() => {
      that.$on ("event_game_start", (state_n) => {
        that.startCount ()
      });
      that.$on ("event_explode", (state_n) => {
        that.stopCount ()
      });
    })
  }
}
