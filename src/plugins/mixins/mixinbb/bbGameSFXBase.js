import { TimelineLite, Back, Power2, Power1 } from "gsap";
import NewAudioSFX from "../../audiomx";
//delay:0.1,
//  ease:Power2.easeInOut
/* eslint-disable */


export default {
  destroyed () {
    if (this.current_play_sfx instanceof NewAudioSFX) {
      this.current_play_sfx.SFXStop ();
    }
    if (this.current_music instanceof NewAudioSFX) {
      this.current_music.SFXStop ();
    }
    this.stopSetup ("result_show");
    this.stopSetup ("bet_music");
    this.stopSetup ("game_play_music");
    this.stopSetup ("explode");
  },
  /* data () {
     return {
       current_music : null,
       current_play_sfx : null,
       music_clip_pos : 0,
       sfx_enabled : false,
       bgm_enabled : false,
       audio_tracks : [],
     }
   },*/
  mounted () {
    //   this.$store.dispatch ("sfx/setCurrentMuz", this.loop.game_play_music3);
    // this.current_music = this.loop.game_play_music3;
    //   const { onbet, nobet } = this.setMainGameMusic ();
    // this.onbet_music = onbet;
    // this.nobet_music = nobet;
  },
  computed : {
    current_music () {
      return this.$store.getters["sfx/current_music"];
    },
    audio_tracks () {
      return this.$store.getters["sfx/audiotracks"];
    },
    sfx_enabled () {
      return this.$store.getters["sfx/isSNDEnabled"];
    },
    bgm_enabled () {
      return this.$store.getters["sfx/isBGMEnabled"];
    }
  },
  methods : {
    SFX (path) {
      return new NewAudioSFX (path)
    },
    GetMusicLoop (bet_placed) {
      return false;
    },
    RandomizeTracks (list) {
      return NewAudioSFX.randSFXList (list);
    },
    setMainGameMusic () {
      return {
        onbet : this.loop.game_play_music3,
        nobet : this.loop.game_low_c_chars,
      }
    },
    AddTrack (a) {
      this.$store.dispatch ("sfx/addTrack", a);
      return a;
    },
    stopMuzAudio () {
      this.$store.dispatch ("sfx/stopCurrentMusic");
    },
    onSFXComplete (audio_instance) {
      if (audio_instance instanceof NewAudioSFX) {
        audio_instance.SFXStop ();
      }
    },
    SFXSmartPlayRandVolume (audio_instance) {
      if (audio_instance instanceof NewAudioSFX) {
        if (this.sfx_enabled) {
          audio_instance.setVolume (Math.random () * 0.9 + 0.1);
          audio_instance.SFXPlay ();
        }
      }
    },
    SFXSmartPlay (audio_instance) {
      if (audio_instance instanceof NewAudioSFX) {
        if (this.sfx_enabled) {
          audio_instance.SFXPlay ();
        }
      }
    },
    SFXFadeOut (target, span_sec) {
      if (target === undefined) return;
      if (target instanceof NewAudioSFX) {
        target.fadeOutLast (span_sec, this.onSFXComplete)
        // if (target.currentTime > 0) {
        // this.$GSLite.to (target, span_sec, { volume : 0, ease : Power1.easeOut, delay : 0.1 });
        // this.$GSLite.eventCallback ("onComplete", this.onSFXComplete, [target]);
        // }
      }
    },
    SoundManagementUpdate (status_conf) {
      try {
        //  const timeline = new TimelineLite ();
        switch (status_conf) {
          //OPEN_BET
          case 88:
            this.SFXFadeOut (this.audio.result_show, 1);
            // if (this.audio.bet_music.paused) {
            this.SFXSmartPlay (this.audio.bet_music);
            //  this.current_play_sfx = this.audio.bet_music;
            // }
            break;

          //CLOSE_BET
          case 89:
            this.SFXFadeOut (this.audio.bet_music, 4);
            this.current_music = this.GetMusicLoop (this.bet.status);
            this.SFXSmartPlay (this.current_music);
            break;

          //COUNT_DOWN
          case 100:
            this.SFXSmartPlay (this.audio.game_start);
            break;

          //STOP_ESCAPE
          case 101:
            this.SFXFadeOut (this.current_music, 3);
            this.SFXSmartPlay (this.GetSFXExplode ());
            break;

          //START_EXPLOSION_SOUND
          case 6:

            break;

          //SHOW_RESULT
          case 120:
            //  this.SFXFadeOut (this.GetSFXExplode (), 2);
            //  if (!this.audio.result_show.play) {
            this.SFXSmartPlay (this.audio.result_show);
            //  this.current_play_sfx = this.audio.result_show;
            //}
            break;


        }
      } catch (e) {
        console.error ("error from audio", e);
      }
    },
    GetSFXExplode () {
      return this.audio.explode;
    },
    SFxKj () {
      if (this.audio.snd_ding.paused && this.sfx_enabled) {
        this.audio.snd_ding.SFXPlay ();
      }
    },
    SFXFailure () {
      if (this.audio.failure_click.paused && this.sfx_enabled) {
        this.audio.failure_click.SFXPlay ();
      }
    },
    SFxClick () {
      if (this.sfx_enabled) {
        this.audio.click_ui_sys.SFXPlay ();
      }
    },
    SFxAdjustBet () {
      //any button
      if (this.sfx_enabled) {
        this.audio.bet_adjust.SFXPlay ();
      }
    },
    SFxUIClick () {
      this.audio.click_ui_sys.SFXPlay ();
    },
    SFxStartBet () {
      //bet request when the bet is confirmed.
      if (this.audio.start_bet.paused && this.sfx_enabled) {
        this.audio.start_bet.SFXPlay ();
      }
    },
    SFxESC () {
      if (this.sfx_enabled) {
        this.audio.start_esc.SFXPlay ();
      }
    },
    trySndPlay (x) {
      if (this.audio[x].paused) {
        this.audio[x].SFXPlay ();
      }
    },
    stopSetup (x) {
      if (this.audio[x] !== undefined) {
        if (!this.audio[x].paused) {
          this.audio[x].SFXStop ();
        }
      }

      if (this.loop[x] !== undefined) {
        if (!this.loop[x].paused) {
          this.loop[x].SFXStop ();
        }
      }

    },
    toggleMusic () {
      this.$store.dispatch ("sfx/toggleSFX");
      this.$store.dispatch ("sfx/toggleBGM");
      //console.log ("toggle music");
      if (!this.sfx_enabled) {
        if (this.current_music instanceof NewAudioSFX) {
          this.current_music.SFXNoSound ();
        }
        if (this.audio.bet_music instanceof NewAudioSFX) {
          this.audio.bet_music.SFXNoSound ();
        }
        if (this.audio.result_show instanceof NewAudioSFX) {
          this.audio.result_show.SFXNoSound ();
        }
      } else {
        if (this.current_music instanceof NewAudioSFX) {
          this.current_music.SFXResumeSound (true);
        }
        if (this.audio.bet_music instanceof NewAudioSFX) {
          this.audio.bet_music.SFXResumeSound (true);
        }
        if (this.audio.result_show instanceof NewAudioSFX) {
          this.audio.result_show.SFXResumeSound (true);
        }
      }

      //  console.log ("toggle music");
      // if (!this.sfx_enabled) {
      //  this.playMusic ();
      // } else {
      //  this.stopAudio ();
      // }

      if (this.sfx_enabled) {
        this.notificationInfo ("SFX is ON");
      } else {
        this.notificationInfo ("SFX is OFF");
      }
    },
  }
}
