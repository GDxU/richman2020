<template>
    <section class="pad_area">
        <div class="section_title">
            {{label}}
        </div>
        <div class="gbet flexhitem flex-banner">
            <div class="xbody">
                <div class="xbtn"
                     :key="index"
                     v-for="(cell,index) in cells"
                     :class="cell.selected ? 'active':''"
                     @click="g(cell)">
                    {{cell.num}}
                </div>
            </div>
            <div class="rcontrollist">
                <div class="qqt">
                    <div class="qbtn" @click="bfull" :class="lastbtn === 'full'?'active':''">全</div>
                </div>
                <div class="qqt">
                    <div class="qbtn" @click="bbg" :class="lastbtn === 'big'?'active':''">大</div>
                </div>
                <div class="qqt">
                    <div class="qbtn" @click="bsmall" :class="lastbtn === 'small'?'active':''">小</div>
                </div>
                <div class="qqt">
                    <div class="qbtn" @click="bodd" :class="lastbtn === 'odd'?'active':''">奇</div>
                </div>
                <div class="qqt">
                    <div class="qbtn" @click="beven" :class="lastbtn === 'even'?'active':''">偶</div>
                </div>
                <div class="qqt">
                    <div class="qbtn" @click="cls">清</div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

    import { EventBus } from '../../plugins/EventBus'

    function array_removeAt (index) {
        var i;
        if (index < this.length) {
            for (i = index; i < this.length - 1; i++) {
                this[i] = this[i + 1];
            }
            this.length = this.length - 1;
        }
    }

    Array.prototype.removeAt = array_removeAt;


    export default {
        name : "PaddingControl",
        props : ['label'],
        data () {
            return {
                cells : [
                    { num : '0', selected : false },
                    { num : '1', selected : false },
                    { num : '2', selected : false },
                    { num : '3', selected : false },
                    { num : '4', selected : false },
                    { num : '5', selected : false },
                    { num : '6', selected : false },
                    { num : '7', selected : false },
                    { num : '8', selected : false },
                    { num : '9', selected : false },
                ],
                lastbtn : "",
                selected : []
            }
        },
        computed : {},
        methods : {
            ResultInput () {
                return this.selected.map ((a, i, arr) => {
                    return String (a)
                });
            },
            RestoreSelections (arr) {
                // console.log ("check arr", arr);
                if (arr == undefined) return;
                this.selected = arr;
                this.displaync ();
            },
            IsFilled () {
                return this.selected.length > 0;
            },
            displaync () {
                for (var i = 0; i < this.cells.length; i++) {
                    this.cells[i].selected = false;
                }
                for (var i = 0; i < this.selected.length; i++) {
                    var assigned = this.selected[i];
                    this.cells[assigned].selected = true;
                }
                EventBus.$emit ('padControlUpdate', {
                    selected : this.selected,
                    enabled : this.selected.length > 0,
                });
            },
            /*  display_ui () {
                  for (var i = 0; i < this.selected.length; i++) {
                      var assigned = this.selected[i];
                      var obj = this.$refs["b" + assigned];
                      obj.class.push ("active");
                  }
              },*/
            g (ev) {
                // var n = parseInt (ev.target.innerText);
                // this.addNumber (n);
                // console.log (ev)
                var num_select = parseInt (ev.num);
                //this.addNumber (parseInt (num_select));
                var addnu = true;
                for (var i = 0; i < this.selected.length; i++) {
                    if (this.selected[i] === num_select) {
                        this.selected.removeAt (i);
                        addnu = false;
                    }
                }
                if (addnu) {
                    this.selected.push (num_select)
                }
                this.displaync ();
            },
            bfull () {
                this.selected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                this.lastbtn = "full";
                this.displaync ();
            },
            beven () {
                this.selected = [0, 2, 4, 6, 8];
                this.lastbtn = "even";
                this.displaync ();
            },
            bodd () {
                this.selected = [1, 3, 5, 7, 9];
                this.lastbtn = "odd";
                this.displaync ();
            },
            bsmall () {
                this.selected = [0, 1, 2, 3, 4];
                this.lastbtn = "small";
                this.displaync ();
            },
            bbg () {
                this.selected = [5, 6, 7, 8, 9];
                this.lastbtn = "big";
                this.displaync ();
            },
            cls () {
                this.selected = [];
                this.lastbtn = "cls";
                this.displaync ();
            },
        }
    }
