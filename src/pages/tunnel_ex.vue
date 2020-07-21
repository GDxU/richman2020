<template>
    <section class="container_bc">
        <div class="backee">
            <bg_kgbtunnel ref="game_wonder"/>
        </div>
        <div class="flexcontainx grid vuebodu">
            <h5>Please join the game jump in the different time.</h5>
            <div class="timer-x">{{time_k | fix3}} x</div>
        </div>
        <br/>
        <div class="flexcontainx grid vuebottom">
            <div class="flexhitem flex-banner control_face_cover">
                <numpad ref="hkipl3"/>
                <a class="btn-3d green ready_bet" :class="classes.selection_final" @press="select_complete">逃走</a>
                <a class="btn-3d green ready_bet" :class="classes.one_button_bet" @click="auto_one_btn">Automatic</a>
            </div>
        </div>
    </section>
</template>
<script>
    import { mapState } from 'vuex'
    import { EventBus } from '../plugins/EventBus'
    import bg_test_scene from "../components/background/bg_test_scene";
    import Spok from "../components/background/bg_spook";
    import Sky from "../components/background/bg_starssky";
    import Numpad from "../components/bigbang/num_pad";
    import Bg_kgbtunnel from "../components/background/bg_kgbtunnel";

    export default {
        layout : "fullplay",
        components : {
            Bg_kgbtunnel,
            Numpad,
            Spok,
            Sky,
            bg_test_scene,
        },
        mounted () {
            let self = this;
            this.$nextTick (self.setup);
        },
        destroyed () {
            clearInterval (this.timer1)
            // EventBus.$off ('padControlUpdate', this.onUpdate)
        },
        created () {
        },
        data () {
            return {
                time_k : 0,
                time_delta : 500,
                timer1 : 0,
                timer2 : 0,
                classes : {
                    selection_final : "disabled",
                    one_button_bet : "disabled"
                },
                audio : {
                    click : new Audio ("https://freesound.org/data/previews/269/269504_3094998-lq.mp3"),
                    confirm : new Audio ("https://freesound.org/data/previews/268/chip_click_n2.mp3")
                }
            }
        },
        computed : {
            xdelta : {
                get () {
                    return 0.01;
                }
            }
        },
        watch : {},
        methods : {
            select_complete () {
                //  const x = this.$refs;
                let self = this;
                if (self.classes.selection_final !== "disabled") {
                    const chip = self.audio.confirm;
                    chip.currentTime = 0;
                    chip.play ();
                    const packet = {
                        kjid : "",
                    };
                    self.check_validate ();
                }
            },
            auto_one_btn () {
                let self = this;
                let cex = this.$refs.game_wonder;

                if (self.audio.confirm !== undefined) {
                    if (self.classes.one_button_bet !== "disabled") {
                        const chip = self.audio.confirm;
                        chip.currentTime = 0;
                        chip.play ();
                    }
                }
            },
            onUpdate (e) {
                let self = this;
                if (self.audio.click !== undefined) {
                    const chip = self.audio.click;
                    chip.currentTime = 0;
                    chip.play ();
                }
            },
            update_x_number () {
                this.time_k = this.time_k + this.xdelta;
            },
            setup () {
                let self = this;
                this.timer2 = setInterval (() => {
                    self.update_x_number ();
                }, self.time_delta);
                this.timer1 = setInterval (() => {
                    self.time_delta -= 10;
                    if (self.time_delta <= 0) {
                        self.time_delta = 0
                    }
                }, 20000);
                /* EventBus.$on ('padControlUpdate', self.onUpdate);*/
            }
        }
    }
</script>