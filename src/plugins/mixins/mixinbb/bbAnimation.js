import { Power1, TimelineLite, TimelineMax } from "gsap";

const color_g_flash = "rgba(122, 214, 118, 1.0)";
const color_g_flash_z = "rgba(122, 214, 118, 0.0)";
const color_l_flash = "rgba(250, 16, 16, 1.0)";
const color_l_flash_z = "rgba(250, 16, 16, 0.0)";
const color_update_flash = "rgba(239, 239, 37, 1.0)";
const color_update_flash_z = "rgba(239, 239, 37, 0.0)";
const n = "#FFEEDD"
export default {
  data () {
    return {
      animations : {
        flash : true
      }
    }
  },
  mounted () {
    const that = this;
    that.$nextTick (() => {
      that.$GSLite = new TimelineLite ();
    })
  },
  methods : {
    toggleFlash () {
      this.animations.flash = !this.animations.flash;
      this.SFxUIClick ();
    },
    toggleAutoBet () {
      this.bet.autobet = !this.bet.autobet;
      if (this.bet.autobet) {
        this.notificationAlert ("auto play is now ON");
      } else {
        this.notificationSuccess ("auto play is now OFF");
      }
      this.SFxUIClick ();
    },
    fadeOutText (target) {
      if (target === undefined) return;
      this.$GSLite.set (target, { alpha : 1.0 });
      this.$GSLite.to (target, 3, { alpha : 0.0, ease : Power1.easeOut, delay : 2.5 });
    },
    fadeInInstantText (target) {
      if (target === undefined) return;
      this.$GSLite.to (target, 1, { alpha : 0.0, ease : Power1.easeOut, delay : 0 });
    },
    flash (update_el, FromColor, ToColor) {
      if (this.$refs[update_el] === undefined) return;
      const el = this.$refs[update_el];
      this.$GSLite.set (el, { backgroundColor : FromColor });
      this.$GSLite.to (el, 1.19, {
        backgroundColor : ToColor,
        ease : Power1.easeOut,
        delay : 0
      });
    },
    pot_update_top_header_ (coin_, isGain) {
      if (!this.animations.flash) return;
      const update_el = this.header_bank_roll_display ();
      this.flash (update_el, isGain ? color_g_flash : color_l_flash, isGain ? color_g_flash_z : color_l_flash_z);
    },
    pot_update_ (coin_, isGain) {
      if (!this.animations.flash) return;
      //  console.log ("pot_update_ coin_");
      const update_el = this.bankroll_label (coin_);
      this.flash (update_el, isGain ? color_g_flash : color_l_flash, isGain ? color_g_flash_z : color_l_flash_z);
    },
    profile_update_wallet (coin_d, isGain) {
      if (!this.animations.flash) return;
      console.log ("profile_update_wallet coin_");
      //const coin = String (coin_d).toLowerCase ();
      const update_el = this.wallet_label (coin_d);
      this.flash (update_el, isGain ? color_g_flash : color_l_flash, isGain ? color_g_flash_z : color_l_flash_z);
    },
    pot_update (update_ob) {
      // console.log ("pot_update update_ob");
      if (!this.animations.flash) return;
      const update_el = this.betroll_label (update_ob.p.s);
      this.flash (update_el, color_update_flash, color_update_flash_z);
    },
    history_update (json) {
      if (!this.animations.flash) return;
      const label_c = "zhistory";
      const el = this.$refs[label_c];
      if (el === undefined) return;
      if (el.children === undefined) return;
      if (el.children.length === 0) return;
      const row = el.children[0];
      this.$GSLite.set (row, { backgroundColor : color_update_flash });
      this.$GSLite.to (row, 1.19, {
        backgroundColor : color_update_flash_z,
        ease : Power1.easeOut,
        delay : 0
      });
    },
    history_dialog_box_flash (json) {
      if (!this.animations.flash) return;
      const label_c = "zhisto_dialog";
      const el = this.$refs[label_c];
      if (el === undefined) return;
      if (el.children === undefined) return;
      if (el.children.length === 0) return;
      const row = el.children[0];
      this.$GSLite.set (row, { backgroundColor : color_update_flash });
      this.$GSLite.to (row, 1.19, {
        backgroundColor : color_update_flash_z,
        ease : Power1.easeOut,
        delay : 0
      });

      const tl = new TimelineMax ();
      //实现闪烁
      tl.to (light, 0.5, {
        opacity : 1,
        backgroundColor : color_update_flash,
        //闪电闪三次，这里repeat:2个人认为var master = new TimelineMax({repeat: -1});
        //重复第一次的时候，tl.to(light, 0.5, { opacity: 1,repeat: 2,});里重复两遍，共三遍
        repeat : 2, //闪电闪三次
      });
      tl.to (light, 0.25, { opacity : 0 });

    }
  }
}
