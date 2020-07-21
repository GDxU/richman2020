<template>
  <section id="indexbox" class="container indexcolor">
    <div class="backee lightgrass">

    </div>
    <div class="flexhitem grid">
      <top-money-header ref="wallet_bar_module"/>
    </div>
    <div class="flexhitem grid">
      <bg_monoploy_mapmaker ref="mapmaker"/>
      <div class="flex-row row">
        <div class="col col-1-of-4 qbtnswitch" @click="exit_game">Exit</div>
        <div class="col col-1-of-3 qbtnswitch" @click="toggle_audio_switch"
             :class="sfx_enabled?'sound-enabled':'sound-disabled'">
          {{sfx_enabled?"🔉 AUDIO":"🔇 AUDIO"}}
        </div>
        <div class="col col-1-of-3 qbtnswitch" @click="toggleShowPath">
          {{showpath?"SHOW PATH 🅾️️":"SHOW PATH ❎"}}
        </div>
        <div class="col col-1-of-3 qbtnswitch" @click="toggleCodex">
          C0DEX
        </div>
      </div>
    </div>
    <codex ref="codex_box"/>
  </section>
</template>

<script>
  import TopMoneyHeader from "../components/bigbang/TopMoneyHeader";
  import WalletSimple from "../components/bigbang/WalletSimple";
  import BankRollList from "../components/bigbang/BankRollList";
  import sfxMines from "../plugins/mixins/minesweep/miniGameMines"
  import sndbase from "../plugins/mixins/minesweep/audiobase"
  import StringFilter from "../plugins/mixins/tools/string_tx"
  import Bg_monoploy_mapmaker from "../components/monoploy/bg_monoploy_mapmaker";
  import Codex from "../components/monoploy/Codex";

  export default {
    mixins : [sndbase, sfxMines, StringFilter],
    components : {
      Codex,
      Bg_monoploy_mapmaker,
      BankRollList,
      WalletSimple,
      TopMoneyHeader,
    },
    name : "app_mono_maker",
    methods : {
      exit_game () {
        this.$router.push ("/")
      },
      toggleShowPath () {
        this.showpath = !this.showpath;
        this.SFxUIClick ();
      },
      toggleCodex (e) {
        e.preventDefault ();
        const { codex_box, wallet_bar_module } = this.$refs;
        codex_box.toggleDisplayBox ();
      }
    },
    data () {
      return { showpath : false }
    },
    mounted () {
      const that = this;
      const { mapmaker, codex_box, wallet_bar_module } = that.$refs;
      that.$nextTick (() => {
        mapmaker.$on ("link", ({ content, err }) => {
          if (err === "") {
            codex_box.pipelineCodex (content);
          }
         // console.log ("link is now up", content)
        });
        codex_box.$on ("load", function (data) {
          mapmaker.loadMapData (data);
        });
        //const { wallet_bar_module } = that.$refs;
      })
    }
  }
</script>
<style scoped>

</style>
