<template>
    <span @click="tileClick" :data-id="callId" :data-column="c" :data-row="r" class="box first"
          :class="classObject"></span>
</template>

<script>
  import { EventBus } from "../../plugins/EventBus"

  export default {
    name : "field-box-b",
    props : ["x", "y", "i"],
    data () {
      return {
        callId : this.i,
        c : this.y,
        r : this.x,
        classObject : {
          "highlight" : false,
          "flagged" : false,
          "bombflagged" : false,
          "flaggedwin" : false,
          "bomb" : false
        }
      }
    },
    methods : {
      tileClick (e) {
        const c = parseInt (e.target.attributes["data-id"].value);
        // EventBus.$emit ("raffle:click", c);
        EventBus.$emit ("fb:ProposalNum", c);
      },
      load_fp () {
        const that = this;
        //  this.$elCC = $ ("span[data-id=" + this.callId + "]");
        //  this.$elCC.classList.toggle ("bomb");
        EventBus.$on ("fb:PickConfirmed", function (n) {
          // console.log (msg)
          if (n === that.callId) {
            that.classObject.flagged = true;
          }
        });
        EventBus.$on ("fb:H", function (n) {
          // console.log (msg)
          if (n === that.callId) {
            if (that.classObject.flagged) return;
            that.classObject.highlight = true;
            that.classObject.bomb = false;
          }
        });
        EventBus.$on ("fb:CC", () => {
          that.classObject.flagged = false;
          that.classObject.highlight = false;
          that.classObject.bomb = false;
          that.classObject.bombflagged = false;
        });
        EventBus.$on ("fb:C", () => {
          //  if (that.classObject.flagged) return;
          that.classObject.highlight = false;
          that.classObject.bomb = false;
          that.classObject.flagged = false;
          that.classObject.bombflagged = false;
          that.classObject.flaggedwin = false;
        });
        //indicated as bomb
        EventBus.$on ("fb:K", (n) => {
          if (n === that.callId) {
            if (that.classObject.flagged) {
              that.classObject.bombflagged = true;
              that.classObject.highlight = false;
              that.classObject.bomb = false;
            } else {
              that.classObject.bomb = true;
              that.classObject.highlight = false;
            }
          }
        });
        EventBus.$on ("fb:flagged", (n) => {
          if (n === that.callId) {
            that.classObject.flagged = true;
          }
        });
        EventBus.$on ("fb:flagwin", (n) => {
          //      console.log ("flagged callId", that.callId);
          if (n === that.callId) {
            //      console.log ("flagged winning");
            that.classObject.flagged = false;
            that.classObject.flaggedwin = true;
          }
        });
      }
    },
    mounted : function () {
      let self = this;
      this.$nextTick (self.load_fp);
    }
  }
</script>

<style scoped>

</style>
