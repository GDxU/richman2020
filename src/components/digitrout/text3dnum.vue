<template>
    <h1 class="big_kj_result" :class="font">{{display_val | fill_zero_5}}</h1>
</template>
<script>
    import animationNumber from "../../mixins/mixin/animationNumber";

    export default {
        name : "TextNum3D",
        props : ["font", "cpuIntensive"],
        mixins : [animationNumber],
        data () {
            return {
                display_val : 0,
            }
        },
        computed : {
            class_report : {
                get () {
                    return this.font + " " + this.cpuIntensive === "false" ? "" : "cpu";
                },
                set () {
                },
            },
        },
        methods : {
            animateDone (a) {
            },
            animateByNewNumber (new_val) {
                this.display_val = new_val;
            },
        }
    }
</script>

<style lang="scss">
    //@import url('https://fonts.googleapis.com/css?family=Kanit:900');

    $primarycolour: #eec509;

    $LIGHTING_FLOOR: 1;
    $LIGHTING_CEIL: 2;
    $LIGHTING_FLAT: 3;

    @mixin text3d($primary, $depth: 5, $shadowsteps: 5, $shadowincrementer: 3px, $shadowopacity: .5, $primaryshadowcolour: #000, $lighting: $LIGHTING_CEIL) {
        $predefinedShadows: (
                0 0 5px rgba($primaryshadowcolour, .05),
                0 -1px 3px rgba($primaryshadowcolour, .2),
                0 3px 5px rgba($primaryshadowcolour, .2));
        $value: ();

        @for $i from 1 through $depth {
            $num: $i + px;
            $hueadjust: $i;
            @if ($lighting == $LIGHTING_FLOOR) {
                $hueadjust: ($i * 2 - $depth - 5) * 1%;
            } @else if ($lighting == $LIGHTING_CEIL) {
                $hueadjust: -($i*2 + $depth - 10) * 1%;
            } @else if ($lighting == $LIGHTING_FLAT) {
                $hueadjust: -$depth * 1%;
            }
            $colour: adjust-color($primary, $lightness: $hueadjust);
            $theShadow: 0 $num 0 $colour;
            $value: append($value, $theShadow, comma);
        }

        @for $i from 1 through $shadowsteps {
            @if ($i >= length($predefinedShadows)) {
                $dist: $i * $shadowincrementer;
                $value: append($value, 0 $dist $dist rgba($primaryshadowcolour, $shadowopacity));
            } @else {
                $value: append($value, nth($predefinedShadows, $i));
            }
        }

        text-shadow: $value;
    }

    $glow_end: #2d64e7;
    $glow_start: white;

    @-webkit-keyframes neon1 {
        from {
            text-shadow: 0 0 10px $glow_start, 0 0 20px $glow_start, 0 0 30px $glow_start, 0 0 70px $glow_end, 0 0 100px $glow_end, 0 0 150px $glow_end;
        }
        to {
            text-shadow: 0 0 5px $glow_start, 0 0 10px $glow_start, 0 0 15px $glow_start, 0 0 35px $glow_end, 0 0 50px $glow_end, 0 0 75px $glow_end;
        }
    }

    @mixin staticFreez() {
        text-shadow: 0 0 10px $glow_start, 0 0 20px $glow_start, 0 0 30px $glow_start, 0 0 70px $glow_end, 0 0 100px $glow_end, 0 0 150px $glow_end;
    }

    @mixin staticWeakFrz() {
        text-shadow: 0 0 10px $glow_start, 0 0 20px $glow_start, 0 0 30px $glow_end;
    }

    @mixin staticWeakTFrz() {
        text-shadow: 0 0 10px $glow_start, 0 0 20px $glow_end;
    }

    h1.big_kj_result {
        color: #FFF;
        font-size: 60px;
        line-height: 1.2em;
        margin: 0;
        position: relative;
        text-align: center;
        transform: translateY(-50%);
        width: 100%;
        z-index: 1;
        height: 88px;
        padding-top: 60px;
        display: inline-block;

        &.LED {
            font-family: "LED", "Source Code Pro";
            font-weight: lighter;
            @include staticWeakFrz();
            font-size: 6.6em;
        }
        &.PS3 {
            font-weight: lighter;
            font-family: "Playstation3";
            @include staticFreez();
        }
        &.PS4 {
            font-weight: lighter;
            font-family: "PlaystationX";
            @include staticWeakFrz();
        }
        &.IED {
            font-family: "IED";
            font-weight: lighter;
            @include text3d(adjust-color($primarycolour, $lightness: -8%),
            $depth: 8,
            $primaryshadowcolour: adjust-color($primarycolour, $lightness: -10%, $saturation: +20%));
        }
        &.TLED {
            font-family: "TLED";
            font-weight: lighter;
            color: #dafffc;
            font-size: 80px;
            @include staticFreez();
        }
        &.LCD7 {
            font-family: "LCD7";
            font-weight: lighter;
            color: #dafffc;
            font-size: 77px;
            @include staticWeakTFrz();
        }
        &.FX-3D {

        }
        &.cpu {
            /*  -webkit-animation: neon1 4.5s ease-in-out infinite alternate;
              -moz-animation: neon1 4.5s ease-in-out infinite alternate;
              animation: neon1 4.5s ease-in-out infinite alternate;*/
        }
    }
</style>