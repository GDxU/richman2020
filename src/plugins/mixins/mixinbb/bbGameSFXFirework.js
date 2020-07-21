export default {
  data () {
    return {
      audio : {
        failure_click : this.SFX ("mfireworkcity/chart_corn.mp3"),
        start_bet : this.SFX ("mfireworkcity/button_confirm_bet.mp3"),
        bet_adjust : this.SFX ("mfireworkcity/change_bet.mp3"),
        click_ui_sys : this.SFX ("mfireworkcity/change_bet.mp3"),
        result_show : this.SFX ("mfireworkcity/or_endc.mp3"),
        bet_music : this.SFX ("mfireworkcity/bet_time.mp3"),
        explode : this.SFX ("mfireworkcity/explode_factor.mp3"),
        bet_confirmed : this.SFX ("mfireworkcity/button_confirm_bet.mp3"),
        game_start : this.SFX ("mfireworkcity/launch_game_ex.mp3"),
        launch_k1 : this.SFX ("mfireworkcity/ff_launch_sm.mp3"),
        launch_k2 : this.SFX ("mfireworkcity/ff_launch_sm.mp3"),
      },
      loop : {
        game_play_music1 : this.SFX ("mfireworkcity/gm_speed_k2.mp3"),
        game_play_music2 : this.SFX ("mfireworkcity/gm_speed_x1.mp3"),
        game_play_music3 : this.SFX ("mfireworkcity/gm_speed_x2.mp3"),
        game_play_music4 : this.SFX ("mfireworkcity/gm_road_sp.mp3"),
      },
      firework_ex : {
        fw_explode1 : this.SFX ("mfireworkcity/ff_explode_m1.mp3"),
        fw_explode2 : this.SFX ("mfireworkcity/ff_explode_s1.mp3"),
        fw_explode3 : this.SFX ("mfireworkcity/ff_explode_s2.mp3"),
        fw_explode4 : this.SFX ("mfireworkcity/ff_explode_s3.mp3"),
      },
      audio_loop_nobet : this.SFX ("mfireworkcity/gm_road_sp.mp3"),
      //  audio_in_launch : false,
      //  audio_in_explode : false,
      audio_music_loop : [],
      audio_explode_cx : [],
    }
  },
  computed : {
    no_firework_sound () {
      const now_state = this.$store.state.survival.game_status;
      const open_bet = now_state === 88 || now_state === 89;
      return open_bet;
    }
  },
  mounted () {
    for (let [k, v] in Object.entries (this.loop)) {
      this.audio_music_loop.push (k)
    }
    for (let [k, v] in Object.entries (this.firework_ex)) {
      this.audio_explode_cx.push (k)
    }
  },
  methods : {
    GetLunchSFX () {
      return this.RandomizeTracks ([
        this.audio.launch_k1,
        this.audio.launch_k2,
      ])
    },
    GetFEXPSFX () {
      return this.RandomizeTracks ([
        this.firework_ex.fw_explode1,
        this.firework_ex.fw_explode2,
        this.firework_ex.fw_explode3,
        this.firework_ex.fw_explode4,
      ])
    },
    GetMuzLoops () {
      return this.RandomizeTracks ([
        this.loop.game_play_music1,
        this.loop.game_play_music2,
        this.loop.game_play_music3,
        this.loop.game_play_music4,
      ])
    },
    // ====== music loop
    GetMusicLoop (betted) {
      if (betted) {
        return this.GetMuzLoops ();
      } else {
        return this.audio_loop_nobet;
      }
    },
    ExplodeSound (data) {
      //this.audio_in_explode = this.audio_explode_cx[r];
      if (this.no_firework_sound ) {
        return;
      }
      const track = this.AddTrack (this.GetFEXPSFX ());
      this.SFXSmartPlay (track);
      this.SFXSmartPlayRandVolume (track);
    },
    // ====== launch sound now
    LaunchSound (data) {
      if (this.no_firework_sound ) {
        return;
      }
      const track = this.AddTrack (this.GetLunchSFX ());
      this.SFXSmartPlay (track);
      this.SFXSmartPlayRandVolume (track);
    }
    //SFXSmartPlay
  }
}
//failure_click : this.SFX ("static/mfireworkcity/chart_corn.mp3"),
// start_bet : this.SFX ("static/mfireworkcity/button_confirm_bet.mp3"),
//  click_ui_sys : this.SFX ("static/mfireworkcity/change_bet.mp3"),
//  bet_adjust : this.SFX ("static/mfireworkcity/change_bet.mp3"),
// result_show : this.SFX ("static/mfireworkcity/outrun2_endC.mp3"),
// bet_music : this.SFX ("static/mfireworkcity/or_bet_music.mp3"),
// explode : this.SFX ("static/mfireworkcity/mgs_rank_AB.mp3"),
