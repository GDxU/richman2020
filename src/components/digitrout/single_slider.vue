<template>
    <div class="flexhitem flex-banner">
        <div class="r-slider-range-control">
            <input type="range" :value="data_val" min="1" max="28"/>
        </div>
    </div>
</template>

<script>
    export default {
        name : "SingleSlider",
        data () {
            return {
                data_val : 13
            }
        },
        mounted () {
            const dat = this;
            document.querySelector ('input[type=range]').addEventListener ('input', function () {
                // this.setAttribute ('value', this.value);
                dat.data_val = this.value;
            });
        },
        methods : {
            getComDataVal () {
                return this.data_val;
            }
        }
    }
</script>
<style scoped lang="scss">
    $root-start-c: #f8f8f8;
    $root-end-c: #ebebeb;
    $root-mid-c: mix($root-start-c, $root-end-c);

    $track-w: 35em;
    $track-u: 1.25em;
    $track-h: 5em;
    $track-bw: .5em;
    $track-iw: $track-w - 2*$track-bw;
    $track-ih: .5em;
    $track-ihr: $track-ih - .0625em;
    $track-ihe: 3*$track-ih + .0625em;
    $track-sho-base-c: #fff;
    $track-bg-base-c: #d7d7d7 #f4f4f4;
    $track-bg-base: linear-gradient(nth($track-bg-base-c, 1),
            nth($track-bg-base-c, 2) 3*$track-ih,
            $track-sho-base-c 3*$track-ih,
            $track-sho-base-c $track-ihe,
            rgba($track-sho-base-c, 0) $track-ihe) border-box;
    $track-bg-base-red: linear-gradient(nth($track-bg-base-c, 1),
            nth($track-bg-base-c, 2)) border-box;
    $track-shi-over-c: #949494 #fcfcfc;
    $track-bg-over-c: #cfcfcf;
    $track-bg-over: linear-gradient(nth($track-shi-over-c, 1),
            $track-bg-over-c .125em,
            $track-bg-over-c $track-ihr,
            nth($track-shi-over-c, 2) $track-ihr,
            nth($track-shi-over-c, 2) $track-ih,
            rgba(nth($track-shi-over-c, 2), 0) $track-ih) padding-box;
    $track-bg-over-red: linear-gradient($track-bg-over-c,
            $track-bg-over-c) padding-box;
    $track-bg-mid-c: #a09e9f;
    $track-bg-mid-hl: #bdf3d1;
    $track-bg-mid-sh: #333;
    $track-bg-mid-base: radial-gradient(circle #{at 50% 50%},
            $track-bg-mid-c .8*$track-ih/2,
            rgba($track-bg-mid-c, 0) $track-ih/2);
    $track-bg-mid-hl: radial-gradient(circle #{at 50% 50%},
            $track-bg-mid-hl .8*$track-ih/2,
            rgba($track-bg-mid-hl, 0) $track-ih/2);
    $track-bg-mid-sh: radial-gradient(circle #{at 50% 75%},
            rgba($track-bg-mid-sh, 0) $track-ih/2,
            $track-bg-mid-sh $track-ih/2 + .125em,
            rgba($track-bg-mid-sh, 0) $track-ih/2 + .125em);
    $track-bg-mid-cover: radial-gradient(circle #{at 50% 50%},
            rgba($root-mid-c, 0) .8*$track-ih/2,
            $root-mid-c $track-ih/2,
            $root-mid-c $track-ih/2 + .125em);
    $track-left: radial-gradient(circle #{at 50% 50%},
            #f3f3f3 $track-ih/2 - .125em, #707070,
            transparent $track-ih/2);

    $thumb-d: 3.5em;
    $thumb-ir: 1.375em;
    $thumb-bg-base: linear-gradient(#fff, #f2f2f2) border-box;
    $thumb-shi-top-c: #e8e8e8;
    $thumb-bg-top-c: #f0f0f0 #fff;
    $thumb-bg-top-v1: radial-gradient(nth($thumb-bg-top-c, 2), nth($thumb-bg-top-c, 1) 65%,
            $thumb-shi-top-c 70%, $thumb-shi-top-c 71%, rgba($thumb-shi-top-c, 0) 71%) content-box;
    $thumb-bg-top-v2: linear-gradient(nth($thumb-bg-top-c, 1), nth($thumb-bg-top-c, 2)) content-box;

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

    @mixin track() {
        box-sizing: border-box;
        border: solid $track-bw transparent;
        width: $track-w;
        height: $track-h;
        box-shadow: 0 1px $track-sho-base-c;
        background: $track-bg-over, $track-bg-base;
        background-size: 100% $track-h - 3*$track-ih;
    }

    @mixin fill() {
        background: $track-left, $track-bg-mid-cover, $track-bg-mid-sh, $track-bg-mid-hl;
        background-repeat: no-repeat, repeat-x, repeat-x, repeat-x;
        background-position: 0 50%;
        background-size: $track-u $track-ih;
    }

    @mixin thumb($flag: false) {
        box-sizing: border-box;
        border: solid 1px rgba(#626262, .32);
        padding: .25em;
        width: $thumb-d;
        height: $thumb-d;
        border-radius: .5em;
        box-shadow: 0 .25em .45em -1px rgba($textcolorglow, .82);
        cursor: ew-resize;

        @if $flag {
            // background: $thumb-bg-base;
            @include buttonoutline();
        } @else {
            // background: $thumb-bg-top-v1, $thumb-bg-base;
            @include buttonoutline();
        }
    }

    @mixin buttonoutline {
        // width: $btnqxxsize;
        // height: $btnqxxsize * 0.8;
        //  cursor: pointer;
        color: $textex;
        // background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        //  line-height: 35px;
        border: 1px $textcolorg solid;
        border-radius: 20%;
        // font-size: 10px;
        // margin: 2px;

        background: linear-gradient(rgba($textcolorg, .62), rgba($textcolorg, .32)) border-box;;
    }

    /* html {
         height: 100%;

     }*/
    .r-slider-range-control {
        margin-bottom: 10px;
        height: 50px;
        width: 100%;
        //  background: linear-gradient($root-start-c, $root-end-c);
        input[type='range'] {
            &,
            &::-webkit-slider-runnable-track,
            &::-webkit-slider-thumb {
                -webkit-appearance: none;
            }

            position: absolute;
            left: 50%;
            padding: 0;
            width: $track-w;
            height: $track-h + .125em;
            transform: translate(-50%, 0%);
            // opacity: .65;
            //  background: $track-bg-mid-cover, $track-bg-mid-sh, $track-bg-mid-base;
            background: $track-bg-mid-sh, $track-bg-mid-base;
            background-repeat: repeat-x;
            background-position: 0 50%;
            background-size: $track-u $track-ih;
            font-size: 0.1em;
            cursor: pointer;

            &::-webkit-slider-runnable-track {
                position: relative;
                width: $track-w;
                height: $track-h;
            }
            &::-moz-range-track {
                @include track();
            }
            &::-ms-track {
                @include track();
                color: transparent;
            }

            &::-moz-range-progress {
                height: $track-h;
                @include fill();
            }

            &::-ms-fill-lower {
                transform: translate(-$track-bw);
                @include fill();
            }

            &::-ms-tooltip {
                display: none;
            }

            &::-webkit-slider-thumb {
                position: relative;
                z-index: 2;
                margin-top: ($track-h - $thumb-d)/2;
                @include thumb(true);
            }
            &::-moz-range-thumb {
                @include thumb();
            }
            &::-ms-thumb {
                @include thumb();
            }

            &::-webkit-slider-runnable-track, /deep/ #track {
                &:before, &:after {
                    box-sizing: border-box;
                    position: absolute;
                    z-index: 1;
                    border: solid $track-bw transparent;
                    border-bottom-width: $track-bw - .125em;
                    width: $track-w;
                    height: 3*$track-ih;
                    border-radius: .375em / .25em;
                    box-shadow: inset 0 -1px rgba(nth($track-shi-over-c, 2), .5),
                    inset 0 1px 1px darken(nth($track-shi-over-c, 1), 5%),
                    0 1px 1px $track-sho-base-c;
                    background: $track-bg-over-red,
                    $track-bg-base-red;
                    left: 0;
                    content: '';
                }
                &:after {
                    bottom: 0;
                }
            }

            &::-webkit-slider-thumb, /deep/ #thumb {
                &:before {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2*$thumb-ir;
                    height: 2*$thumb-ir;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: inset 0 1px 1px #e8e8e8;
                    background: $thumb-bg-top-v2;
                    content: '';
                }
            }

            @for $i from 1 through 28 {
                &[value='#{$i}']::-webkit-slider-runnable-track {
                    $cb: ();
                    $cp: ();

                    @for $j from 0 to $i {
                        $cb: $cb, $track-bg-mid-cover, $track-bg-mid-sh, $track-bg-mid-hl;
                        $cp: $cp, $j*$track-u 50%, $j*$track-u 50%, $j*$track-u 50%;
                    }

                    background: $track-left, $cb;
                    background-position: 0 50%, $cp;
                    background-repeat: no-repeat;
                    background-size: $track-u $track-ih;
                }
            }

            &:focus {
                outline: none;
                // opacity: .99;
            }
        }
    }
</style>