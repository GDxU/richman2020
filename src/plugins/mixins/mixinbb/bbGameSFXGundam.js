export default {
  data () {
    return {
      audio : {
   /*     failure_click : this.SFX ("/static/media/dingexse019.mp3"),
        start_bet : this.SFX ("/static/media/mgs_rank_AB.mp3"),
        bet_adjust : this.SFX ("/static/media/mgs_getweapon.mp3"),
        click_ui_sys : this.SFX ("/static/media/click_mgs_c1.mp3"),
        result_show : this.SFX ("/static/media/game_result_bgm.mp3"),
        bet_music : this.SFX ("/static/media/betting_music_2.mp3"),
        explode : this.SFX ("/static/media/explosion_electricfire.mp3"),*/
      },
      loop : {
    /*    game_play_music2 : this.SFX ("/media/game_42.mp3"),
        game_play_music3 : this.SFX ("/media/game_3.mp3"),
        music_nobet : this.SFX ("/media/ms_chars.mp3"),*/
      },
    }
  },
  methods : {
    setMainGameMusic () {
      return {
        onbet : this.loop.game_play_music2,
        nobet : this.loop.music_nobet,
      }
    }
  }
}
