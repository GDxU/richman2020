<template>

    <div class="wrapper diceboard">
        <div class="flex-row diceone">
            <div class="lap-counter" id="num_container_displ">
                <div id="tens" class="digit">
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
                        <div class="light" id="light_06"></div>
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

                <div id="ones" class="digit">
                    <div class="light-row 1st-row">
                        <div class="light light-on" id="light_13"></div>
                        <div class="light light-on" id="light_14"></div>
                        <div class="light light-on" id="light_15"></div>
                    </div>
                    <div class="light-row 2nd-row">
                        <div class="light light-on" id="light_16"></div>
                        <div class="light light-on" id="light_17"></div>
                    </div>
                    <div class="light-row 3rd-row">
                        <div class="light light-on" id="light_18"></div>
                        <div class="light" id="light_19"></div>
                        <div class="light light-on" id="light_20"></div>
                    </div>
                    <div class="light-row 4th-row">
                        <div class="light light-on" id="light_21"></div>
                        <div class="light light-on" id="light_22"></div>
                    </div>
                    <div class="light-row 5th-row">
                        <div class="light light-on" id="light_23"></div>
                        <div class="light light-on" id="light_24"></div>
                        <div class="light light-on" id="light_25"></div>
                    </div>
                </div>
            </div>
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

    const primeFormation = [true, true, true, true, true, true, true, true, true, false, true, false, false, false, false, false, false, false, true, true, true, true, false, true, false, false];


    export default {
        name : "DoubleDigit",
        components : {},

        data () {
            return {
                ones : 0,
                tens : 0,
                whole : 0,
                bet_amount : 0,
                bank_amount : 0,
            }
        },
        methods : {

            animateValue (oldVal, newValue, duration, funcUpdate, funcDone) {
                let currentVal = oldVal;
                let range = newValue - oldVal;
                let minTime = 50;
                let stepTime = Math.max (Math.abs (Math.floor (duration / range)), minTime);

                let startTime = new Date ().getTime ();
                let endTime = startTime + duration;
                let timer;

                function run () {
                    let now = new Date ().getTime ();
                    let remaining = Math.max ((endTime - now) / duration, 0);
                    let value = Math.round (newValue - (remaining * range));
                    currentVal = value;
                    funcUpdate (currentVal);
                    if (value === newValue) {
                        clearInterval (timer);
                        funcDone ();
                    }
                }

                timer = setInterval (run, stepTime);
                run ();
            },

            incrementNumber () {
                this.ones++;
                if (this.ones >= 10) {
                    this.ones = 0;
                    this.tens = this.tens + 1;
                    console.log (this.tens);
                }

                if (this.tens >= 10) {
                    this.tens = 0;
                }
            },

            decrementNumber () {
                this.ones = this.ones - 1;
                if (this.ones < 0) {
                    this.ones = 9;
                    this.tens = this.tens - 1;
                }

                if (this.tens < 0) {
                    this.tens = 9;
                }
            },

            lightsOff () {
                for (var i = 0; i < this.ellight.length; i++) {
                    this.ellight[i].classList.remove ('light-on');
                }
            },

            countUp () {
                this.lightsOff ();
                this.incrementNumber ();
                this.logicShow ();
            },

            countDown () {
                this.lightsOff ();
                this.decrementNumber ();
                this.logicShow ();
            },

            flashDigit (n) {
                if (n < 100) {
                    this.ones = n % 10;
                    this.tens = Math.floor (n / 10)
                }
            },
            enterFinalDigit (ff, cb) {
                const dat = this;
                dat.switchBlueDisplay ()
                dat.animateValue (this.whole, ff, 1000, function (update_Val) {
                    dat.flashDigit (update_Val);
                    dat.lightsOff ();
                    dat.logicShow ();
                }, function () {
                    dat.whole = ff;
                    cb ();
                });
            },

            randx () {
                var b = Math.floor (Math.random () * 100);
                this.animateTo (b)
            },

            animateTo (ff) {
                const dat = this;
                dat.animateValue (this.whole, ff, 1000, function (update_Val) {
                    dat.flashDigit (update_Val);
                    dat.lightsOff ();
                    dat.logicShow ();
                }, function () {
                    dat.whole = ff;
                    // dat.$store.dispatch('animate_dispatch');
                });
            },

            logicShow () {
                var m1 = digitForms[this.ones];
                var m10 = digitForms[this.tens];

                for (var i = 0; i < m1.length; i++) {
                    if (m1[i] === true) {
                        this.elones[i].classList.toggle ('light-on');
                    }
                    if (m10[i] === true) {
                        this.eltens[i].classList.toggle ('light-on');
                    }
                }
            },

            resetNumbers () {
                this.lightsOff ();
                console.log ('reset')

                this.ones = 0;
                this.tens = 0;
                this.logicShow ();
            },

            switchBlueDisplay () {
                //  const container_display = document.getElementById('num_container_displ');
                // container_display.classList.toggle('blue')
                const $display = $ ('#num_container_displ');
                $display.removeClass ("red green");
                $display.addClass ("blue")
            },

            switchRedDisplay () {
                const $display = $ ('#num_container_displ');
                $display.removeClass ("blue green");
                $display.addClass ("red")
            },

            switchGreenDisplay () {
                //  const container_display = document.getElementById('num_container_displ');
                // container_display.classList.toggle('blue')
                const $display = $ ('#num_container_displ');
                $display.removeClass ("blue red");
                $display.addClass ("green")
            },

            setStatus (sN) {
                const dat = this;
                switch (sN) {
                    case 0:
                        dat.switchRedDisplay ();
                        // console.log ("red items")
                        break;
                    case 1:
                        dat.switchGreenDisplay ();
                        //  console.log ("green items")
                        break;
                    case 2:
                        dat.switchBlueDisplay ();
                        //  console.log ("blue items")
                        break;

                    default:

                        break
                }

            },
            load_fp () {
                const lights = document.getElementsByClassName ('light');
                const digit = document.getElementsByClassName ('digit');
                const tens = document.getElementById ('tens').getElementsByClassName ('light');
                const ones = document.getElementById ('ones').getElementsByClassName ('light');
                this.ellight = lights;
                this.eltens = tens;
                this.elones = ones;

                function primeLetters () {
                    function toggleLightsForPrime () {
                        lights[i].classList.toggle ('light-on');
                    }

                    function flashPrime () {
                        setInterval (primeLetters, 500);
                    }

                    //console.log ('prime time!')
                    for (var i = 0; i < primeFormation.length; i++) {
                        if (primeFormation[i] === false && lights[i].classList.contains ('light-on')) {
                            toggleLightsForPrime ();
                        } else if (primeFormation[i] === true && !lights[i].classList.contains ('light-on')) {
                            toggleLightsForPrime ();
                        }
                    }
                }

                // resetButton.addEventListener ('click', this.resetNumbers);
            },
        },
        mounted : function () {
            let self = this;
            this.$nextTick (self.load_fp);
        }
    }
</script>
<style lang="scss">
    /*  body {
          background-color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
      }*/

</style>