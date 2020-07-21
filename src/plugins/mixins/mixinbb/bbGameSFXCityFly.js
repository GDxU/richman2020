export default {
  data () {
    return {
      audio : {
        failure_click : this.SFX ("mcitysurivial/error.mp3"),
        start_bet : this.SFX ("mcitysurivial/select_down.mp3"),
        start_esc : this.SFX ("mcitysurivial/select_up.mp3"),
        bet_adjust : this.SFX ("mcitysurivial/select_adjust.mp3"),
        click_ui_sys : this.SFX ("mcitysurivial/device_0c.mp3"),
        result_show : this.SFX ("mcitysurivial/result2.ogg"),
        bet_music : this.SFX ("mcitysurivial/bedtime.mp3"),
        explode : this.SFX ("mcitysurivial/longgun.mp3"),
        bet_confirmed : this.SFX ("mcitysurivial/select_down.mp3"),
        game_start : this.SFX ("mcitysurivial/ready.mp3"),
        launch_k1 : this.SFX ("mcitysurivial/shortgun3.mp3"),
        launch_k2 : this.SFX ("mcitysurivial/shortgun2.mp3"),
      },
      loop : {
        game_play_music1 : this.SFX ("mcitysurivial/gm_sm_loop.mp3"),
        game_play_music2 : this.SFX ("mcitysurivial/gm_sm_loop.mp3"),
        game_play_music3 : this.SFX ("mcitysurivial/gm_sm_loop.mp3"),
        game_play_music4 : this.SFX ("mcitysurivial/gm_sm_loop.mp3"),
      },
      effectex : {
        fw_explode1 : this.SFX ("mcitysurivial/fx5.mp3"),
        fw_explode2 : this.SFX ("mcitysurivial/fx2.mp3"),
        fw_explode3 : this.SFX ("mcitysurivial/fx3.mp3"),
        fw_explode4 : this.SFX ("mcitysurivial/fx4.mp3"),
      },
      audio_loop_nobet : this.SFX ("mcitysurivial/bgm4hero.mp3"),
      audio_music_loop : [],
    }
  },
  mounted () {
    for (let [k, v] in Object.entries (this.loop)) {
      this.audio_music_loop.push (k)
    }
  },
  methods : {
    GetLoopz () {
      return this.RandomizeTracks ([
        this.loop.game_play_music1,
        this.loop.game_play_music2,
        this.loop.game_play_music3,
        this.loop.game_play_music4,
      ])
    },
    GetSFXExplode () {
      return this.RandomizeTracks ([
        this.audio.explode,
        this.audio.launch_k1,
        this.audio.launch_k2,
      ])
    },
    GetSFXUFO () {
      return this.RandomizeTracks ([
        this.effectex.fw_explode1,
        this.effectex.fw_explode2,
        this.effectex.fw_explode3,
        this.effectex.fw_explode4,
      ])
    },
    GetMusicLoop (betted) {
      if (betted) {
        return this.GetLoopz();
      } else {
        return this.audio_loop_nobet;
      }
    },
    ExplodeSound (data) {
      //this.audio_in_explode = this.audio_explode_cx[r];
      const track = this.AddTrack (this.GetSFXUFO ());
      /*  if (track) { this.SFXFadeOut (track, 0.5);}*/
      this.SFXSmartPlay (track);
      this.SFXSmartPlayRandVolume (track);
    },
    UFO_EFFEC (data) {
      // console.log ("ufo is coming..");
      const track = this.AddTrack (this.GetSFXUFO ());
      this.SFXSmartPlay (track);
      this.SFXSmartPlayRandVolume (track);
    }
    //SFXSmartPlay
  }
}

//failure_click : this.SFX ("static/media/chart_corn.mp3"),
// start_bet : this.SFX ("static/media/button_confirm_bet.mp3"),
//  click_ui_sys : this.SFX ("static/media/change_bet.mp3"),
//  bet_adjust : this.SFX ("static/media/change_bet.mp3"),
// result_show : this.SFX ("static/media/outrun2_endC.mp3"),
// bet_music : this.SFX ("static/media/or_bet_music.mp3"),
// explode : this.SFX ("static/media/mgs_rank_AB.mp3"),
