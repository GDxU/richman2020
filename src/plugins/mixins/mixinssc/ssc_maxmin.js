import { EventBus } from "../../EventBus";

String.format = function () {
    if (arguments.length === 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp ('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace (re, arguments[i]);
    }
    return str;
};

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp ("({" + key + "})", "g");
                    result = result.replace (reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp ("({)" + i + "(})", "g");
                    result = result.replace (reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

const game_line_2 = "第{0}期的投注現正接受, 還有{1}秒📣";
const game_line_3 = "对不起，现在不接受押注。现正等待博彩结果。🎫";
const game_line_4 = "该系统现在处于维护状态。🔧";
const game_line_5 = "票房现已关闭。💤";

export default {
    layout : "fullplay",
    data () {
        return {
            classes : {
                selection_final : "disabled",
                one_button_bet : "disabled",
            },
            audio : {
                click : new Audio ("/media/ji390290923.wav"),
                confm : new Audio ("/media/chip_click_n2.mp3"),
                random : new Audio ("/media/poker_deal_star.mp3"),
                new_game : new Audio ("/media/win_ex_me.mp3"),
            },
            time_left : 0,
            jk_last : 0,
            jk_next : 0,
            ssc_gameplay_timer : 0,
            second_line : "---",
            bet_lock : true,
            rule_stars : 5,
            testing_mode : false,
        }
    },
    computed : {},
    watch : {},
    methods : {
        select_complete () {
            let self = this;
            if (self.classes.selection_final !== "disabled") {
                const chip = self.audio.confm;
                chip.currentTime = 0;
                chip.play ();
                EventBus.$emit ("bet_confirm_dialogs", self.getCurrentBet ());
                self.clearAllSelects ();
            }
        },
        getCurrentBet () {
            return {
                g1 : this.$refs.xDownCtl.ResultInput (),
                g2 : [],
                g3 : [],
                g4 : [],
                g5 : [],
                kjid : String (this.jk_last + 1),
                srcid : "cqssc",
                timestamp : (new Date).toISOString (),
                base : this.$refs.xBetIce.convertedFactorMoneySize (),
                rules : ["simple-a"],
                bets : this.$refs.xBetIce.getCurrentBetSize (),
                factor : this.$refs.xBetIce.getFactor (),
                amount : this.$refs.xBetIce.getAmountBet (),
                testing_mode : false,
            }
        },
        clearAllSelects () {
            this.check_validate ();
        },
        factorchange () {
            this.playclick ();
        },
        randomSelect () {
            this.$refs.xDownCtl.randomSelectX ();
            this.randclick ();
            this.check_validate ();
        },
        betUpdate (n) {
            this.playclick ();
            this.check_validate ();
        },
        restoreSelect (ticket) {

        },
        auto_one_btn () {
            let self = this;
            if (self.audio.confirm !== undefined) {
                if (self.classes.one_button_bet !== "disabled") {
                    const chip = this.audio.confm;
                    chip.currentTime = 0;
                    chip.play ();
                }
            }
        },
        check_validate () {
            const a = this.$refs.xDownCtl.IsFilled ();
            const b = this.$refs.xBetIce.getAmountBet ();
            const ok = a && b > 0 && !this.bet_lock;
            if (ok) {
                this.classes.selection_final = "";
            } else {
                this.classes.selection_final = "disabled";
            }
            return ok;
        },
        playclick () {
            if (this.audio.click !== undefined) {
                const chip = this.audio.click;
                chip.currentTime = 0;
                chip.play ();
            }
        },
        randclick () {
            if (this.audio.random !== undefined) {
                const chip = this.audio.random;
                chip.currentTime = 0;
                chip.play ();
            }
        },
        covernewgame () {
            if (this.audio.new_game !== undefined) {
                const chip = this.audio.new_game;
                chip.currentTime = 0;
                chip.play ();
            }
        },
        onControlUpdate (e) {
            this.check_validate ();
            this.playclick ();
        },
        resetTimer () {
            this.time_left = this.$store.state.kaijiang.count_down;
            this.jk_last = parseInt (this.$store.state.kaijiang.kj_period_n);
            this.jk_next = this.jk_last + 1;

            if (this.testing_mode) {
                //testing is now up..
                this.time_left = Math.abs (this.time_left);
            }

            clearInterval (this.ssc_gameplay_timer);
            this.ssc_gameplay_timer = setInterval (() => {
                this.time_left--;
                if (this.time_left > 0) {
                    this.bet_lock = false;
                    this.second_line = game_line_2.format (this.jk_next, this.time_left)
                } else {
                    this.bet_lock = true;
                    this.second_line = game_line_3;
                    this.check_validate ();
                }
            }, 1000);
        },
        determine_status (status_) {
            switch (status_) {
                case 0:
                    this.second_line = game_line_3;
                    this.bet_lock = true;
                    this.check_validate ();
                    break;
                case 2:
                    this.second_line = game_line_4;
                    this.bet_lock = true;
                    this.check_validate ();
                    break;
                case 3:
                    this.second_line = game_line_5;
                    this.bet_lock = true;
                    this.check_validate ();
                    break;
                case 1:
                    this.resetTimer ();
                    break;
            }
        },
        signalUpdate () {
            console.log ("received in game signal");
        },
        initUpdate () {
            console.log ("initUpdate in game signal");
        },
        kjUpdate () {
            console.log ("kjUpdate in update now.");
        },
        bet_confirm () {

        },
    },
    mounted () {
        const t = this;
        this.$nextTick (() => {
            //t.$store.dispatch ("subGame", "sub_cqssc");
            EventBus.$on ("initsub", t.initUpdate);
        });
        EventBus.$on ("BetControlUpdate", this.onControlUpdate);
    },
    destroyed () {
        EventBus.$off ("BetControlUpdate", this.onControlUpdate);
        EventBus.$off ("initsub", this.initUpdate);
        EventBus.$off ("ingamepg", this.signalUpdate);
        EventBus.$off ("ingamekj", this.kjUpdate);
        EventBus.$off ("bet_confirm", this.bet_confirm);
        EventBus.$off ("followBet");
        clearInterval (this.ssc_gameplay_timer);
       // this.$store.dispatch ("unsubGame", "unsub_cqssc")
    },
    created () {
    }
}
