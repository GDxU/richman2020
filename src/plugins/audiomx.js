import { TimelineLite, Power1 } from "gsap";
var NewAudioSFX = (function () {
    function NewAudioSFX(path) {
        this._gs = new TimelineLite();
        this._audio = new Audio(path);
        this._audio.crossOrigin = "anonymous";
        this._audio.currentTime = 0;
        this._audio.loop = false;
        this._audio.autoplay = false;
        this._enabled = false;
    }
    NewAudioSFX.prototype.muzPlay = function (enabled) {
        if (this._audio.canPlayType("audio/mpeg")) {
            var that_1 = this;
            this._audio.autoplay = false;
            this._audio.currentTime = 0;
            this._audio.loop = true;
            if (!enabled) {
                this.setVolume(0);
            }
            that_1._audio.addEventListener("canplaythrough", function () {
                if (typeof that_1._audio.play === "function") {
                    that_1._audio.play();
                }
            }, false);
            this._enabled = enabled;
        }
        else {
            console.error("does not support mpeg format");
        }
    };
    NewAudioSFX.prototype.setEnable = function (enabled) {
        if (this._audio === undefined)
            return;
        var nowplay = this._audio.currentTime > 0;
        if (enabled) {
            if (nowplay) {
                this.fadeInFast();
            }
            else {
            }
        }
        else {
            if (nowplay) {
                this.fadeOutStop();
            }
        }
        this._enabled = enabled;
    };
    NewAudioSFX.prototype.SFXStop = function () {
        if (typeof this._audio.setCurrentTime === "function") {
            this._audio.setCurrentTime(0);
        }
        this._audio.pause();
    };
    NewAudioSFX.prototype.SFXNoSound = function () {
        if (!this._audio.paused) {
            this._audio.volume = 0;
        }
    };
    NewAudioSFX.prototype.SFXResumeSound = function (x) {
        if (!this._audio.paused) {
            if (typeof x === "boolean") {
                this._audio.volume = 1;
            }
            if (typeof x === "number") {
                var g = Math.abs(x);
                if (g > 0 && g <= 100) {
                    this._audio.volume = x / 100;
                }
                if (g > 0 && g <= 1) {
                    this._audio.volume = g;
                }
            }
        }
    };
    NewAudioSFX.prototype.SFXSmartPlayRandVolume = function () {
        this.setVolume(Math.random() * 0.9 + 0.1);
        this._audio.setCurrentTime(0);
        this._audio.play();
    };
    NewAudioSFX.prototype.SFXPlay = function () {
        if (this._audio.canPlayType("audio/mpeg")) {
            this._audio.volume = 1;
            this._audio.autoplay = false;
            this._audio.currentTime = 0;
            if (typeof this._audio.play === "function") {
                this._audio.play();
            }
        }
        else {
            console.error("does not support mpeg format");
        }
    };
    NewAudioSFX.prototype.SFXStopEnd = function (audiox) {
        console.log(audiox);
        console.log("===");
    };
    NewAudioSFX.prototype.setVolume = function (h) {
        this._audio.volume = h;
    };
    NewAudioSFX.prototype.fadeInFast = function () {
        this._gs.to(this._audio, 1, { volume: 1, ease: Power1.easeOut, delay: 0.0 });
    };
    NewAudioSFX.prototype.fadeOut = function (callback) {
        this._gs.to(this._audio, 2, { volume: 0, ease: Power1.easeOut, delay: 0.1 });
        this._gs.eventCallback("onComplete", callback, [this]);
    };
    NewAudioSFX.prototype.fadeOutStop = function () {
        console.log(this._audio);
        console.log("===ch");
        this._gs.to(this._audio, 2, { volume: 0, ease: Power1.easeOut, delay: 0.1 });
        this._gs.eventCallback("onComplete", this.SFXStopEnd, [this._audio]);
    };
    NewAudioSFX.prototype.fadeOutLast = function (sec, callback) {
        this._gs.to(this._audio, sec, { volume: 0, ease: Power1.easeOut, delay: 0.1 });
        this._gs.eventCallback("onComplete", callback, [this]);
    };
    NewAudioSFX.randSFXList = function (audios) {
        var r = Math.floor(Math.random() * audios.length);
        return audios[r];
    };
    return NewAudioSFX;
}());
export default NewAudioSFX;
