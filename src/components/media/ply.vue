<template>
    <div class="in-audio">
        <audio src="http://sc1.111ttt.com/2017/4/05/10/298101104389.mp3" id="audio"></audio>
        <div class="progress">
            <mu-slider v-model="value" class="progress-item" v-on:change="changeprogress"/>
        </div>
        <div class="play" v-on:click="startaudio">播放</div>
        <div class="stop" v-on:click="stopaudio">暂停</div>
        <div class="time">{{currentminutetime}}:{{currentsecondtime}} / {{allminutetime}}:{{allsecondtime}}</div>
    </div>
</template>

<script>

/*    import MuseUI from 'muse-ui';
    import 'muse-ui/dist/muse-ui.css';

    Vue.use (MuseUI);*/

    function addZero (v) {
        return v < 10 ? `0${v}` : v;
    }

    export default {
        props : {
            Audio : {
                type : Object,
            },
        },
        data () {
            return {
                value : 0,
                auObj : null,
                currentminutetime : 0,
                currentsecondtime : '00',
                allminutetime : 0,
                allsecondtime : '00',
            };
        },
        mounted () {
            this.auObj = document.getElementById ('audio');
            this.auObj.ontimeupdate = () => {
                this.value = (this.auObj.currentTime / this.auObj.duration) * 100;
                this.currentminutetime = (Math.round (this.auObj.currentTime) - (Math.round (this.auObj.currentTime) % 60)) / 60;
                this.currentsecondtime = addZero (Math.round (this.auObj.currentTime) % 60);
                this.allminutetime = (this.auObj.duration - (this.auObj.duration % 60)) / 60;
                this.allsecondtime = addZero (Math.round (this.auObj.duration) % 60);
            };
        },
        methods : {
            startaudio () {
                this.auObj.play ();
            },
            stopaudio () {
                this.auObj.pause ();
            },
            changeprogress (value) {
                this.auObj.currentTime = (this.auObj.duration * value) / 100;
            },
        },
    };
</script>

<style lang="scss">
    .in-audio {
        position: relative;
        display: inline-block;
        background-color: lightgoldenrodyellow;
        width: 100%;
        .play {
            display: inline-block;
            vertical-align: center;
            margin-left: 10%;
            width: 10.7%;
            border-radius: 20px;
            text-align: center;
            color: white;
            background-color: #7e57c2;
        }
        .stop {
            display: inline-block;
            vertical-align: center;
            width: 10.7%;
            border-radius: 20px;
            text-align: center;
            color: white;
            background-color: #7e57c2;
        }
        .time {
            position: absolute;
            display: inline-block;
            right: 10%;
        }
        .progress {
            display: inline-block;
            vertical-align: center;
            margin-left: 10%;
            width: 80%;
            height: 0px;
            .progress-item {
                width: 100%;
            }
        }
    }
</style>
