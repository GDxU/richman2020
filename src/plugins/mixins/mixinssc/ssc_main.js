import { EventBus } from "../../EventBus";


const game_line_2 = "第{0}期的投注現正接受, 還有{1}秒📣";
const game_line_3 = "对不起，现在不接受押注。现正等待博彩结果。🎫";
const game_line_4 = "该系统现在处于维护状态。🔧";
const game_line_5 = "票房现已关闭。💤";


String.format = function () {
    if (arguments.length === 0)
        return null;

    let str = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp ("\\{" + (i - 1) + "\\}", "gm");
        str = str.replace (re, arguments[i]);
    }
    return str;
};

String.prototype.format = function (args) {
    let result = this;
    if (arguments.length > 0) {
        if (arguments.length === 1 && typeof (args) === "object") {
            for (let key in args) {
                if (args[key] !== undefined) {
                    let reg = new RegExp ("({" + key + "})", "g");
                    result = result.replace (reg, args[key]);
                }
            }
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    //let reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    let reg = new RegExp ("({)" + i + "(})", "g");
                    result = result.replace (reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
export default {
    layout : "fullplay",
    data () {
        return {
            classes : {
                selection_final : "disabled",
                one_button_bet : "disabled",
            },
            audio : {
                new_game : new Audio ("/media/win_ex_me.mp3"),
                click : new Audio ("https://freesound.org/data/previews/269/269504_3094998-lq.mp3"),
                confm : new Audio ("/media/chip_click_n2.mp3"),
            },
            time_left : 0,
            jk_last : "",
            timer : 0,
            second_line : "",
            bet_lock : true,
            rule_stars : 5,
            testing_mode : false,
        }
    },
    created () {

    },
    destroyed () {
        this.exit_game ();
        EventBus.$off ("padControlUpdate", this.onControlUpdate);
        EventBus.$off ("initsub", this.initUpdate);
        EventBus.$off ("ingamepg", this.signalUpdate);
        EventBus.$off ("ingamekj", this.kjUpdate);
        EventBus.$off ("bet_confirm", this.bet_confirm);
        EventBus.$off ("followBet");
    },
    mounted () {
        const t = this;
        this.$nextTick (() => {
            t.enter_game ();
            EventBus.$on ("initsub", t.initUpdate);
        });
        EventBus.$on ("padControlUpdate", this.onControlUpdate);
    },
    methods : {
        select_complete () {
            let self = this;
            if (self.classes.selection_final !== "disabled") {
                const chip = self.audio.confm;
                chip.currentTime = 0;
                chip.play ();
                /*EventBus.$emit ("submit_lotto_ticket_exec", self.getCurrentBet ());
                self.clearAllSelects ();*/
                EventBus.$emit ("bet_confirm_dialogs", self.getCurrentBet ());
                self.clearAllSelects ();
            }
        },
        getCurrentBet () {
            return {};
        },
        clearAllSelects () {
            const om = this.getCollectionComponents ();
            for (let i = 0; i < 5; i++) {
                om[i].cls ();
            }
            this.check_validate ();
        },
        randomSelect () {
            const coms = this.getCollectionComponents ();
            for (let i = 0; i < this.rule_stars; i++) {
                coms[i].RestoreSelections ([3, 2]);
            }
            this.check_validate ();
        },
        restoreSelect (ticket) {
            // console.log ("check ticket", ticket);
            if (ticket === undefined) return;
            this.rule_stars = parseInt (ticket.rules[0].split ("-")[1]);
            const coms = this.getCollectionComponents ();
            for (let i = 0; i < this.rule_stars; i++) {
                const vi = i + 1;
                const llis = ticket["g" + vi];
                const arList = llis.map ((a, i, arr) => {
                    return parseInt (a)
                });
                // console.log ("check ticket -o", llis);
                //  console.log ("check ticket -p", arList);
                coms[i].RestoreSelections (arList);
            }
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
            return true;
        },
        getCollectionComponents () {
            return [];
        },
        onControlUpdate (e) {
            let self = this;
            self.check_validate ();
            if (self.audio.click !== undefined) {
                const chip = self.audio.click;
                chip.currentTime = 0;
                chip.play ();
            }
        },
        resetTimer () {
            this.time_left = this.$store.state.kaijiang.count_down;
            this.jk_last = parseInt (this.$store.state.kaijiang.kj_period_n);
            this.jk_next = this.jk_last + 1;

            if (this.testing_mode) {
                //testing is now up..
                this.time_left = Math.abs (this.time_left);
            }
            clearInterval (this.timer);
            this.timer = setInterval (() => {
                this.time_left--;
                if (this.time_left > 0) {
                    this.bet_lock = false;
                    this.second_line = game_line_2.format (this.jk_last, this.time_left)
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
                    this.time_left = this.$store.state.kaijiang.count_down;
                    if (this.testing_mode) {
                        //testing is now up..
                        this.time_left = Math.abs (this.time_left);
                    }
                    this.resetTimer ();
                    break;
            }
        },
        ruleStarChange (n) {
            const coms = this.getCollectionComponents ();
            for (let i = 0; i < 5; i++) {
                if (i >= n) {
                    coms[i].cls ()
                }
            }
            this.rule_stars = n;
        },
        covernewgame () {
            if (this.audio.new_game !== undefined) {
                const chip = this.audio.new_game;
                chip.currentTime = 0;
                chip.play ();
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
        enter_game () {
            this.$store.dispatch ("subGame", "sub_cqssc")
        },
        exit_game () {
            clearInterval (this.timer);
            this.$store.dispatch ("unsubGame", "unsub_cqssc")
        }
    }
}

