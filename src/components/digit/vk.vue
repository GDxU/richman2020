<template>
    <div class="timer">
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
        <div class="block" data-rotate="-90" style="transform: translateZ(-100px) rotateX(-90deg);">
            <div class="front"></div>
            <div class="top"></div>
            <div class="back"></div>
            <div class="bottom"></div>
        </div>
    </div>
</template>

<script>

    const zero = [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14];
    const one = [1, 4, 7, 10, 13];
    const two = [0, 1, 2, 5, 6, 7, 8, 9, 12, 13, 14];
    const three = [0, 1, 2, 5, 6, 7, 8, 11, 12, 13, 14];
    const four = [0, 2, 3, 5, 6, 7, 8, 11, 14];
    const five = [0, 1, 2, 3, 6, 7, 8, 11, 12, 13, 14];
    const six = [0, 3, 6, 7, 8, 9, 11, 12, 13, 14];
    const seven = [0, 1, 2, 5, 8, 11, 14];
    const eight = [0, 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14];
    const nine = [0, 1, 2, 3, 5, 6, 7, 8, 11, 14];
    let s = 0;

    const timerEl = document.querySelector('.timer');
    const blocksEl = timerEl.querySelectorAll('.block');


    const rotate = (el) => {
        const rotation = el.dataset.rotate;
        let deg = rotation;

        if (s === 0) {
            deg = -90;
        } else {
            deg = deg - 90;
        }
        el.style.transform = `translateZ(-100px) rotateX(${deg}deg)`;
        el.dataset.rotate = deg;
    }

    const getBlocks = (number, prevNum) => {
        if (prevNum) {
            const dontRotate = prevNum.filter (val => number.includes (val));
            const doRotatePrev = prevNum.filter (val => !number.includes (val));
            const doRotateCurrent = number.filter (val => !dontRotate.includes (val));

            doRotateCurrent.forEach ((block) => {
                rotate (blocksEl[block]);
            });
            doRotatePrev.forEach ((block) => {
                rotate (blocksEl[block]);
            })
        } else {
            number.forEach ((block) => {
                rotate (blocksEl[block]);
            });
        }
    }

    const timer = () => {
        window.setInterval (() => {
            if (s === 1) {
                getBlocks (one, zero);
            }
            if (s === 2) {
                getBlocks (two, one);
            }
            if (s === 3) {
                getBlocks (three, two);
            }
            if (s === 4) {
                getBlocks (four, three);
            }
            if (s === 5) {
                getBlocks (five, four);
            }
            if (s === 6) {
                getBlocks (six, five);
            }
            if (s === 7) {
                getBlocks (seven, six);
            }
            if (s === 8) {
                getBlocks (eight, seven);
            }
            if (s === 9) {
                getBlocks (nine, eight);
            }
            if (s === 10) {
                getBlocks (zero, nine);
                s = 0;
            }

            s += 1;
        }, 1000);
    }


    export default {
        name : "vk",
        props : ["mode"],
        data () {
            return {
                n : 0
            }
        },
        methods : {
            getBlocks (number, prevNum) {

                if (prevNum) {
                    const dontRotate = prevNum.filter (val => number.includes (val));
                    const doRotatePrev = prevNum.filter (val => !number.includes (val));
                    const doRotateCurrent = number.filter (val => !dontRotate.includes (val));

                    doRotateCurrent.forEach ((block) => {
                        rotate (blocksEl[block]);
                    });
                    doRotatePrev.forEach ((block) => {
                        rotate (blocksEl[block]);
                    })
                } else {
                    number.forEach ((block) => {
                        rotate (blocksEl[block]);
                    });
                }

            },
            timer () {
                if (s === 1) {
                    getBlocks (one, zero);
                }
                if (s === 2) {
                    getBlocks (two, one);
                }
                if (s === 3) {
                    getBlocks (three, two);
                }
                if (s === 4) {
                    getBlocks (four, three);
                }
                if (s === 5) {
                    getBlocks (five, four);
                }
                if (s === 6) {
                    getBlocks (six, five);
                }
                if (s === 7) {
                    getBlocks (seven, six);
                }
                if (s === 8) {
                    getBlocks (eight, seven);
                }
                if (s === 9) {
                    getBlocks (nine, eight);
                }
                if (s === 10) {
                    getBlocks (zero, nine);
                    s = 0;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    :root {
        --color-grey: #2a2a21;
        --color-yellow: #edce4c;
        --color-bright-yellow: #ffe45e;
        --color-mustard: #dbbd3b;
    }

    body,
    html {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: linear-gradient(to bottom left, var(--color-bright-yellow), var(--color-mustard));
    }

    .timer {
        box-shadow: 10px 10px 60px rgba(27, 27, 27, 0.9);
        display: grid;
        column-gap: 1px;
        row-gap: 1px;
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(5, 100px);
    }

    .block {
        height: 100px;
        position: relative;
        transition: 400ms transform ease;
        transform-style: preserve-3d;
        width: 100px;

        > div {
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.3) inset, 0 0 30px rgba(0, 0, 0, 0.3) inset;
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .front,
        .back {
            background-color: var(--color-bright-yellow);
        }

        .top,
        .bottom {
            background-color: var(--color-grey);
        }

        .front {
            transform: rotateY(0deg) translateZ(50px);
        }
        .top {
            transform: rotateX(90deg) translateZ(50px);
        }
        .back {
            transform: rotateY(180deg) translateZ(50px);
        }
        .bottom {
            transform: rotateX(-90deg) translateZ(50px);
        }
    }

    .show-front {
        transform: translateZ(-100px) rotateX(0deg);
    }

    .show-top {
        transform: translateZ(-100px) rotateX(-90deg);
    }

    .show-back {
        transform: translateZ(-100px) rotateX(-180deg);
    }

    .show-bottom {
        transform: translateZ(-100px) rotateX(-270deg);
    }
</style>