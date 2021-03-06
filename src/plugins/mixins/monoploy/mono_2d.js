export default {
  data () {
    return {
      audio : {
        game_start_turn : this.SFX ("mmonoploy/sfx/PlayerTurnBegin.mp3"),
        game_end_turn : this.SFX ("mmonoploy/sfx/PlayerTurnEnd.mp3"),
        open_dialog : this.SFX ("mmonoploy/sfx/OpponentTurnBegin.mp3"),
        close_dialog : this.SFX ("mmonoploy/sfx/OpponentTurnEnd.mp3"),
        dice_result : this.SFX ("mmonoploy/sfx/DiceResult.mp3"),
        failure_click : this.SFX ("mmonoploy/sfx/error.mp3"),
        bet_adjust : this.SFX ("mmonoploy/sfx/changebet.mp3"),
        click_ui_sys : this.SFX ("mmonoploy/sfx/ui.mp3"),
        result_show : this.SFX ("mmonoploy/sfx/krakenlove.mp3"),
        bet_music : this.SFX ("mmonoploy/sfx/loopbet.mp3"),
        explode : this.SFX ("mmonoploy/sfx/longgun.mp3"),
        draw_sucess : this.SFX ("mmonoploy/sfx/pick_sucess.mp3"),
        monster_hit : this.SFX ("mmonoploy/sfx/fightingAttackBig.mp3"),
        blessing : this.SFX ("mmonoploy/sfx/effect_blessing_ew.mp3"),
        watermonster : this.SFX ("mmonoploy/sfx/effect_waterbreath.mp3"),
        resolved : this.SFX ("mmonoploy/sfx/resolved.mp3"),
        point : this.SFX ("mmonoploy/sfx/sys_point1.mp3"),
        // waterup : this.SFX ("mmonoploy/sfx/waterup.mp3"),
        // waterdown : this.SFX ("mmonoploy/sfx/waterdown.mp3"),
      },
      loop : {
        game_play_music1 : this.SFX ("mmonoploy/sfx/pm_bird_island.mp3"),
      },
      audio_loop_nobet : this.SFX ("mmonoploy/sfx/bgm4hero.mp3"),
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
    sfxPoint () {
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
