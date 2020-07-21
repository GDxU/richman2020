<template>
    <div class="container-clock-center">
        <div class="actual">
            <div class="" id="blurred">
                <div class="gear1"></div>
                <div class="gear2"></div>
                <div class="circle"></div>
                <div class="wheel">
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="" id="original">
                <div class="gear1"></div>
                <div class="gear2"></div>
                <div class="circle"></div>
                <div class="wheel">
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <p>i</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                    <div class="slot">
                        <span></span>
                        <p>o</p>
                    </div>
                    <div class="slit">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="reflection">
            <div class="gear1"></div>
            <div class="gear2"></div>
            <div class="circle"></div>
            <div class="wheel reflect">
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <span></span>
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <span></span>
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <span></span>
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
            </div>
            <div class="fade"></div>
        </div>

        <div class="lighting">
            <div class="wheel reflect">
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>i</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
                <div class="slot">
                    <p>o</p>
                </div>
                <div class="slit">
                    <div></div>
                </div>
            </div>
        </div>

        <div class="box">
            <div>
                <p>t</p>
            </div>
            <div>
            </div>
            <div>
                <p>c</p>
            </div>
            <div>
                <p>k</p>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name : "bg_loading_clock"
    }
</script>

<style scoped lang="scss">


    .container-clock-center {

        background: #001D22;
        color: #EDFFA6;
        font-size: 2.5em;
        font-family: CodePro, sans-serif;
        -webkit-transition: -webkit-filter .25s ease;

        position: relative;
        width: 500px;
        margin: 200px auto;
        -webkit-perspective: 300px;

        &:active {
            -webkit-filter: blur(5px);

        }
    }

    .circle {
        position: absolute;
        width: 156px;
        height: 156px;
        top: 72px;
        left: 172px;
        border-radius: 50%;
        border: dashed 1px rgba(255, 255, 255, 0.72);
        -webkit-animation: spin-reversed 24s linear infinite;
        -moz-animation: spin-reversed 24s linear infinite;
        -ms-animation: spin-reversed 24s linear infinite;
        -o-animation: spin-reversed 24s linear infinite;
        animation: spin-reversed 24s linear infinite;
    }

    .actual {
        position: absolute;
        width: 100%;
        height: 189px;
        overflow: hidden;
    }

    .lighting {
        color: #FFF;
        position: absolute;
        width: 100%;
        height: 189px;
        -webkit-filter: blur(12px);
        -webkit-transform-origin: 50% 100%;
        -webkit-transform: rotateX(270deg);
        -moz-transform: rotateX(270deg);
        -o-transform: rotateX(270deg);
        -ms-transform: rotateX(270deg);
        transform: rotateX(270deg);
    }

    .reflection {
        position: absolute;
        width: 100%;
        height: 189px;
        overflow: hidden;
        -webkit-filter: blur(2px);
        -webkit-transform-origin: 50% 100%;
        -webkit-transform: rotateX(180deg);
        -moz-transform: rotateX(180deg);
        -o-transform: rotateX(180deg);
        -ms-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }

    #blurred {
        -webkit-filter: blur(5px);
    }

    .gear1 {
        position: absolute;
        width: 78px;
        height: 78px;
        top: 36px;
        left: 117px;
        border-radius: 50%;
        border: dashed 1px rgba(255, 255, 255, 0.2);
        -webkit-animation: spin 12s linear infinite;
        -moz-animation: spin 12s linear infinite;
        -ms-animation: spin 12s linear infinite;
        -o-animation: spin 12s linear infinite;
        animation: spin 12s linear infinite;

    }

    .gear2 {
        position: absolute;
        width: 39px;
        height: 39px;
        top: 18px;
        left: 186px;
        border-radius: 50%;
        border: dashed 1px rgba(255, 255, 255, 0.09);
        -webkit-animation: spin-reversed 6s linear infinite;
        -moz-animation: spin-reversed 6s linear infinite;
        -ms-animation: spin-reversed 6s linear infinite;
        -o-animation: spin-reversed 6s linear infinite;
        animation: spin-reversed 6s linear infinite;

    }

    .slot span {
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        left: 14px;
        top: 11px;
        border-radius: 50%;
        border: dashed 1px #FFF;
        -webkit-animation: spin 6s linear infinite;
        -moz-animation: spin 6s linear infinite;
        -ms-animation: spin 6s linear infinite;
        -o-animation: spin 6s linear infinite;
        animation: spin 6s linear infinite;

    }

    .slot span:after {
        content: "";
        position: absolute;
        display: block;
        width: 12px;
        height: 12px;
        top: 4px;
        left: 4px;
        background: rgba(255, 255, 255, .9);
        border-radius: 50%;
    }

    .box {
        position: absolute;
        left: 150px;
        top: 0;
        display: block;
        width: 200px;
    }

    .box div {
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        margin: 0 auto;
    }

    .fade {
        position: absolute;
        top: -11px;
        width: 100%;
        height: 200px;
        background: -webkit-linear-gradient(
                        bottom,
                        rgba(0, 29, 34, 0) 0%,
                        rgba(0, 29, 34, 1) 60%,
                        rgba(0, 29, 34, 1) 100%
        );
    }

    .wheel {
        position: absolute;
        left: 150px;
        top: 50px;
        display: block;
        width: 200px;
        height: 200px;
        margin: 0 auto;
        -webkit-animation: tick 2s infinite;
        -moz-animation: tick 2s infinite;
        -ms-animation: tick 2s infinite;
        -o-animation: tick 2s infinite;
        animation: tick 2s infinite;
    }

    .slot {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0;
        left: 75px;
        text-align: center;
        line-height: 50px;
        -webkit-transform-origin: 50% 100px;
        -moz-transform-origin: 50% 100px;
        -o-transform-origin: 50% 100px;
        -ms-transform-origin: 50% 100px;
        transform-origin: 50% 100px;
    }

    .slot:nth-child(1) {
        -webkit-transform: rotate(60deg);
        -moz-transform: rotate(60deg);
        -o-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
        transform: rotate(60deg);
    }

    .slot:nth-child(3) {
        -webkit-transform: rotate(120deg);
        -moz-transform: rotate(120deg);
        -o-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
        transform: rotate(120deg);
    }

    .slot:nth-child(5) {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .slot:nth-child(7) {
        -webkit-transform: rotate(240deg);
        -moz-transform: rotate(240deg);
        -o-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
        transform: rotate(240deg);
    }

    .slot:nth-child(9) {
        -webkit-transform: rotate(300deg);
        -moz-transform: rotate(300deg);
        -o-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
        transform: rotate(300deg);
    }

    .slot:nth-child(11) {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }

    .slot:nth-child(13) {
        -webkit-transform: rotate(60deg);
        -moz-transform: rotate(60deg);
        -o-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
        transform: rotate(60deg);
    }

    .slit {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0;
        left: 75px;
        color: rgba(123, 176, 211, 0.55);
        -webkit-transform-origin: 50% 100px;
        -moz-transform-origin: 50% 100px;
        -o-transform-origin: 50% 100px;
        -ms-transform-origin: 50% 100px;
        transform-origin: 50% 100px;
    }

    .slit:nth-child(2) {
        -webkit-transform: rotate(30deg);
        -moz-transform: rotate(30deg);
        -o-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
        transform: rotate(30deg);
    }

    .slit:nth-child(4) {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    .slit:nth-child(6) {
        -webkit-transform: rotate(150deg);
        -moz-transform: rotate(150deg);
        -o-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
        transform: rotate(150deg);
    }

    .slit:nth-child(8) {
        -webkit-transform: rotate(210deg);
        -moz-transform: rotate(210deg);
        -o-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
        transform: rotate(210deg);
    }

    .slit:nth-child(10) {
        -webkit-transform: rotate(270deg);
        -moz-transform: rotate(270deg);
        -o-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
        transform: rotate(270deg);
    }

    .slit:nth-child(12) {
        -webkit-transform: rotate(330deg);
        -moz-transform: rotate(330deg);
        -o-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
        transform: rotate(330deg);
    }

    .slit div {
        display: block;
        position: absolute;
        width: 16px;
        height: 3px;
        top: 20px;
        left: 17px;
        border-radius: 50%;
        background: rgba(27, 255, 255, 0.56);
        -webkit-animation: tock 2s infinite;
        -moz-animation: tock 2s infinite;
        -ms-animation: tock 2s infinite;
        -o-animation: tock 2s infinite;
        animation: tock 2s infinite;
    }

    .slit div:after {
        content: "";
        display: block;
        position: absolute;
        width: 2px;
        height: 2px;
        top: 10px;
        left: 7px;
        background: inherit;
    }

    .slit div:before {
        content: "";
        display: block;
        position: absolute;
        width: 2px;
        height: 2px;
        top: -10px;
        left: 7px;
        background: inherit;
    }

    @-webkit-keyframes tick {
        0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        25% {
            -webkit-transform: rotate(60deg);
            -moz-transform: rotate(60deg);
            -o-transform: rotate(60deg);
            -ms-transform: rotate(60deg);
            transform: rotate(60deg);
        }
        50% {
            -webkit-transform: rotate(60deg);
            -moz-transform: rotate(60deg);
            -o-transform: rotate(60deg);
            -ms-transform: rotate(60deg);
            transform: rotate(60deg);
        }
        75% {
            -webkit-transform: rotate(120deg);
            -moz-transform: rotate(120deg);
            -o-transform: rotate(120deg);
            -ms-transform: rotate(120deg);
            transform: rotate(120deg);
        }
        100% {
            -webkit-transform: rotate(120deg);
            -moz-transform: rotate(120deg);
            -o-transform: rotate(120deg);
            -ms-transform: rotate(120deg);
            transform: rotate(120deg);
        }
    }

    @-webkit-keyframes tock {
        0% {
            background: rgba(27, 255, 255, 0.15);
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        25% {
            background: rgba(27, 255, 255, 0.56);
            -webkit-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
        50% {
            background: rgba(27, 255, 255, 0.56);
            -webkit-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
        75% {
            background: rgba(27, 255, 255, 0.15);
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100% {
            background: rgba(27, 255, 255, 0.15);
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            transform: rotate(180deg);
        }
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes spin-reversed {
        0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(-360deg);
            -moz-transform: rotate(-360deg);
            -o-transform: rotate(-360deg);
            -ms-transform: rotate(-360deg);
            transform: rotate(-360deg);
        }
    }

    @-webkit-keyframes pendulum {
        0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50% {
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        100% {
            -webkit-transform: rotate(0);
            -moz-transform: rotate(0);
            -o-transform: rotate(0);
            -ms-transform: rotate(0);
            transform: rotate(0);
        }
    }

    @font-face {
        font-family: CodePro;
        src: url("http://jasonpolito.com/CodePro.otf");

    }
</style>