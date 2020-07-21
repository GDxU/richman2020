<template>
  <simple-pop v-if="display_window" window_mask="bbg_window_mask">
    <span slot="header" class="advertistment smaller">C0dex</span>
    <div slot="body">
      <div id="share_lnk">
        <textarea v-if="mode===1" v-model="import_data"></textarea>
        <p v-if="mode===0">{{shared_link_data}}</p>
      </div>
    </div>
    <div slot="footer">
      <!--<div class="wgrid">-->
      <div class="row">
        <div class="col col-1-of-4">
          <button @click="mode=1">IMPORT DATA</button>
        </div>
        <div class="col col-1-of-4">
          <button @click="mode=0">EXPORT DATA</button>
        </div>
        <div class="col col-2-of-4" v-if="import_data!==''&&mode ===1">
          <button @click="loadData">CONFIRM LOAD</button>
        </div>
      </div>
      <div class="row">
        <div class="bg-c0 position-c0" @click="display_window=false"></div>
      </div>
    </div>
    <!-- </div>-->
  </simple-pop>
</template>

<style scoped lang="scss">
  .advertistment {
    color: #ccc;
  }

  .position-c0 {
    position: relative;
  }

  $position_mustache: 205px;
  $box_height: 350px;
  $backgroundColor: #0a2e38;
  #share_lnk {
    background-color: $backgroundColor;
    color: #ccc;
    margin: 0 auto;
    h4 {
      text-align: center;
      font-size: 1em;
      margin: 0;
      padding: 0.3em 0;
      color: whitesmoke;
    }
    p {
      font-size: 0.5em;
      text-align: center;
      color: whitesmoke;
      overflow-wrap: break-word;
      padding: 10px;
      height: $box_height;
      overflow-y: auto;
      overflow-x: hidden;
    }
    textarea {
      //   text-align: center;
      //   color: whitesmoke;
      //    padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
      //      height: $box_height;
      //     background-color: $backgroundColor;
      width: 100%;
      height: 305px;
      -moz-border-bottom-colors: none;
      -moz-border-left-colors: none;
      -moz-border-right-colors: none;
      -moz-border-top-colors: none;
      background: none repeat scroll 0 0 rgba(0, 0, 0, 0.07);
      border-color: -moz-use-text-color #FFFFFF #FFFFFF -moz-use-text-color;
      border-image: none;
      border-radius: 6px 6px 6px 6px;
      border-style: none solid solid none;
      border-width: medium 1px 1px medium;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12) inset;
      color: #555555;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 1em;
      line-height: 1.4em;
      padding: 5px 8px;
      transition: background-color 0.2s ease 0s;

    }
    &:before {
      content: "{";
      position: absolute;
      font-size: 10em;
      top: $position_mustache;
      left: 0;
      animation: beforemove 3s ease infinite;

    }

    &:after {
      content: "}";
      position: absolute;
      font-size: 10em;
      top: $position_mustache;
      right: 0;
      animation: aftermove 3s ease infinite;
    }
  }

  @keyframes beforemove {
    0% {
      left: 0px;
    }
    33% {
      left: 100px;
    }
    66% {
      left: 100px;
    }
    100% {
      left: 0px;
    }
  }

  @keyframes aftermove {
    0% {
      right: 0px;
    }
    33% {
      right: 100px;
    }
    66% {
      right: 100px;
    }
    100% {
      right: 0px;
    }
  }

</style>

<script>
  import SimplePop from "../util/SimplePop";
  import MapMaker from "../../plugins/mono_2dx/MapMaker"

  export default {
    components : { SimplePop },
    name : "codex",
    data () {
      return {
        shared_link_data : "",
        import_data : "",
        display_window : false,
        mode : 0,
      }
    },
    methods : {
      loadData (e) {
        e.preventDefault ();
        const text = this.import_data;
        if (MapMaker.isValidMapData (text)) {
          this.display_window = false;
          this.$emit ("load", text);
        }
      },
      pipelineCodex (message) {
        this.shared_link_data = message;
      },
      toggleDisplayBox () {
        this.display_window = !this.display_window;
      }
    }
  }
</script>
