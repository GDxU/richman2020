import { EventBus } from "../../EventBus"
import { TimelineLite, Back, Power2, Power1 } from "gsap"
/*
String.prototype.format = function () {
    let a = this;
    for (var k in arguments) {
        a = a.replace ("{" + k + "}", arguments[k])
    }
    return a
};*/
export default {
  methods : {
    /*  eventClearChart () {
      },
      eventKillChart () {
      },
      eventStartChart () {
      },
      eventShowResult () {
      },
      eventUpdateState (state_x, extras_json) {

      },*/
    randomGameOverText () {
      const l = ["🔪爆炸了", "🔪殺", "💥💥爆", "🔥火🔥", "🌊Game Over", "🥂干", "🌮吃"];
      const a = Math.floor (Math.random () * l.length);
      return l[a];
    },
    mainLoop (big_state_num) {
      switch (big_state_num) {
        //OPEN_BET
        case 88:
          this.classes.all_bet_buttons = "";
          this.classes.confirm_escape = "disabled";
          this.$store.dispatch ("survival/clear_players");
          // this.$store.dispatch ("updateExtrasBetControls", json.extras);
          //.  console.log ("bet-update status up", json.extras);
          this.SelectBetControl (this.buttonExtras, this.bet.currency);
          this.msgGameWait = false;
          this.classes.bet_status = "bet_progress";
          this.classes.additional_state = "count_down_bet";
          this.bet.status = false;
          if (this.bet.autobet) {
            this.$store.dispatch ("survival/bbg_autobet", "bbr");
          }
          if (!this.msgGameWait && !this.msgErrorBox) {
            this.msgHistoryBox = false;
          }
          this.bindex = 0;
          // this.eventClearChart ();
          this.$emit ("event_bet_start", big_state_num);
          break;

        //CLOSE_BET
        case 89:
          this.classes.all_bet_buttons = "disabled";
          if (!this.bet.status) {
            this.classes.bet_status = "bet_failure";
          }
          this.classes.additional_state = "deepblue";
          //  this.eventStartChart ();
          this.$emit ("event_close_bet", big_state_num);
          break;
        //COUNT_DOWN
        case 100:
          if (this.bet.status) {
            this.classes.confirm_escape = "";
            this.bet.escaped = false;
          } else {
            this.classes.confirm_escape = "disabled";
          }
          this.classes.all_bet_buttons = "disabled";
          this.classes.additional_state = "";
          this.$emit ("event_game_start", big_state_num);
          break;
        //STOP_ESCAPE
        case 101:
          this.classes.confirm_escape = "disabled";
          this.classes.all_bet_buttons = "disabled";
          this.$store.dispatch ("survival/save_tick", this.ticker_f);
          this.classes.additional_state = "warned";
          // this.bet.status = false;
          //  this.eventKillChart ();
          this.$emit ("event_explode", big_state_num);

          break;

        //START_EXPLOSION_SOUND
        case 6:
          this.status_text = "play sound";
          // this.bet.status = false;
          this.classes.all_bet_buttons = "disabled";
          break;

        //SHOW_RESULT
        case 120:
          this.ticker_f = 0;
          this.bet.bet_amount = 0;
          this.classes.confirm_escape = "disabled";
          this.classes.all_bet_buttons = "disabled";
          this.classes.additional_state = "ready";
          if (!this.msgGameWait && !this.msgErrorBox) {
            this.msgHistoryBox = true;
          }
          // this.eventShowResult ();
          this.$emit ("event_show_result", big_state_num);
          break;
      }
    },
    updateStatus (json) {
      const c = json.s;
      this.update_status = c;
      this.mainLoop (c);
      this.SoundManagementUpdate (c);
      if (c === 88) {
        this.buttonExtras = json.extras;
      }
      if (c !== 100) {
        this.$store.dispatch ("survival/updateTimerCountDown", json.w);
      } else {
        this.$store.dispatch ("survival/updateClearCountDown");
      }
    },
    cannot_bet () {
      const k = this.update_status !== 88 || this.bet.status;
      if (!k) {
        // this.flashErr ("max amount: ");
      }
      return k;
    },
    button_x1 () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.x_1;
      this.betUpdate ()
    },
    button_x2 () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.x_2;
      this.betUpdate ()
    },
    button_x3 () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.x_3;
      this.betUpdate ()
    },
    button_x4 () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.x_4;
      this.betUpdate ()
    },
    doubled () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.bet_amount * 2;
      if (this.bet.bet_amount >= this.get_local_request ()) {
        this.bet.bet_amount = this.get_local_request ();
        //  console.log ("max amount %f: ", this.get_local_request ());
        //  "{0}{1}".format ("{1}", "{0}")
        this.notificationError ("max amount: " + this.get_local_request ());
      }
      this.betUpdate ()
    },
    half () {
      if (this.cannot_bet ()) return;
      this.bet.bet_amount = this.bet.bet_amount / 2;
      if (this.bet.bet_amount < this.bet.bet_min) {
        this.bet.bet_amount = this.bet.bet_min;
      }
      this.betUpdate ();
    },
    betEnter () {
      if (this.cannot_bet ()) return;
      if (this.bet.bet_amount <= 0) {
        this.notificationError ("bet amount cannot be 0.");
        return;
      }
      const jdate = new Date ();
      const packet = {
        Amount : parseFloat (this.bet.bet_amount.toFixed (5)),
        Currency : this.bet.currency,
        Time : jdate,
      };
      EventBus.$emit ("bb_bet", packet);
      this.$emit ("update_bet_enter", packet)
    },
    escapeEnter () {
      if (this.update_status !== 100) return;
      if (this.bet.escaped) return;
      if (!this.bet.status) return;
      EventBus.$emit ("bb_escape", {});
      this.$emit ("bb_escape");
    },
    betUpdate () {
      if (this.bet.bet_amount > 0) {
        this.classes.confirm_bet = "";
      } else {
        this.classes.confirm_bet = "disabled";
      }
      this.SFxAdjustBet ();
    },
    bet_request (json) {
      if (json.code === 1) {
        this.bet.status = true;
        this.classes.all_bet_buttons = "disabled";
        this.classes.bet_status = "bet_success";
        this.SFxStartBet ();
      } else {
        this.bet.status = false;
        if (this.update_status === 88) {
          this.classes.all_bet_buttons = "";
        } else {
          this.classes.all_bet_buttons = "disabled";
        }
        if (json.code === 1314) {
          this.message_notice = "Reached the max betting value, no more.";
        } else if (json.code === 1315) {
          this.message_notice = "Cannot bet now..";
        } else if (json.code === 1317) {
          this.message_notice = "Not enough money for this game..";
        } else if (json.code === 1316) {
          this.message_notice = "Bet amount is not correct.";
        } else if (json.code === 1318) {
          this.message_notice = "Please login.";
          this.msgErrorBox = true;
        } else if (json.code === 1321) {
          this.message_notice = "technical error.";
        } else {
          this.message_notice = "Unknown Error: " + json.code;
        }
        this.notificationError (this.message_notice);
        this.SFXFailure ();
      }
    },
    escape_request (json) {
      if (json.code === 1) {
        this.status_text = "大成功 Success ⭕️";
        this.classes.confirm_escape = "disabled";
        this.bet.escaped = true;
      } else {
        this.SFXFailure ();
        this.status_text = "敗北 Failure ❌";
        if (json.code === 1311) {
          this.notificationError ("You have already escaped. ...");
        } else if (json.code === 1312) {
          this.notificationError ("Cannot escape now ...");
        } else {
          this.notificationError ("Unknown Error: " + json.code);
        }
      }
    },
    exit_game () {
      this.$router.push ("/")
    }
  }
}
