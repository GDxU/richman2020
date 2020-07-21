<template>
    <div class="ice-bet-ctl flexhitem flex-banner">
        <div class="container_adjust_buy">
            <div class="sl_num">
                <span>共{{bet_times}}注,</span>
                <br/>
                <span>共{{amount_bet | fix3}}元</span>
                <br/>
                <span>奖金: {{prize_big}}</span>
            </div>
            <div class="wrapper_number_adjust">
                <input type="number" value="" v-model="factor_base"/>
                <span class="input-button add" @click="add" @touch="add">+</span>
                <span class="input-button remove" @click="remove" @touch="remove">-</span>
            </div>
            <div class="wrapper_currency_size">
                <article class="bbt_coi_3k">
                    <div @click="chMsize1" :class="mSize===1?'active':''">元</div>
                    <div @click="chMsize2" :class="mSize===2?'active':''">角</div>
                    <div @click="chMsize3" :class="mSize===3?'active':''">分</div>
                    <div @click="chMSizeFomo">R</div>
                </article>
                <article class="bet_under_way_x">
                    <div @click="takeBetFactor" :class="factor_base===10?'active':''">10</div>
                    <div @click="takeBetFactor" :class="factor_base===50?'active':''">50</div>
                    <div @click="takeBetFactor" :class="factor_base===100?'active':''">100</div>
                    <div @click="takeBetFactor" :class="factor_base===200?'active':''">200</div>
                    <div @click="takeBetFactor" :class="factor_base===500?'active':''">500</div>
                </article>
            </div>
        </div>
    </div>
</template>
<script>
    import { EventBus } from '../../plugins/EventBus'

    export default {
        name : "ice-bet-control",
        data () {
            return {
                each_bet : 2,
                factor_base : 1,
                bet_times : 1,
                mSize : 1,
                mJco : 5,
                prize_big : 0,
                sflic : new Audio ("/media/ji390290923.wav"),
            }
        },
        computed : {
            amount_bet : {
                get () {
                    return this.bet_times * this.each_bet * this.factor_base * this.convertedFactorMoneySize ()
                },
                set () {
                }
            }
        },
        methods : {
            update_bets (arr_x) {
                var fv = 1;
                for (var i = 0; i < arr_x.length; i++) {
                    var nx = parseInt (arr_x[i]);
                    if (nx > 0)
                        fv = fv * nx;
                }
                this.bet_times = fv;
            },
            convertedFactorMoneySize () {
                switch (this.mSize) {
                    case 1:
                        return 1;
                    case 2:
                        return 0.1;
                    case 3:
                        return 0.01;
                    default:
                        return 0.00;
                }
            },
            getAmountBet () {
                return this.amount_bet
            },
            getFactor () {
                return this.factor_base;
            },
            getCurrentBetSize () {
                return this.bet_times;
            },
            Valid () {
                return this.factor_base >= 1;
            },
            add (e) {
                this.factor_base++;
                this.updatef ();
            },
            remove () {
                if (this.factor_base > 1) {
                    this.factor_base--;
                }
                this.updatef ();
            },
            chMsize1 () {
                this.moneySizeUpdate (1);
            },
            chMsize2 () {
                this.moneySizeUpdate (2);
            },
            chMsize3 () {
                this.moneySizeUpdate (3);
            },
            chMSizeFomo () {
                this.$emit ("chBetRandom");
            },
            takeBetFactor (e) {
                const factor = e.target.innerText;
                this.factor_base = parseInt (factor);
                this.$emit ("chFactor");
            },
            moneySizeUpdate (n) {
                this.mSize = n;
                this.play_coin ();
            },
            starUpdate (n) {
                this.mJco = n;
                this.play_coin ();
            },
            play_coin () {
                const chip = this.sflic;
                chip.currentTime = 0;
                chip.play ();
            },
            updatef () {
                EventBus.$emit ("padControlUpdate", {
                    number_factor : this.factor_base,
                    enabled : this.Valid (),
                });
            }
        }
    }
