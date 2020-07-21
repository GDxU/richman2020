<template>
    <div class="container_adjust_buy">
        <div class="sl_num">
            <span>共{{bet_times}}注,</span>
            <br/>
            <span>共{{amount_bet | fix3}}元</span>
            <br/>
            <span>奖金: 0000</span>
        </div>

        <div class="wrapper_number_adjust">
            <input type="number" value="" v-model="factor_base"/>
            <span class="input-button add" @click="add" @touch="add">+</span>
            <span class="input-button remove" @click="remove" @touch="remove">-</span>
        </div>

        <div class="wrapper_currency_size">
            <article class="bet_coin_size">
                <div @click="chMsize1" :class="mSize===1?'active':''">元</div>
                <div @click="chMsize2" :class="mSize===2?'active':''">角</div>
                <div @click="chMsize3" :class="mSize===3?'active':''">分</div>
                <div @click="chMSizeFomo">S</div>
            </article>
            <article class="bet_star_cai">
                <div @click="chStar1" :class="mRuleStar===1?'active':''">個</div>
                <div @click="chStar2" :class="mRuleStar===2?'active':''">十</div>
                <div @click="chStar3" :class="mRuleStar===3?'active':''">百</div>
                <div @click="chStar4" :class="mRuleStar===4?'active':''">千</div>
                <div @click="chStar5" :class="mRuleStar===5?'active':''">万</div>
            </article>
        </div>
        <!--<div class="infos_ecex">
            Try to shift + click
        </div>-->
    </div>
</template>

<script>


    import { EventBus } from '../../plugins/EventBus'


    export default {
        name : "number_adjust",
        data () {
            return {
                each_bet : 2,
                factor_base : 1,
                bet_times : 0,
                mSize : 1,
                mRuleStar : 5,
                sflic : new Audio ("/media/334302__sojan__coinflic6.mp3"),
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
        /*    destroyed () {

            },*/
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
                        return 1;
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
            chStar1 () {
                this.starUpdate (1);
            },
            chStar2 () {
                this.starUpdate (2);
            },
            chStar3 () {
                this.starUpdate (3);
            },
            chStar4 () {
                this.starUpdate (4);
            },
            chStar5 () {
                this.starUpdate (5);
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
                this.$emit ("chMSizeFomo");
            },
            moneySizeUpdate (n) {
                this.mSize = n;
                this.play_coin ();
            },
            starUpdate (n) {
                this.mRuleStar = n;
                this.play_coin ();
                this.$emit ("changeStarRu", n);
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
    $btnqxxsize: 30px;
    $star_button_size: 20px;
    @mixin money_size {

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        width: $btnqxxsize;
        height: $btnqxxsize;
        cursor: pointer;
        color: #544216;
        background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 30px;
        border: 1px #b8a341 solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    .container_adjust_buy {
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
                font-size: 8px;
            }
            input {
                height: 54px;
                background: #FFFFFF;
                border: 1px solid #E3E3E3;
                border-radius: 4px 0 0 4px;
                font-size: 20px;
                color: #434343;
                text-align: center;
                width: calc(100% - 27px);
                font-weight: bold;
            }

            .input-button {
                position: absolute;
                height: 27px;
                width: 27px;
                border: 1px solid #E3E3E3;
                color: #E3E3E3;
                text-align: center;
                line-height: 22px;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background: #FAFAFA;
            }

            .input-button:hover {
                background: #b7b7b7;
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

                &.bet_coin_size {
                    div {
                        list-style: none;
                        cursor: pointer;
                        flex-wrap: nowrap;
                        @include money_size;
                        &.active {
                            background: linear-gradient(to bottom, #d2cc86 0%, #a28b2a 100%);
                            text-shadow: #fff -0.7px 1.7px 1.1em;
                            color: yellow;
                        }
                    }

                }
                &.bet_star_cai {
                    div {
                        list-style: none;
                        cursor: pointer;
                        flex-wrap: nowrap;
                        @include money_size;
                        border-radius: 5%;
                        width: $star_button_size;
                        height: $star_button_size;
                        line-height: 20px;
                        &.active {
                            background: linear-gradient(to bottom, #d2cc86 0%, #a28b2a 100%);
                            text-shadow: #fff -0.7px 1.7px 1.1em;
                            color: yellow;
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