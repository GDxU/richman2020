<template>
    <section class="flexlpx">
        <div class="disrow">
            <ball ref="ww"/>
            <ball ref="qw"/>
            <ball ref="bw"/>
            <ball ref="sw"/>
            <ball ref="gw"/>
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

    import Ball from "../digit/ball";
    import com_5w_sprite from "../../mixins/mixin/com_5w_sprite";

    export default {
        props : ["colorgx"],
        mixins : [com_5w_sprite],
        watch : {
            colorgx (cx) {
                this.dynamic_color = cx;
            }
        },
        components : {
            Ball,
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

        }
    }
</script>