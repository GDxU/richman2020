<template>
  <div id="field_box">
    <div class="toplayer">
      <field-box-b :key="index" v-for="(bigma,index) in grams" :x="bigma.x" :y="bigma.y" :i="bigma.i"/>
    </div>
    <div class="midlayer"></div>
    <div class="bottomlayer"></div>
  </div>
</template>
<script>
  import FieldBoxB from "./FieldBoxCell"
  import { EventBus } from "../../plugins/EventBus"

  function sort_unique (arr) {
    return arr.sort ().filter (function (el, i, a) {
      return (i === a.indexOf (el));
    });
  }

  function shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor (Math.random () * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  export default {
    name : "FieldBox",
    components : { FieldBoxB },
    data () {
      return {
        opened : 0,
        lvl1h : 5,
        lvl1w : 5,
        lvl1m : 0,
        mineField : [],
        grams : [],
        picked_n : -1,
        playLock : false,
        audio : {
          bellhit : new Audio ("https://freesound.org/people/minerjr/sounds/89977/download/89977__minerjr__ballhit.wav"),
          gem : new Audio ("http://adrianpayne.me/game/assets/sounds/gem.mp3"),
          pop2 : new Audio ("http://adrianpayne.me/game/assets/sounds/pop2.mp3"),
          pop1 : new Audio ("http://adrianpayne.me/game/assets/sounds/pop1.mp3"),
          loop1 : new Audio ("https://freesound.org/people/deleted_user_4338788/sounds/263377/download/263377__deleted-user-4338788__paddling-in-lake-sukamakaka.mp3")
        }
      }
    },
    computed : {
      minefieldres : {
        get () {
          return this.$store.state.game_rf_explain;
        },
        set (val) {
        }
      },
      bet_amount : {
        get () {
          return this.$store.state.bet_amount;
        },
        set (val) {
        }
      },
    },
    watch : {
      minefieldres : {
        handler : function (arr, oldarr) {
          for (var k = 0; k < arr.length; k++) {
            var u = arr[k];
            if (u >= 0) {
              EventBus.$emit ("fb:K", arr[k]);
            }
          }
          this.indicateWinner (arr);
        },
        deep : true
      }
    },
    methods : {
      indicateWinner (arr) {
        var index = arr.indexOf (this.picked_n);
        if (index === -1) {
          //  console.log ("flagged callId", this.picked_n);
          EventBus.$emit ("fb:flagwin", this.picked_n);
          this.audio.gem.play ();
        }
      },
      taggingf (j) {
        return "bx" + j;
      },

      placingDigit () {
        for (let i = 0; i < this.lvl1h; i++) {
          for (let j = 0; j < this.lvl1w; j++) {
            if (this.mineField[i][j] === 9) {
              for (let ii = -1; ii <= 1; ii++) {
                for (let jj = -1; jj <= 1; jj++) {
                  if (ii !== 0 || jj !== 0) {
                    if (this.tileValue (i + ii, j + jj) !== 9 && this.tileValue (i + ii, j + jj) !== -1) {
                      this.mineField[i + ii][j + jj]++;

                    }
                  }
                }
              }
            }
            if (this.mineField[i][j] === 30) {
            }
          }
        }
      },

      runNum () {
        var self = this;
        var sh = [];
        EventBus.$emit ("fb:C");
        for (var k = 0; k < 25; k++) {
          sh.push (k);
        }
        self.audio.bellhit.play ();
        //  sh = sort_unique (sh);
        sh = shuffle (sh);
        const wait_t = 2850;
        setTimeout (() => {
          var j = 0, h = setInterval (() => {
            if (j < 25) {
              EventBus.$emit ("fb:H", sh[j]);
              self.audio.pop2.play ();
              j++;
            } else {
              clearInterval (h);
            }
          }, 50);
        }, 100);
        setTimeout (() => {
          EventBus.$emit ("fb:showresult", self.picked_n);
          self.playLock = false;
        }, wait_t);
      },

      tileValue (row, col) {
        if (this.mineField[row] === undefined || this.mineField[row][col] === undefined) {
          return -1;
        } else {
          return this.mineField[row][col];
        }
      },

      setup () {
        let self = this;
        let h = 0;
        this.mineField = [];
        //creating on array
        for (let i = 0; i < this.lvl1h; i++) {
          this.mineField[i] = [];
          for (let j = 0; j < this.lvl1w; j++) {
            this.mineField[i].push (0);
          }
        }
        for (let i = 0; i < this.lvl1h; i++) {
          for (let j = 0; j < this.lvl1w; j++) {
            this.grams.push ({
              x : i,
              y : j,
              i : h
            });
            h++;
          }
        }
        EventBus.$on ("fb:ProposalNum", (c) => {
          if (!self.playLock && self.bet_amount > 0) {
            self.picked_n = c;
            self.playLock = true;
            self.runNum ();
            // console.log ("click on here", c);
            EventBus.$emit ("fb:PickConfirmed", c);
          }
        })
      },
    },

    mounted : function () {
      let self = this;
      this.$nextTick (self.setup);
    }
  }
</script>
<style lang="scss">
  @import "~assets/styles/core/utilities/coloru";
  @import "~assets/styles/core/utilities/fun";
  @import "~assets/styles/core/_bootstrap-variables";
  @import "~assets/styles/core/_animate";

  $skull_image: "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4IiB2aWV3Qm94PSIwIDAgOTkuMzc1IDk5LjM3NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgOTkuMzc1IDk5LjM3NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik01MC4zNjMsNTkuOTIxYzAuMTYyLDAuNzk2LDAuODA3LDEuMzgsMS42MjQsMS42MDhjMC40MTQsMC4xMTMsMC44NjksMC4xNDQsMS4zMzgsMC4wNDcgICAgYzAuNTY2LTAuMTE0LDEuMDUxLTAuMzg3LDEuNDE0LTAuNzQ0YzAuNTMzLTAuNTIxLDAuODA3LTEuMjI3LDAuNjYyLTEuOTM4Yy0wLjI0NC0xLjE5OS0xLjU2Ni0xLjkzOS0yLjk1OS0xLjY1NiAgICBjLTAuMzQ0LDAuMDctMC42NiwwLjE5NS0wLjkzNSwwLjM2M2MtMC44MzgsMC41MS0xLjMyLDEuNDA2LTEuMTQ2LDIuMzAzTDUwLjM2Myw1OS45MjF6IiBmaWxsPSIjRkZGRkZGIi8+CgkJPHBhdGggZD0iTTcxLjQ2MiwzNC44MDFjLTAuNDY3LTYuNDkxLTQuNDMtMTAuNjkzLTcuOTUzLTE0LjQyNmMtMi42MTQtMi43NzEtNC45ODUtNS4yODQtNi4wNzctOC40OTkgICAgYzAuMzM0LTAuNDg0LDAuNTMyLTEuMDY5LDAuNTMyLTEuNzAxVjQuMTUzYzAtMC4xNjMtMC4wMjItMC4zMi0wLjA0OS0wLjQ3N2MwLjc5My0wLjIxOCwxLjM4MS0wLjkzOCwxLjM4MS0xLjgwMSAgICBjMC0xLjAzNi0wLjg0LTEuODc1LTEuODc1LTEuODc1SDQxLjc5NmMtMS4wMzUsMC0xLjg3NSwwLjgzOS0xLjg3NSwxLjg3NWMwLDAuODYzLDAuNTg2LDEuNTgzLDEuMzc5LDEuODAxICAgIGMtMC4wMjUsMC4xNTYtMC4wNDcsMC4zMTMtMC4wNDcsMC40Nzd2Ni4wMjJjMCwwLjY5MywwLjI0NCwxLjMyNCwwLjYzOSwxLjgzMmMtMS4xMTEsMy4xNTEtMy40NDcsNS42MzUtNi4wMjcsOC4zNjggICAgYy0zLjUyMywzLjczMi03LjQ4NCw3LjkzNS03Ljk1MywxNC40MjZoLTAuMDQ3djU5LjU3NGMwLDIuNzU3LDIuMjQ0LDUsNSw1SDY2LjUxYzIuNzU2LDAsNS0yLjI0Myw1LTVWMzQuODAxSDcxLjQ2MnogICAgIE02Ny41MDksOTQuMzc2YzAsMC41NTItMC40NDgsMS0xLDFIMzIuODY1Yy0wLjU1MSwwLTEtMC40NDgtMS0xVjgwLjE0MUg2Ny41MUw2Ny41MDksOTQuMzc2TDY3LjUwOSw5NC4zNzZ6IE00My4zMjIsNDkuNDE4ICAgIGMxLjgyNC0xLjkwNyw0LjI2LTIuMjI4LDUuOTQ1LTIuMjAxYzIuNjUsMC4wNDQsMy44ODUsMC42MzgsNC45NjMsMS4zMzJjMC41NjcsMC4zNjYsMS4wMzMsMC43OTUsMS40MjQsMS4yNjRsMi4wOTItMi4wODggICAgYy0wLjEtMC45My0wLjExMy0yLjA1NywwLjI2Ni0yLjY1NWMwLjA4LTAuMTU2LDAuMTgtMC4zLDAuMzEyLTAuNDI5YzAuNDQ4LTAuNDUyLDEuMDk0LTAuNTk0LDEuNjY1LTAuNDI5ICAgIGMwLjI2NywwLjA3NywwLjUxNywwLjIxOSwwLjcyOCwwLjQyOWMwLjM2OSwwLjM3LDAuNTMzLDAuODY5LDAuNDg4LDEuMzU0YzAuNDg1LTAuMDQ2LDAuOTgxLDAuMTE2LDEuMzU0LDAuNDg3ICAgIGMwLjIwOSwwLjIxLDAuMzUyLDAuNDYxLDAuNDMsMC43MjVjMC4xNjQsMC41NzQsMC4wMjEsMS4yMTYtMC40MywxLjY2N2MtMC4xMzEsMC4xMy0wLjI3NSwwLjIzMi0wLjQyOSwwLjMxMSAgICBjLTAuNjAxLDAuMzgxLTEuNzI4LDAuMzYzLTIuNjU1LDAuMjY2bC0yLjU4NiwyLjU4NWMwLjYzNywxLjg3NSwwLjUzNCwzLjg4MywwLjE4NCw1LjE2OWMtMC4zOTEsMS40NTMtMC4wNywyLjgyMi0wLjA3LDIuODIyICAgIGMxLjE5NSwxLjQxMiwwLjcxNywyLjUyLDAuNzE3LDIuNTJjLTAuMDc2LDAuMzQ0LTAuMjUsMC41OTgtMC40NzksMC43ODZsMi4yMzQsMi4yMzVjMC45MjgtMC4wOTgsMi4wNTUtMC4xMTIsMi42NTMsMC4yNjcgICAgYzAuMTU2LDAuMDc4LDAuMywwLjE4MSwwLjQzMywwLjMxM2MwLjQ1MSwwLjQ1MSwwLjU5MiwxLjA5NCwwLjQyOCwxLjY2OGMtMC4wNzYsMC4yNjQtMC4yMTksMC41MTQtMC40MjgsMC43MjUgICAgYy0wLjM3MywwLjM2OS0wLjg3MSwwLjUzMy0xLjM1NCwwLjQ4OGMwLjA0NSwwLjQ4Ni0wLjExNywwLjk4NC0wLjQ4NywxLjM1NGMtMC4yMSwwLjIxLTAuNDYyLDAuMzU0LTAuNzI4LDAuNDMgICAgYy0wLjU3LDAuMTY0LTEuMjE2LDAuMDIyLTEuNjY2LTAuNDNjLTAuMTMyLTAuMTI4LTAuMjM0LTAuMjczLTAuMzEyLTAuNDI5Yy0wLjM4MS0wLjU5OS0wLjM2Ny0xLjcyOC0wLjI2OC0yLjY1NGwtMy40NDMtMy40NDQgICAgYy0wLjk3NywwLjMyNi0wLjg1LDIuMjcxLTAuODUsMi4yNzFjLTAuMjAzLDEuNzM0LTAuOTU1LDEuNzM0LTAuOTU1LDEuNzM0Yy0wLjcyMywwLjA1OS0wLjY5NS0xLjA3MS0wLjY5NS0xLjA3MSAgICBjLTAuMDI3LTEuMDY5LTAuMjAxLTEuMTg3LTAuMjAxLTEuMTg3Yy0wLjQ2NS0wLjMxNy0wLjQ2MywxLjQ0Ni0wLjQ2MywxLjQ0NmMtMC4xNDUsMS4xMDEtMC45ODQsMC44NDEtMC45ODQsMC44NDEgICAgYy0wLjU3OC0wLjIwMy0wLjcyMy0yLjIyOS0wLjcyMy0yLjIyOWMtMC40OTUtMC41MjEtMC40OTUsMC44NjgtMC40OTUsMC44NjhjLTAuMjAzLDEuNTkzLTAuNzIzLDEuMjczLTAuNzIzLDEuMjczICAgIGMtMC45MjYsMC4wODgtMC43ODEtMS4zNjEtMC43ODEtMS4zNjFjMC4wMzEtMS4yNDQtMC41Mi0wLjcyMy0wLjUyLTAuNzIzYy0wLjA4OCwyLjA4NC0wLjU3OCwyLjExMy0wLjU3OCwyLjExMyAgICBjLTAuOTU3LDAuMTc0LTEuMDQxLTAuOTI4LTEuMDQxLTAuOTI4Yy0wLjEyOS0xLjU0My0wLjM3MS0yLjMwNy0wLjU4Mi0yLjY4OGwtMy4wOCwzLjA4MWMwLjA5NiwwLjkyOCwwLjExNSwyLjA1NS0wLjI2OCwyLjY1MiAgICBjLTAuMDc4LDAuMTU0LTAuMTgsMC4zMDItMC4zMDksMC40MzFjLTAuNDUzLDAuNDQ4LTEuMDk2LDAuNTkzLTEuNjY2LDAuNDI3Yy0wLjI2OC0wLjA3Ni0wLjUxOC0wLjIxOS0wLjcyOS0wLjQyNyAgICBjLTAuMzY5LTAuMzcxLTAuNTMzLTAuODctMC40ODgtMS4zNTRjLTAuNDg0LDAuMDQ1LTAuOTgyLTAuMTE3LTEuMzU0LTAuNDg1Yy0wLjIwOS0wLjIxMS0wLjM1LTAuNDYzLTAuNDI4LTAuNzI4ICAgIGMtMC4xNjYtMC41NzItMC4wMjEtMS4yMTcsMC40MjgtMS42NjhjMC4xMzEtMC4xMjksMC4yNzctMC4yMzEsMC40My0wLjMwOWMwLjU5OC0wLjM4MywxLjcyNS0wLjM2NSwyLjY1Mi0wLjI2OGwxLjk4Ni0xLjk4NiAgICBjLTEuNzA5LTAuNzA5LTEuMTcyLTIuNTU1LTAuNjIxLTMuMTM1YzAuNjg2LTAuNzIxLDAuNTc4LTEuNzM1LDAuNTc4LTEuNzM1Yy0xLjEyOS0zLjQ3Mi0wLjM5MS01Ljk3Ni0wLjM5MS01Ljk3NiAgICBjMC4xMzctMC40NTUsMC4zMDUtMC44NjEsMC40ODQtMS4yNDZsLTIuMDM5LTIuMDM4Yy0wLjkyNiwwLjA5OS0yLjA1MywwLjExNC0yLjY1LTAuMjY3Yy0wLjE1OC0wLjA3OC0wLjMwMy0wLjE4MS0wLjQzMi0wLjMwOSAgICBjLTAuNDQ5LTAuNDUzLTAuNTk0LTEuMDk0LTAuNDI4LTEuNjY3YzAuMDc0LTAuMjY2LDAuMjE5LTAuNTE2LDAuNDI4LTAuNzI3YzAuMzcxLTAuMzcsMC44NzEtMC41MzMsMS4zNTQtMC40ODkgICAgYy0wLjA0NS0wLjQ4MywwLjExNy0wLjk4MSwwLjQ4Ni0xLjM1MWMwLjIxMS0wLjIxLDAuNDYxLTAuMzUyLDAuNzI3LTAuNDI5YzAuNTcyLTAuMTY1LDEuMjE3LTAuMDIzLDEuNjY2LDAuNDI5ICAgIGMwLjEzMSwwLjEyOCwwLjIzNCwwLjI3MywwLjMxMSwwLjQyN2MwLjM4MywwLjU5OCwwLjM2NSwxLjcyNiwwLjI3LDIuNjU2TDQzLjMyMiw0OS40MTh6IE02Ny41MDksMzYuNTQySDMxLjg2NXYtMC40NTggICAgYzAtNS42NDIsMy4zNTctOS4xOTgsNi45MS0xMi45NjNjMi42NDYtMi44MDUsNS41MjktNS44NjgsNi45MzQtOS45NDZoNy45NTdjMS40MDQsNC4wNzgsNC4yODcsNy4xNDEsNi45MzQsOS45NDYgICAgYzMuNTUzLDMuNzY1LDYuOTEsNy4zMjEsNi45MSwxMi45NjNMNjcuNTA5LDM2LjU0Mkw2Ny41MDksMzYuNTQyeiIgZmlsbD0iI0ZGRkZGRiIvPgoJCTxwYXRoIGQ9Ik00NC4yNDIsNjEuMjNjMC4yNjgsMC4xNTgsMC41NjgsMC4yODEsMC44OTYsMC4zNDdjMS4zOTMsMC4yODQsMi43MTctMC40NTcsMi45NjEtMS42NTcgICAgYzAuMTM5LTAuNjk3LTAuMTIzLTEuMzkzLTAuNjM5LTEuOTExYy0wLjM2Ny0wLjM2OC0wLjg1Ny0wLjY1MS0xLjQzOC0wLjc3MWMtMS4zOTMtMC4yODItMi43MTcsMC40NTctMi45NjEsMS42NTYgICAgQzQyLjg3OCw1OS44MDksNDMuMzc4LDYwLjcyMSw0NC4yNDIsNjEuMjN6IiBmaWxsPSIjRkZGRkZGIi8+CgkJPHBhdGggZD0iTTQ4LjAzOSw2Mi4zNTljMCwwLjM1MiwwLjE0MywwLjY1NCwwLjM1NywwLjgxM2MwLjEsMC4wNzIsMC4yMTMsMC4xMTUsMC4zMzQsMC4xMTVjMC4yMTUsMCwwLjQwNC0wLjEzMiwwLjUzMS0wLjMzNiAgICBjMC4xMjcsMC4yMDQsMC4zMTgsMC4zMzYsMC41MzMsMC4zMzZjMC4xMTksMCwwLjIzMi0wLjA0MywwLjMzNC0wLjExNWMwLjIxMS0wLjE1OSwwLjM1Ny0wLjQ2MiwwLjM1NS0wLjgxMyAgICBjMC0wLjA5OC0wLjAxMi0wLjE5NC0wLjAzMy0wLjI4NWMtMC4xMTktMC43MTctMS4xODktMS42MTgtMS4xODktMS42MThzLTEuMDcsMC45MDEtMS4xODksMS42MTggICAgQzQ4LjA1Miw2Mi4xNjYsNDguMDM5LDYyLjI2LDQ4LjAzOSw2Mi4zNTl6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";

  #field_box {
    width: 200px;
    height: 200px;
    cursor: pointer;

    .bottomlayer {
      background: url(https://i.imgur.com/zEHCn1o.png);
      animation: animatedBackground 10s linear infinite;
      background-size: 100%;
      width: 200px;
      height: 200px;
      position: absolute;
      display: block;
      z-index: 0;
    }

    .midlayer {
      background: -moz-linear-gradient(top, rgba(252, 252, 252, 0.26) 0%, rgba(235, 243, 249, 0.38) 13%, rgba(178, 213, 240, 0.7) 58%, rgba(125, 185, 232, 0) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, rgba(252, 252, 252, 0.26) 0%, rgba(235, 243, 249, 0.38) 13%, rgba(178, 213, 240, 0.7) 58%, rgba(125, 185, 232, 0) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, rgba(252, 252, 252, 0.26) 0%, rgba(235, 243, 249, 0.38) 13%, rgba(178, 213, 240, 0.7) 58%, rgba(125, 185, 232, 0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#42fcfcfc", endColorstr="#007db9e8", GradientType=0); /* IE6-9 */
      width: 200px;
      height: 200px;
      z-index: 1;
      position: absolute;
      animation: animatedBackgroundaWave 8s linear infinite;
    }

    .toplayer {
      width: 200px;
      height: 200px;
      z-index: 2;
      position: absolute;
    }

    .box {
      cursor: pointer;
      display: block;
      float: left;
      width: 40px;
      height: 40px;
      border: 1px solid #222;
      z-index: 1;
      font-size: 12px;
      font-weight: bold;
      @include shadow_c(0, 0, 2px, rgb(163, 31, 31))
    }

    .highlight {
      @include animation_blink_once(1s)
    }

    .bomb {
      display: inline-block;
      // border: 1px solid #ff2800;
      // border-radius: 7px;
      // background-image: url("~/assets/img/human-skull.svg");
      // background-image: url("~/assets/img/poison-bottle.png");

      /* -webkit-background-image: url($skull_image);
       -moz-background-image: url($skull_image);
       background-image: url($skull_image);*/
      /* background-image:   linear-gradient(
                       90deg,
                       transparent 79px,
                       #abced4 79px,
                       #abced4 81px,
                       transparent 81px
       ),
       linear-gradient(
                       #eee .1em,
                       transparent .1em
       );*/
      // background: url(https://3.bp.blogspot.com/-mySu8dy4ux4/ULiVKS4YBbI/AAAAAAAAAR0/vBMi_4dAPDE/s400/rajiv+dixit+s.jpg);
      //https://image.flaticon.com/icons/svg/1045/1045254.svg
      //https://image.flaticon.com/icons/svg/1047/1047604.svg
      //background: url(https://image.flaticon.com/icons/svg/1045/1045254.svg);
      //background: url("~assets/svg/skull.svg");
      background: url("~assets/img/dice.png");
      background-size: contain;
      animation: haunted 2s infinite;
    }
    .flagged {
      display: inline-block;
      //background: url(https://image.flaticon.com/icons/svg/827/827184.svg);
      // background: url("~assets/svg/flago3.svg");
      background: url("~assets/img/knife_xa.png");
      background-size: cover;
    }
    .bombflagged {
      //  background: url(https://image.flaticon.com/icons/png/512/1009/1009983.png);
      //background: url(https://image.flaticon.com/icons/svg/877/877410.svg);
      // background: url("~assets/svg/boatpit.svg");
      background: url("~assets/img/poison-bottle.png");
      background-size: cover;
      background-color: #ff2800;
    }
    .flaggedwin {
      //  background: url(https://image.flaticon.com/icons/svg/1037/1037049.svg);
      //  background: url("~assets/svg/ca3.svg");
      background: url("~assets/img/cup_aw.png");
      background-size: cover;
      animation: diamond_shines 3s infinite;
    }
    .opened {
      background: #777;
    }
    .checked, .checked:hover {

    }
    :after {
      content: ".";
      visibility: hidden;
      display: block;
      height: 0;
      clear: both;
    }

    a#again {
      clear: both;
      display: block !important;
      text-decoration: none;
      background: #fff;
      width: 200px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 13px;
      color: #333;
      font-weight: bold;
      border-radius: 5px;
      margin: auto;
    }

  }

  .dark_place {
    background: linear-gradient(0deg, rgba(71, 102, 102, 1) 0%, rgba(6, 6, 5, 1) 100%);
  }

  .pirvatemines {
    .vue-slider-piecewise {
      // background: url("~assets/svg/bones.svg");
      background: url("~assets/img/hammered.png");
      background-size: 250px;
      background-position: 17px -38px;
    }
  }

  .table_proend {
    font-size: small;
    .headline {
      color: $tron
    }
    .profit {
      @include shadow_low()
    }

  }

  .fuxContainer {
    width: 50px;
    height: 50px;
    .box {
      display: block;
      float: left;
      width: 10px;
      height: 10px;
      border: 1px solid #222;
      z-index: 1;
      font-size: 12px;
      font-weight: bold;
      @include shadow_c(0, 0, 1px, rgb(8, 0, 203));
      &.reward {
        background-color: $tron;
      }
      &.bomb {
        background-color: #731616;
        &.active {
          background-color: $red;
        }
      }
    }

  }
</style>
