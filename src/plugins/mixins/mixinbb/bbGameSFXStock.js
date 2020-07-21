export default {
  data () {
    return {
      audio : {
        failure_click : this.SFX ("static/media/chart_corn.mp3"),
        start_bet : this.SFX ("static/media/button_confirm_bet.mp3"),
        bet_adjust : this.SFX ("static/media/button_confirm_bet.mp3"),
        click_ui_sys : this.SFX ("static/media/button_confirm_bet.mp3"),
        result_show : this.SFX ("static/media/button_confirm_bet.mp3"),
        bet_music : this.SFX ("static/media/button_confirm_bet.mp3"),
        explode : this.SFX ("static/media/button_confirm_bet.mp3"),
        bet_confirmed : this.SFX ("static/media/button_confirm_bet.mp3"),
      },
      loop : {
        game_play_music1 : this.SFX ("/static/media/game_43.mp3"),
        game_play_music2 : this.SFX ("/static/media/game_42.mp3"),
        game_play_music3 : this.SFX ("/static/media/game_3.mp3"),
        game_low_c_chars : this.SFX ("/static/media/ms_chars.mp3"),
      },
    }
  },
}
