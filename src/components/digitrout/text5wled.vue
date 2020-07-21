<template>
    <display_led_5w ref="disLed5w" :colorgx="color_code_input"/>
</template>
<script>
    import Display_led_5w from "./display_led_5w";
    import animationNumber from "../../mixins/mixin/animationNumber";

    export default {
        components : { Display_led_5w },
        name : "TextLed5w",
        mixins : [animationNumber],
        data () {
            return {
                color_code_input : "",
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
                if (a < 50000) {
                    this.color_code_input = "blue";
                } else {
                    this.color_code_input = "green";
                }
            },
            animateByNewNumber (n) {

                this.$refs.disLed5w.getShowNum (n);
            },

        }
    }
</script>
