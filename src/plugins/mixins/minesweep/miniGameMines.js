export default {
  data () {
    return {
      audio : {
        game_start : this.SFX ("mmines/ready.mp3"),
        failure_click : this.SFX ("mmines/error.mp3"),
        start_bet : this.SFX ("mmines/start_bet_game.mp3"),
        bet_adjust : this.SFX ("mmines/changebet.mp3"),
        click_ui_sys : this.SFX ("mmines/ui.mp3"),
        result_show : this.SFX ("mmines/krakenlove.mp3"),
        bet_music : this.SFX ("mmines/loopbet.mp3"),
        explode : this.SFX ("mmines/longgun.mp3"),
        draw_sucess : this.SFX ("mmines/pick_sucess.mp3"),
        monster_hit : this.SFX ("mmines/fightingAttackBig.mp3"),
        blessing : this.SFX ("mmines/effect_blessing_ew.mp3"),
        watermonster : this.SFX ("mmines/effect_waterbreath.mp3"),
        resolved : this.SFX ("mmines/resolved.mp3"),
        point : this.SFX ("mmines/sys_point1.mp3"),
        // waterup : this.SFX ("mmines/waterup.mp3"),
        // waterdown : this.SFX ("mmines/waterdown.mp3"),
      },
      loop : {
        game_play_music1 : this.SFX ("mmines/pm_bird_island.mp3"),
      },
      audio_loop_nobet : this.SFX ("mmines/bgm4hero.mp3"),
      audio_music_loop : [],
    }
  },
  mounted () {
    /*    for (let [k, v] in Object.entries (this.loop)) {
          this.audio_music_loop.push (k)
        }*/
    this.$store.dispatch ("sfx/setCurrentMuz", this.loop.game_play_music1);
  },
  methods : {
    GetLoopz () {
      return this.RandomizeTracks ([
        this.loop.game_play_music1,
      ])
    },
    GetMusicLoop (betted) {
      if (betted) {
        return this.GetLoopz ();
      } else {
        return this.GetLoopz ();
      }
    },
    sfxCityShow () {
      this.SFXSmartPlay (this.audio.blessing);
    },
    sfxResolve () {
      this.SFXSmartPlay (this.audio.resolved);
    },
    sfxMonsterShow () {
      this.SFXSmartPlay (this.audio.watermonster);
    },
    sfxPoint(){
      this.SFXSmartPlay (this.audio.point);
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
