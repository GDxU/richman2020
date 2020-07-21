export default {
    data () {
        return {
            audio : {
                new_game : new Audio ("/media/win_ex_me.mp3"),
                click : new Audio ("https://freesound.org/data/previews/269/269504_3094998-lq.mp3"),
                confm : new Audio ("/media/chip_click_n2.mp3"),
                snd_ding : new Audio ("/media/dingexse019.mp3"),
            },
            current_music : null,
            music_clip_pos : 0,
            sound_fx_on : false,
        }
    },
    methods : {
        playFxDing () {
            if (!this.audio.snd_ding.isPlaying) {
                this.audio.snd_ding.play ();
            }
        },
        playFxKj () {
            if (!this.audio.snd_ding.isPlaying) {
                this.audio.snd_ding.play ();
            }
        },
        trySndPlay (x) {
            if (!this.audio[x].isPlaying) {
                this.audio[x].play ();
            }
        },
        toggleMusic () {
            if (!this.sound_fx_on) {
                this.playMusic ();
            } else {
                this.stopaudio ();
            }
        },
    }
}