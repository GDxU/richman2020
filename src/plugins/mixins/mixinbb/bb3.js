import { TimelineLite, Back, Power2, Power1 } from "gsap"
//delay:0.1,
//  ease:Power2.easeInOut
/* eslint-disable */
Audio.prototype.SFXStop = function () {
  this.currentTime = 0;
  this.pause ();
};
Audio.prototype.SFXNoSound = function () {
  if (!this.paused) {
    this.volume = 0;
  }
};
Audio.prototype.SFXResumeSound = function (x) {
  if (!this.paused) {
    if (typeof x === "boolean") {
      this.volume = 1;
    }
    if (typeof x === "number") {
      const g = Math.abs (x);
      if (g > 0 && g <= 100) {
        this.volume = x / 100;
      }
      if (g > 0 && g <= 1) {
        this.volume = g;
      }
    }
  }
};
Audio.prototype.SFXPlay = function () {
  if (this.canPlayType ("audio/mpeg")) {
    this.volume = 1;
    this.autoplay = false;
    this.currentTime = 0;
    this.loop = false;
    // window.console.log (this);
    this.play ();
  } else {
    console.error ("does not support mpeg format");
  }
};
Audio.prototype.muzPlay = function () {
  if (this.canPlayType ("audio/mpeg")) {
    this.autoplay = false;
    this.currentTime = 0;
    this.loop = false;
    this.play ();
  } else {
    console.error ("does not support mpeg format");
  }
};

function NewAudioSFX (path) {
  const h = new Audio (path);
  window.console.log (path);
  h.currentTime = 0;
  h.loop = false;
  h.autoplay = false;
  h.crossOrigin = "anonymous";
  return h;
}


function randSFXList (audios) {
  const r = Math.floor (Math.random () * audios.length);
  return audios[r];
}

export default {
  destroyed () {
    if (this.current_play_sfx instanceof Audio) {
      this.current_play_sfx.SFXStop ();
    }
    if (this.current_music instanceof Audio) {
      this.current_music.SFXStop ();
    }
    this.stopSetup ("result_show");
    this.stopSetup ("bet_music");
    this.stopSetup ("game_play_music");
    this.stopSetup ("explode");
  },
  data () {
    return {
      current_music : null,
      current_play_sfx : null,
      music_clip_pos : 0,
      sfx_enabled : false,
      bgm_enabled : false,
      audio_tracks : [],
    }
  },
  mounted () {
    // this.current_music = this.loop.game_play_music3;
    //   const { onbet, nobet } = this.setMainGameMusic ();
    // this.onbet_music = onbet;
    // this.nobet_music = nobet;
  },
  methods : {
    SFX (path) {
      return NewAudioSFX (path)
    },
    GetMusicLoop (bet_placed) {
      return false;
    },
    RandomizeTracks (list) {
      return randSFXList (list);
    },
    setMainGameMusic () {
      return {
        onbet : this.loop.game_play_music3,
        nobet : this.loop.game_low_c_chars,
      }
    },
    AddTrack (a) {
      this.audio_tracks.push (a);
      const lenaudio = this.audio_tracks.length;
      if (lenaudio > 20) {
        this.audio_tracks.shift ();
      }
      return a;
    },
    stopMuzAudio () {
      if (this.current_music instanceof Audio) {
        this.current_music.SFXStop ();
        this.bgm_enabled = false;
      }
    },
    onSFXComplete (audio_instance) {
      if (audio_instance instanceof Audio) {
        audio_instance.SFXStop ();
      }
    },
    SFXSmartPlayRandVolume (audio_instance) {
      if (audio_instance instanceof Audio) {
        if (this.sfx_enabled) {
          audio_instance.volume = Math.random () * 0.9 + 0.1;
          audio_instance.SFXPlay ();
        }
      }
    },
    SFXSmartPlay (audio_instance) {
      if (audio_instance instanceof Audio) {
        if (this.sfx_enabled) {
          audio_instance.SFXPlay ();
        }
      }
    },
    SFXFadeOut (target, span_sec) {
      if (target === undefined) return;
      if (target instanceof Audio) {
        // if (target.currentTime > 0) {
        this.$GSLite.to (target, span_sec, { volume : 0, ease : Power1.easeOut, delay : 0.1 });
        this.$GSLite.eventCallback ("onComplete", this.onSFXComplete, [target]);
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
        this.audio.bet_adjust.SFXPlay ();
      }
    },
    SFxAdjustBet () {
      if (this.sfx_enabled) {
        this.audio.bet_adjust.SFXPlay ();
      }
    },
    SFxUIClick () {
      //if (this.sfx_enabled) {
      this.audio.click_ui_sys.SFXPlay ();
      // }
    },
    SFxStartBet () {
      //bet request
      if (this.audio.start_bet.paused && this.sfx_enabled) {
        this.audio.start_bet.SFXPlay ();
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
      this.sfx_enabled = !this.sfx_enabled;
      this.bgm_enabled = !this.bgm_enabled;
      //console.log ("toggle music");
      if (!this.sfx_enabled) {
        if (this.current_music instanceof Audio) {
          this.current_music.SFXNoSound ();
        }


        if (this.audio.bet_music instanceof Audio) {
          this.audio.bet_music.SFXNoSound ();
        }


        if (this.audio.result_show instanceof Audio) {
          this.audio.result_show.SFXNoSound ();
        }

      } else {
        if (this.current_music instanceof Audio) {
          this.current_music.SFXResumeSound (true);
        }

        if (this.audio.bet_music instanceof Audio) {
          this.audio.bet_music.SFXResumeSound (true);
        }

        if (this.audio.result_show instanceof Audio) {
          this.audio.result_show.SFXResumeSound (true);
        }
      }

      //  console.log ("toggle music");
      // if (!this.sfx_enabled) {
      //  this.playMusic ();
      // } else {
      //  this.stopAudio ();
      // }

      if (this.bet.sfx_enabled) {
        this.notificationInfo ("SFX is ON");
      } else {
        this.notificationInfo ("SFX is OFF");
      }
    },
  }
}
