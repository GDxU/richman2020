<template>
    <div class="align-bottom">
        <div class="flip-clock">
            <div class="symbol" data-speed="5">
                <div class="value">
                    0
                    <div class="flip flip--next">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--last">
                        <div class="ticker"></div>w
                    </div>
                    <div class="flip flip--current-front">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-back">
                        <div class="ticker"></div>
                    </div>
                </div>
            </div>
            <div class="symbol" data-speed="4">
                <div class="value">
                    0
                    <div class="flip flip--next">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--last">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-front">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-back">
                        <div class="ticker"></div>
                    </div>
                </div>
            </div>
            <div class="symbol" data-speed="3">
                <div class="value">
                    0
                    <div class="flip flip--next">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--last">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-front">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-back">
                        <div class="ticker"></div>
                    </div>
                </div>
            </div>

            <div class="symbol" data-speed="2">
                <div class="value">
                    0
                    <div class="flip flip--next">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--last">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-front">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-back">
                        <div class="ticker"></div>
                    </div>
                </div>
            </div>
            .
            <div class="symbol" data-speed="1">
                <div class="value">
                    0
                    <div class="flip flip--next">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--last">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-front">
                        <div class="ticker"></div>
                    </div>
                    <div class="flip flip--current-back">
                        <div class="ticker"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name : "FlipCounter",
        methods : {
            load_fp () {

            },
        },
        mounted : function () {
            let self = this;
            this.$nextTick (self.load_fp);
        }
    }
</script>
<style lang="scss">
    $time: 10*150ms; // 10 numbers 150ms flip each
    $time-step: $time / 10;
    $frame-size: 1em;
    $step-frame: $frame-size / 10;

    @mixin prepare-frame-step($speed: 1) {
        $fixed-step: $time-step * $speed;
        .ticker::after {
            content: '0 \a 1 \a 2 \a 3 \a 4 \a 5 \a 6 \a 7 \a 8 \a 9';
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            animation: frame $time steps(10, end) infinite;
            animation-duration: $time * $speed
        }

        &--next {
            .ticker::after {
                animation-delay: - $fixed-step / 2;
            }
        }

        &--last {
            .ticker::after {
                animation-delay: $fixed-step;
            }
        }
        &--current-front,
        &--current-back {
            .ticker::after {
                animation-delay: 0;
            }
        }
    }

    @mixin prepare-flip($speed: 1) {
        $fixed-step: $time-step * $speed;

        &--next {
            z-index: 1;
            height: 0.5em;
            overflow: hidden;
        }

        &--last {
            top: 0.5em;
            height: 0.5em;
            overflow: hidden;

            .ticker {
                top: -0.5em;
            }
        }

        &--current-front,
        &--current-back {
            overflow: hidden;
            z-index: 2;
            transform-origin: 50% 100%;
            height: 0.5em;
        }

        &--current-front {
            box-shadow: 0 0 8px 0 rgba(53, 222, 255, .7);
            animation: ease-in $fixed-step flip-front infinite;
        }

        &--current-back {
            .ticker {
                transform: rotateX(-180deg);
            }
            transform: rotateX(-90deg);
            animation: ease-out $fixed-step flip-back infinite;
            animation-delay: $fixed-step;
        }
    }

    .flip-clock {
        display: flex;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: bold;
        margin: 0 auto;
        position: relative;
        font-size: 50px;
        transform: translateZ(0);

        &::after {
            content: '';
            display: block;
        }

    }

    .symbol {
        position: relative;
        display: block;
        padding: 5px 10px;
    }

    .value {
        //transform: rotateY(5deg);
        color: transparent;
        perspective: 200px;
        transform-style: preserve-3d;
    }

    .ticker {
        position: relative;
        font-size: 1em;
        height: 1em;
        line-height: 1em;
        text-align: center;
        overflow: hidden;
    }

    // flip - 1/4 of card
    .flip {
        box-shadow: 0 0 8px 0 rgba(53, 222, 255, .7);
        color: #fff;
        background-color: #145d90;
        text-shadow: 0 0 6px #41c7ff;
        top: 0px;
        left: -5px; // hack for paddings
        right: -5px;
        position: absolute;
        outline: 1px solid #35deff;

    }

    .symbol[data-speed="1"] .flip {
        @include prepare-flip(2);
        @include prepare-frame-step(2);
    }

    .symbol[data-speed="2"] .flip {
        @include prepare-flip(10);
        @include prepare-frame-step(10);
    }

    .symbol[data-speed="3"] .flip {
        @include prepare-flip(20);
        @include prepare-frame-step(20);
    }

    .symbol[data-speed="4"] .flip {
        @include prepare-flip(50);
        @include prepare-frame-step(50);
    }

    .symbol[data-speed="5"] .flip {
        @include prepare-flip(55);
        @include prepare-frame-step(55);
    }

    @keyframes frame {
        to {
            transform: translateY(-10em);
        }
    }

    @keyframes flip-front {
        0% {
            transform: rotateX(0deg);
        }
        40% {
            transform: rotateX(0deg);
        }
        100% {
            transform: rotateX(-90deg);
        }
    }

    @keyframes flip-back {
        0% {
            transform: rotateX(-90deg);
        }
        60% {
            transform: rotateX(-190deg);
        }
        100% {
            transform: rotateX(-190deg);
        }
    }

    /*
    body,
    html {
      height: 100%;
      margin: 0;
    }


    body {
      background: linear-gradient(to bottom, #16222a, #3a6073);
      height: 100%;
      flex: 1;
      align-items: center;
      display: flex;
    }*/

</style>
