<template>
    <div class="gbet flexhitem flex-banner">
        <div class="rcontrollist">
            <div class="qqt">
                <div class="qbnn" @click="bbg" :class="lastbtn === 'big'?'active':''">大</div>
            </div>
            <div class="qqt">
                <div class="qbnn" @click="bsmall" :class="lastbtn === 'small'?'active':''">小</div>
            </div>
            <div class="qqt">
                <div class="qbnn" @click="bodd" :class="lastbtn === 'odd'?'active':''">奇</div>
            </div>
            <div class="qqt">
                <div class="qbnn" @click="beven" :class="lastbtn === 'even'?'active':''">偶</div>
            </div>
            <div class="qqt">
                <div class="qbnn" @click="cls">清</div>
            </div>
        </div>
    </div>
</template>
<script>
    //  import Number_adjust from "../../components/digitrout/number_adjust";
    import { EventBus } from '../../plugins/EventBus'

    function array_removeAt (index) {
        var i;
        if (index < this.length) {
            for (i = index; i < this.length - 1; i++) {
                this[i] = this[i + 1];
            }
            this.length = this.length - 1;
        }
    }

    Array.prototype.removeAt = array_removeAt;

    export default {
        name : "MaxMinControl",
        //  props : ['label'],
        //  components:{Number_adjust},
        data () {
            return {
                lastbtn : "cls"
            }
        },
        methods : {
            ResultInput () {
                if (this.lastbtn === "") {
                    return [];
                } else {
                    return [this.lastbtn];
                }
            },
            RestoreSelections (arr) {
                // console.log ("check arr", arr);
                if (arr == undefined) return;
                this.lastbtn = arr[0];
            },
            IsFilled () {
                return this.lastbtn !== "cls" ;
            },
            display_ui () {
                this.$emit ("BetControlUpdate", this.lastbtn);
            },
            randomSelectX () {
                const list = ["even", "odd", "small", "big", "small"];
                const hvalue = Math.floor (Math.random () * list.length);
                this.lastbtn = list[hvalue];
            },
            beven () {
                this.lastbtn = "even";
                this.display_ui ();
            },
            bodd () {
                this.lastbtn = "odd";
                this.display_ui ();
            },
            bsmall () {
                this.lastbtn = "small";
                this.display_ui ();
            },
            bbg () {
                this.lastbtn = "big";
                this.display_ui ();
            },
            cls () {
                this.lastbtn = "cls";
                this.display_ui ();
            },
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
    $btn_box_height: 10px;
    $btnxxsize: 40px;
    $btnqxxsize: 44px;

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

    @mixin buttonoutline {
        width: $btnqxxsize;
        height: $btnqxxsize * 0.8;
        cursor: pointer;
        color: $textex;
        // background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 35px;
        border: 1px $textcolorg solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    @mixin buttonhollow {

        width: $btnqxxsize;
        height: $btnqxxsize * 0.8;
        cursor: pointer;
        color: $textex;
        // background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 38px;
        border: 1px $textcolorglow solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;

        box-shadow: 0px 0px 8px 1px $blight1;

    }

    .gbet {
        flex-wrap: nowrap;
        display: -webkit-flex; /* Safari */
        display: flex;
        margin: 10px;
        flex-direction: row;

        .rcontrollist {
            flex-wrap: nowrap;
            display: -webkit-flex; /* Safari */
            display: flex;
            margin: 10px auto;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            .qqt {
                height: 100%;
                display: contents;
                .qbtn {
                    flex-wrap: wrap;
                    @include buttoncontrol;
                    &.active {
                        background: linear-gradient(to bottom, #d2cc86 0%, #a28b2a 100%);
                        text-shadow: #fff -0.7px 1.7px 1.1em;
                        color: yellow;
                    }
                }

                .qbnn {
                    flex-wrap: wrap;
                    @include buttonoutline;
                    &.active {
                        @include buttonhollow;
                        //background: linear-gradient(to bottom, #d2cc86 0%, #a28b2a 100%);
                        text-shadow: #fff -0.7px 1.7px 1.1em;
                        color: white;
                    }
                }

            }

        }
    }

</style>