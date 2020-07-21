<template>
    <section class="flexlpx">
        <div class="disrow">
            <led ref="ww" mode="normal" display="2" :color_x="dynamic_color"/>
            <led ref="qw" mode="normal" display="2" :color_x="dynamic_color"/>
            <led ref="bw" mode="flash" display="2" :color_x="dynamic_color"/>
            <led ref="sw" mode="flash" display="2" :color_x="dynamic_color"/>
            <led ref="gw" mode="flash" display="2" :color_x="dynamic_color"/>
        </div>
    </section>
</template>
<style scoped lang="scss">
    .flexlpx {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        margin-bottom: 10px;
        .disrow {
            display: flex;
            flex-direction: row;
        }
    }
</style>
<script>
    // import { EventBus } from "../../plugins/EventBus"

    import Led from "../digit/led";
    import ComSpriteEx from "../../mixins/mixin/com_5w_sprite";

    export default {
        props : ["colorgx"],
        mixins : [ComSpriteEx],
        watch : {
            colorgx (cx) {
                this.dynamic_color = cx;
            }
        },
        components : {
            Led,
        },
        data () {
            return {
                dynamic_color : "",
            }
        },
        mounted () {
            this.$nextTick (() => {

            })
        },
        methods : {
            getComs () {
                return [this.$refs.ww, this.$refs.qw, this.$refs.bw, this.$refs.sw, this.$refs.gw];
            },
            getAllOff () {
                for (var i = 0; i < 5; i++) {
                    this.getComs ()[i].offLight ();
                }
            },
        }
    }
</script>