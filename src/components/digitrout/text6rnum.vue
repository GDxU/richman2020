<template>
    <display_ball_5w ref="ballLuckyBalls"/>
</template>
<script>
    import Display_ball_5w from "./display_ball_5w";
    import animationNumber from "../../mixins/mixin/animationNumber";

    export default {
        components : {
            Display_ball_5w,
        },
        name : "TextLed5w",
        mixins : [animationNumber],

        data () {
            return {
                color_code_input : "",
            }
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
                this.$refs.ballLuckyBalls.getShowNum (n);
            },

        }
    }
</script>
