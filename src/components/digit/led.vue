<template>
    <div ref="block_collections" class="digital_single" :class="class_coll">
        <div class="light-row 1st-row">
            <div class="light light-on" id="light_00"></div>
            <div class="light light-on" id="light_01"></div>
            <div class="light light-on" id="light_02"></div>
        </div>
        <div class="light-row 2nd-row">
            <div class="light light-on" id="light_03"></div>
            <div class="light light-on" id="light_04"></div>
        </div>
        <div class="light-row 3rd-row">
            <div class="light light-on" id="light_05"></div>
            <div class="light light-on" id="light_06"></div>
            <div class="light light-on" id="light_07"></div>
        </div>
        <div class="light-row 4th-row">
            <div class="light light-on" id="light_08"></div>
            <div class="light light-on" id="light_09"></div>
        </div>
        <div class="light-row 5th-row">
            <div class="light light-on" id="light_10"></div>
            <div class="light light-on" id="light_11"></div>
            <div class="light light-on" id="light_12"></div>
        </div>
    </div>
</template>

<script>

    const digitForms = [
        //0
        [true, true, true, true, true, true, false, true, true, true, true, true, true],
        // 1
        [false, false, true, false, true, false, false, true, false, true, false, false, true],
        // 2
        [true, true, true, false, true, true, true, true, true, false, true, true, true],
        // 3
        [true, true, true, false, true, true, true, true, false, true, true, true, true],
        // 4
        [true, false, true, true, true, true, true, true, false, true, false, false, true],
        // 5
        [true, true, true, true, false, true, true, true, false, true, true, true, true],
        // 6
        [true, true, true, true, false, true, true, true, true, true, true, true, true],
        // 7
        [true, true, true, false, true, false, false, true, false, true, false, false, true],
        // 8
        [true, true, true, true, true, true, true, true, true, true, true, true, true],
        // 9
        [true, true, true, true, true, true, true, true, false, true, true, true, true]
    ];


    export default {
        name : "Led",
        props : ["mode", "display", "color_x"],
        data () {
            return {
                n : 0,
                elones : [],
                ellight : [],
                class_coll : {
                    red : false,
                    blue : false,
                    green : false,
                    light : false,
                    trancend_color : true,
                },
                LED_flash_timer : 0,
            }
        },
        mounted () {
            this.$nextTick (() => {
                this.ellight = this.$refs.block_collections.getElementsByClassName ('light');
                this.elones = this.$refs.block_collections.getElementsByClassName ('light');
                //console.log (this.$refs.block_collections.getElementsByClassName ('light'));
            });
            clearInterval (this.LED_flash_timer);
        },
        destroyed () {
            clearInterval (this.LED_flash_timer);
        },
        watch : {
            display (value) {
                if (typeof (value) !== 'number') return;
                if (value > 0) {
                    this.showNumber ();
                }
            },
            mode (arg) {
                if (typeof (value) !== 'string') return;
                switch (arg) {
                    case "flash":
                        this.ModeLoopFlash ();
                        break;

                    case "flash3Sec":
                        this.ModeFlash3Seconds ();
                        break;

                    default:
                        this.flashAllOff ();
                        break;
                }
            },
            color_x (color_code) {
                switch (color_code) {
                    case "red":

                        this.class_coll.red = true;
                        this.class_coll.blue = false;
                        this.class_coll.green = false;
                        this.class_coll.light = false;
                        break;

                    case "green":

                        this.class_coll.red = false;
                        this.class_coll.blue = false;
                        this.class_coll.green = true;
                        this.class_coll.light = false;
                        break;

                    case "blue":

                        this.class_coll.red = false;
                        this.class_coll.blue = true;
                        this.class_coll.green = false;
                        this.class_coll.light = false;
                        break;

                    case "light":

                        this.class_coll.red = false;
                        this.class_coll.blue = false;
                        this.class_coll.green = false;
                        this.class_coll.light = true;
                        break;

                    default:

                        this.class_coll.red = false;
                        this.class_coll.blue = false;
                        this.class_coll.green = false;
                        this.class_coll.light = false;
                        break;
                }
            }
        },
        methods : {
            offLight () {
                for (var i = 0; i < this.ellight.length; i++) {
                    this.ellight[i].classList.remove ('light-on');
                }
            },
            getAllLightOnEls () {
                return this.$refs.block_collections.getElementsByClassName ('light-on');
            },
            updateNumber (val) {
                this.n = val % 10;
                this.offLight ();
                this.showNumber ();
            },
            showNumber () {
                var m1 = digitForms[this.n];
                for (var i = 0; i < m1.length; i++) {
                    if (m1[i] === true) {
                        this.elones[i].classList.toggle ('light-on');
                    }
                }
            },
            flashAll () {
                let el = this.getAllLightOnEls ();
                for (let i = 0; i < el.length; i++) {
                    let elel = el[i];
                    elel.classList.toggle ("great");
                }
            },
            flashAllOff () {
                let el = this.getAllLightOnEls ();
                for (let i = 0; i < el.length; i++) {
                    let elel = el[i];
                    elel.classList.remove ("great");
                }
            },
            //the real actual interactions
            ModeLoopFlash () {
                this.LED_flash_timer = setInterval (() => {
                    this.flashAll ();
                }, 850);
            },
            ModeFlash3Seconds () {
                this.LED_flash_timer = setInterval (() => {
                    this.flashAll ();
                }, 50);

                setTimeout (() => {
                    clearInterval (this.LED_flash_timer);
                    this.flashAllOff ();
                }, 3000);
            },
        }
    }
</script>
<style scoped lang="scss">
    $light-size: 40px;
    $w-col: 132px;
    $space: 5px;
    $glow_start_Led: #c5f1ff;
    $glow_end_Led: rgba(2, 81, 212, 0.89);
    @mixin staticWeakFreeez() {
        text-shadow: 0 0 10px $glow_start_Led, 0 0 20px $glow_start_Led, 0 0 30px $glow_end_Led;
    }

    .digital_single {
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin: $space;

        &.trancend_color .light {
            transition-property: background-color;
            transition-duration: 0.1s;
            transition-timing-function: linear;
            transition-delay: 0s;
        }

        &.red {
            .light {
                background-color: #540707;
            }
            .light-on {
                background-color: #9e897d;
                &.great {
                    background-color: #e79d7d;
                    @include staticWeakFreeez();
                }
            }

        }

        &.green {
            .light {
                background-color: #214e21;
            }
            .light-on {
                background-color: #22b12a;
                &.great {
                    background-color: #77ed95;
                    @include staticWeakFreeez();
                }
            }
        }

        &.blue {
            .light {
                background-color: #20274e;
            }
            .light-on {
                background-color: #6fc1f6;
                &.great {
                    background-color: #97ebff;
                    @include staticWeakFreeez();
                }
            }
        }

        .light {
            height: $light-size;
            width: $light-size;
            margin: 2px;
            border-radius: 5px;
            background-color: rgba(25, 25, 23, 0.76);
        }

        .light-on {
            background-color: #d2d2ca;
        }

        .light-row {
            display: flex;
            flex-direction: row;
            width: $w-col;
            margin: 0;
            padding: 0;
            justify-content: space-between;
        }
    }
</style>