</script>
<style lang="scss" scoped>


    $byall: #cccccc;
    $bycolor: #474747;
    $blight: #feff20;
    $btnxxsize: 40px;
    $btnqxxsize: 39px;

    @mixin ball {
        /*  box-shadow: 0 1px 5px #ccc;*/
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        box-shadow: 0 0 0 1px $byall inset,
        0 0 0 2px rgba(206, 206, 206, 0.44) inset,
        0 0 0 1px rgba(68, 68, 68, 0.72);
        border: 1px #6c6965 solid;
        color: $bycolor;
        text-shadow: #c5c5c5 1px 1px 5px;
        border-radius: 50%;
        text-align: center;
        vertical-align: middle;
        width: $btnxxsize;
        height: $btnxxsize;
        font-family: "IED";
        cursor: pointer;
        display: block;

        background: linear-gradient(to bottom, #dadada 0%, #afabaa 100%);
        line-height: 41px;

        letter-spacing: -1px;
        text-decoration: none;
        font-size: 20px;
        margin-right: 6px;
        margin-left: 6px;

        transition-property: background-color;
        transition-duration: 1.3s;
        transition-timing-function: ease;
    }

    @mixin buttoncontrol {

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        width: $btnqxxsize;
        height: $btnqxxsize;
        cursor: pointer;
        color: #0a2e38;
        background: linear-gradient(to bottom, #fff 0%, #f8f3f0 100%);
        line-height: 38px;
        border: 1px #b8a341 solid;
        border-radius: 20%;
        font-size: 10px;
        margin: 2px;
    }

    .section_title {
        width: 100%;
        line-height: 32px;
        padding-left: 10px;
    }

    .gbet {
        flex-wrap: nowrap;
        display: -webkit-flex; /* Safari */
        display: flex;

        .xbody {
            flex-wrap: wrap;
            display: -webkit-flex; /* Safari */
            display: flex;
            order: 1;
            .xbtn {
                @include ball;
                &.active {
                    background: linear-gradient(to bottom, #ffc264 0%, #ad6e69 100%);
                    text-shadow: #fff -0.7px 1.7px 1.1em;
                    box-shadow: 0 0 5px 1px $blight inset;
                    color: #ad0802;
                    border: 1px #d21e25 solid;

                    // background-image: linear-gradient(270deg, #4d3250, #9f5492, #ff9e4f);
                    /*  background-size: 400% 400%;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      animation: AnimationName 15s ease infinite;
                      @keyframes AnimationName {
                          0% {
                              background-position: 0% 50%
                          }
                          50% {
                              background-position: 100% 50%
                          }
                          100% {
                              background-position: 0% 50%
                          }
                      }
  */
                }
            }
            /*
                        @supports (-webkit-background-clip: text) {
                            .xbtn.active {
                                -webkit-background-clip: text;
                                //   background-repeat: no-repeat;
                                // background-image: url('https://www.apple.com/v/iphone-xs/a/images/overview/copy_texture_2_large.jpg');
                                background-image: linear-gradient(270deg, #4d3250, #9f5492, #ff9e4f);
                                background-size: 100% auto;
                                color: transparent;
                            }
                        }*/

        }

        .rcontrollist {
            flex-wrap: nowrap;
            display: -webkit-flex; /* Safari */
            display: flex;
            order: 2;
            .qqt {
                height: 100%;
                display: contents;
                .qbtn {
                    flex-wrap: wrap;
                    @include buttoncontrol;
                    &.active {
                        background: linear-gradient(to bottom, #d2cc86 0%, #a28b2a 100%);
                        text-shadow: #fff -0.7px 1.7px 1.1em;
                        color: yellow;
                    }
                }
            }

        }
    }

</style>