</script>
<style lang="scss" scoped>

    $byall: #cccccc;
    $bycolor: #474747;
    $blight: #feff20;
    $blight1: #96d4ff;
    $blight2: #ff9446;
    $textex: #dafffc;
    $textcolorg: #6db7c1;
    $textcolorglow: #93f2ff;
    $textcolordark: #385c70;
    $btn_box_height: 10px;
    $btnxxsize: 40px;
    $btnqxxsize: 44px;
    $btnqbnsize: 35px;
    $btnqbdsize: 30px;
    $star_button_size: 20px;

    @mixin buttoncontrol {

        width: $btnqxxsize;
        height: $btnqxxsize * 0.8;
        cursor: pointer;
        color: #0a2e38;
        background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 38px;
        border: 1px #b8a341 solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    @mixin buttonoutline($width) {
        width: $width;
        height: $width * 0.7;
        cursor: pointer;
        color: $textex;
        // background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 25px;
        border: 1px $textcolorg solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    @mixin buttonhollow($width) {
        width: $width;
        height: $width * 0.7;
        cursor: pointer;
        color: $textex;
        // background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 26px;
        border: 1px $textcolorglow solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
        box-shadow: 0px 0px 8px 1px $blight1;
    }

    @mixin money_size {

        width: $btnqbnsize;
        height: $btnqbnsize * 0.7;

        cursor: pointer;
        color: #544216;
        background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 30px;
        border: 1px #b8a341 solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    @mixin adjustment_tuning_ui($a,$b,$c) {
        border: 1px solid $a;
        color: $b;
        text-align: center;
        background: $c;
    }

    .container_adjust_buy {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        display: flex;
        flex-wrap: nowrap;
        .sl_num {
            order: 1;
            width: 88px;
            font-size: 10px;
            text-align: right;
            flex: 1;
        }
        .wrapper_number_adjust {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            order: 2;
            flex: 1;
            position: relative;
            height: 54px;
            width: 100px;
            &:after {
                content: "x倍";
                position: absolute;
                bottom: 6px;
                left: 15px;
                width: calc(100% - 27px);
                text-align: center;
                color: #f11e23;
                text-shadow: 0px 0px 1px red;
                font-size: 8px;
            }

            input {
                height: 54px;
                border-radius: 4px 0 0 4px;
                font-size: 20px;
                width: calc(100% - 27px);
                font-weight: bold;
                @include adjustment_tuning_ui($textcolorg, $textcolordark, $textex);
            }

            .input-button {
                position: absolute;
                height: 27px;
                width: 27px;
                line-height: 22px;
                right: -6px;
                cursor: pointer;
                @include adjustment_tuning_ui($textcolorg, $textcolordark, $textex);
            }

            .input-button:hover {
                background: #344f7b;
            }

            .input-button.add {
                top: 0;
                border-radius: 0 4px 0 0;
                border-bottom: none;
            }

            .input-button.remove {
                bottom: 0;
                border-radius: 0 0 4px 0;
            }

            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type=number] {
                -moz-appearance: textfield;
                font-family: "Roboto", sans-serif;
            }

        }
        .wrapper_currency_size {
            order: 3;
            flex: 3;
            position: relative;
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            height: 100%;

            article {
                display: flex;

                &.bbt_coi_3k {
                    div {
                        list-style: none;
                        cursor: pointer;
                        flex-wrap: nowrap;
                        @include buttonoutline($btnqbnsize);
                        &.active {
                            @include buttonhollow($btnqbnsize);
                        }
                    }

                }
                &.bet_under_way_x {
                    div {
                        list-style: none;
                        cursor: pointer;
                        flex-wrap: nowrap;
                        @include buttonoutline($btnqbdsize);
                        line-height: 20px;
                        &.active {
                            @include buttonhollow($btnqbdsize);
                            line-height: 20px;
                        }
                    }
                }
            }
        }
    }

    .infos_ecex {
        margin-top: 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }
</style>