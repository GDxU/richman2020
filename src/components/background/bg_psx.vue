<template>
    <div class="psx">
        <!--SVG Source-->
        <svg style="display:none">
            <symbol id="circle" width="20px" height="20px" viewBox="0 0 20 20">
                <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="10" cy="10" r="7.699"/>
            </symbol>
            <symbol id="triangle" width="20px" height="20px" viewBox="0 0 20 20">
                <polygon fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         stroke-miterlimit="10" points="
      10.5,2.707 14.711,10.002 18.922,17.294 10.5,17.294 2.078,17.294 6.289,10.002 "/>
            </symbol>
            <symbol id="square" width="20px" height="20px" viewBox="0 0 20 20">
                <rect x="3.5" y="3.5" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      stroke-miterlimit="10" width="13" height="13"/>
            </symbol>
            <symbol id="cross" width="20px" height="20px" viewBox="0 0 20 20">
                <g>
                    <line fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          stroke-miterlimit="10" x1="4.666" y1="10" x2="15.334" y2="10"/>
                    <line fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          stroke-miterlimit="10" x1="10" y1="4.666" x2="10" y2="15.334"/>
                </g>
            </symbol>
        </svg>
        <!--End SVG Source-->
        <div class="stage">
            <svg width="20" height="20">
                <use xlink:href="#triangle"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#circle"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#square"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#cross"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#triangle"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#circle"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#square"></use>
            </svg>
            <svg width="20" height="20">
                <use xlink:href="#cross"></use>
            </svg>
            <h1>{{psx_title}}</h1>
        </div>
    </div>
</template>
<script>
    export default {
        name : "bg_psx",
        props : ["psx_title"],
    }
</script>
<style scoped lang="scss">
    // -------------- Vars
    $backcc: #232a35;
    // -------------- Base
    //   @import url(https://fonts.googleapis.com/css?family=Lato:900);
    .psx {
        height: 100%;
        width: 100%;
        div, span {
            box-sizing: border-box;
        }

        // -------------- Bits
        //SVG Source
        #triangle {
            stroke: #FC63B3;
        }
        #circle {
            stroke: #FFF48D;
        }
        #square {
            stroke: #94FFF5;
        }
        #cross {
            stroke: #D68FFF;
        }
        //Stage
        .stage {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: $backcc;
            svg {
                position: absolute;
                z-index: 2;
                //triangle
                &:nth-child(1) {
                    left: 20%;
                    top: 40%;
                    animation: roll-right 9s infinite linear alternate-reverse;
                }
                //circle
                &:nth-child(2) {
                    left: 90%;
                    top: 30%;
                    animation: roll-left 6s infinite linear alternate-reverse;
                }
                //square
                &:nth-child(3) {
                    left: 70%;
                    top: 20%;
                    animation: roll-right 8s infinite linear alternate-reverse;
                }
                //cross
                &:nth-child(4) {
                    left: 50%;
                    top: 20%;
                    animation: roll-left 12s infinite linear alternate-reverse;
                }
                //triangle
                &:nth-child(5) {
                    left: 80%;
                    top: 50%;
                    animation: roll-left 13s infinite linear alternate-reverse;
                }
                //circle
                &:nth-child(6) {
                    left: 10%;
                    top: 20%;
                    animation: roll-right 14s infinite linear alternate-reverse;
                }
                //square
                &:nth-child(7) {
                    left: 40%;
                    top: 60%;
                    animation: roll-left 20s infinite linear alternate-reverse;
                }
                //cross
                &:nth-child(8) {
                    left: 10%;
                    top: 90%;
                    animation: roll-right 11s infinite linear alternate-reverse;
                }
            }
        }
        //Bits Animation
        @keyframes roll-left {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        @keyframes roll-right {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(-360deg);
            }
        }
        //Text - currently :nth-child(9) of .stage
        h1 {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 200px;
            line-height: 200px;
            padding: 0;
            top: 50%;
            margin-top: -100px;
            font-size: 200px;
            letter-spacing: -10px;
            font-family: 'RoundEd', sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-weight: 900;
            text-align: center;
            color: $backcc;
            text-shadow: rgb(26, 32, 40) 1px 1px,
            rgb(26, 32, 41) 2px 2px,
            rgb(27, 33, 41) 3px 3px,
            rgb(27, 33, 42) 4px 4px,
            rgb(27, 34, 42) 5px 5px,
            rgb(28, 34, 43) 6px 6px,
            rgb(28, 34, 43) 7px 7px,
            rgb(29, 35, 44) 8px 8px,
            rgb(29, 35, 44) 9px 9px,
            rgb(29, 36, 45) 10px 10px,
            rgb(30, 36, 45) 11px 11px,
            rgb(30, 37, 46) 12px 12px,
            rgb(30, 37, 47) 13px 13px,
            rgb(31, 37, 47) 14px 14px,
            rgb(31, 38, 48) 15px 15px,
            rgb(32, 38, 48) 16px 16px,
            rgb(32, 39, 49) 17px 17px,
            rgb(32, 39, 49) 18px 18px,
            rgb(33, 39, 50) 19px 19px,
            rgb(33, 40, 50) 20px 20px,
            rgb(33, 40, 51) 21px 21px,
            rgb(34, 41, 51) 22px 22px,
            rgb(34, 41, 52) 23px 23px,
            rgb(35, 42, 53) 24px 24px;
            background-color: rgb(35, 42, 53);
        }
    }
</style>