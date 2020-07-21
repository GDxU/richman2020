<template>
    <section class="container_oke">
        <div class="backee">
            <bg_firework_v3 v-if="bg===0"/>
            <bg_ps3 v-if="bg===4"/>
            <bg_psx v-if="bg===1" :psx_title="current_round"/>
            <bg_firework v-if="bg===2"/>
            <bg_snow v-if="bg===3"/>
        </div>
        <div class="flexhitem grid"></div>
    </section>
</template>

<script>
   // import "vue2-timeago/dist/vue2-timeago.css"
    import TimeAgo from "vue2-timeago"
    import SimplePop from "../components/util/SimplePop";
    import Bg_psx from "../components/background/bg_psx";
    import Bg_ps3 from "../components/background/bg_ps3";
    import Bg_firework from "../components/background/bg_mountain_c";
    import Bg_snow from "../components/background/bg_snow";
    import Bg_firework_v3 from "../components/background/bg_firework_V3";


    export default {
        name : "work_bg",
        components : {
            Bg_firework_v3,
            Bg_snow,
            Bg_firework,
            Bg_ps3,
            TimeAgo,
            Bg_psx,
            SimplePop,
        },
        data () {
            return {
                mobileDisplayBalance : false,
                mobileDisplayBank : false,
                msgHistoryBox : false,
                msgErrorBox : false,
                msgGameWait : true,
                status_text : "",
                message_notice : "",
                update_status : -1,
                classes : {
                    confirm_escape : "disabled",
                    confirm_bet : "disabled",
                    all_bet_buttons : "disabled",
                    bet_status : "bet_progress",
                    additional_state : "",
                },
                clock : 0,
                countdownclock : 0,
                currencies : ["thpc", "eth", "bbr"],
                buttonExtras : [],
                bg : 0,
            }
        },
    }
</script>

<style scoped>

</style>
