<template>
  <section id="indexbox" class="container indexcolor">
    <div class="backee home">
      <bg_psx/>
    </div>
    <div class="toplayer">
      <div class="sublogo col-md">
        <div class="img_exx_logo"></div>
        <div class="img_exx_logo"></div>
        <div class="img_exx_logo"></div>
      </div>

      <marquee>
        <h2 class="subtitle">{{top_message}}</h2>
      </marquee>

      <div class="box-wrap" v-if="step===0">
        <nuxt-link to="#blockhistory" class="box" @click.native="resultlist">
          <p>Results</p>
        </nuxt-link>
        <nuxt-link to="#instructions" class="box" @click.native="instr">
          <p>Help</p>
        </nuxt-link>
      </div>

      <div class="box-wrap" v-else-if="step===1">
        <login-control :after_login_page="direct_page" @back="step=0" @forgetpw="step=2"/>
      </div>

      <div class="box-wrap" v-else-if="step===2">
        <forgot-pass :after_login_page="direct_page" @back="step=1" @password_success_sent="step=1"/>
      </div>

      <div class="box-wrap" v-else-if="step===3">
        <game-results @back="step=0"/>
      </div>

      <div class="box-wrap" v-else-if="step===4">
        <instructions @back="step=0"/>
      </div>


      <div class="sublogo col-md">
        <div class="img_exx_logo"></div>
        <div class="img_exx_logo"></div>
        <div class="img_exx_logo"></div>
      </div>

    </div>

    <!-- <simple-pop v-if="connectionDialog" window_mask="bbg_window_mask" window_background_class="bbg_warning_window">
       <h3 slot="header">Error</h3>
       <div slot="body">
         {{message_notice}}
       </div>
       <div slot="footer">
         <a href="/" @click="redirec">
           <p>Ok</p>
         </a>
       </div>
     </simple-pop>-->

  </section>
</template>
<script>


  import { EventBus } from '../plugins/EventBus'
  import LoginControl from '../components/bbgc_system_ui/LoginControl'
  import Bg_movingcity from "../components/background/bg_movingcity";
  import ForgotPass from "../components/bbgc_system_ui/ForgetPassControl";
  import Instructions from "../components/bbgc_system_ui/Instructions";
  import GameResults from "../components/bbgc_system_ui/GameResults";
  import Bg_psx from "../components/background/bg_psx";
  import soundbase from "../plugins/mixins/mixinbb/bbGameSFXBase"
  import sndff from "../plugins/mixins/mixinbb/bbGameSFXFirework"

  export default {
    mixins : [soundbase, sndff],
    components : {
      Bg_psx,
      GameResults,
      Bg_movingcity,
      LoginControl,
      Instructions,
      ForgotPass
    },
    computed : {
      islogin : {
        get () {
          return this.$store.state.is_login
        }
      }
    },
    watch : {
      step (val) {
        this.SFxUIClick ();
      }
    },
    data () {
      return {
        top_message : "Happy New Year!",
        players : 0,
        timer_xx : 0,
        step : 0,
        direct_page : "",
        connectionDialog : true,
        message_notice : "",
        connection_status : 0,
        messages_pre : [
          "Are you ready?!",
          "Get the hell out!",
          "The X winner is you!"
        ],
        show_extended : false,
        dev_debug : false,
      }
    },
    beforeMount () {
      const dat = this;
      EventBus.$on ('viewcount', count => {
        dat.players = count;
      });
      //console.log ('beforeMount mount action is now started.')
      EventBus.$on ('betstatus', info => {
      });
    },
    mounted () {
      const that = this;
      that.$nextTick (() => {
        that.toggleMusic ()
      });
    },
    created () {
      const dat = this;
      dat.$nextTick (() => {
        // console.log ("query ko:", dat.$route.query);
        dat.$store.dispatch ('wsInit', dat.$route.query);
        this.message_notice = "You are still connecting..";
        this.connection_status = 102;
        this.connectionDialog = true;
        //console.log ('r', dat.$route);
        /*
        if (dat.$route.hash == "#ext") {
          dat.show_extended = true;
        } else if (dat.$route.hash == "#extdebug") {
          dat.dev_debug = true;
        }
        */
      });
    },
    beforeCreate () {
      //   console.log('registerWeb3 Action dispatched from casino-dapp.vue');
    },
    methods : {
      mainLoginV5 () {
        const hashblock = this.$route.hash.split ("#");
        if (hashblock[1] !== "") {
          this.directionPage ({
            name : "bbgv4cx",
            query : { j : hashblock[1] }
          });
        }
      },
      mainGamemo () {
        this.directionPage ("/bbgcfirework");
      },
      resultlist () {
        this.direct_page = "game_hash";
        this.step = 3;
      },
      instr () {
        this.direct_page = "game_instructions";
        this.step = 4;
      },
      directionPage (pid) {
        if (this.islogin) {
          this.$router.push (pid);
        } else {
          this.direct_page = pid;
          this.step = 1;
        }
        this.SFxClick ();
      },
      textRunStart () {
        let g = 0;
        this.timer_xx = setInterval (() => {
          this.top_message = this.messages_pre[g % this.messages_pre.length];
          g++;
        }, 22000)
      },
      disconnected_popbox () {
        this.connection_status = 101;
        this.message_notice = "You have disconnected. Please try again..";
        this.connectionDialog = true;
      },
      connected_ca () {
        this.connection_status = 0;
        this.message_notice = "";
        this.connectionDialog = false;
      },
      redirec () {
        if (this.connection_status === 101) {
          if (window !== undefined) {
            window.location = process.env.BASE_URL;
          }
        }
      }
    },
    mounted () {
      const dat = this;
      // dat.$store.dispatch ('registerWeb3');
      EventBus.$on ("connected", this.connected_ca);
      EventBus.$on ("disconnected", this.disconnected_popbox);
      this.$nextTick (() => {
        dat.textRunStart ()
      })
    },
    destroyed () {
      EventBus.$off ("connected", this.connected_ca);
      EventBus.$off ("disconnected", this.disconnected_popbox);
    }
  }
</script>
<style lang="scss">
  .subtitle {
    color: white;
    font-family: "MBS";
  }

  .box-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10%;
    margin-left: 10%;
    margin-bottom: 10%;

    .box {
      padding: 30px;
      margin: 2%;
      background: #606261;
      width: 30%;
      border: 1px solid #d6d6d6;
      box-shadow: 0 2px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      transition: .2s all;
      color: white;
      cursor: pointer;
      text-decoration: none;
    }

    &:hover .box {
      filter: blur(3px);
      opacity: .5;
      transform: scale(.98);
      box-shadow: none;
    }

    &:hover .box:hover {
      transform: scale(1);
      filter: blur(0px);
      opacity: 1;
      box-shadow: 0 8px 20px 0px rgba(0, 0, 0, 0.125);
    }

  }

  @media(min-width: 510px) {
    .box-wrap {
      .midlogo.box {
        .logo {
          width: 76px;
          height: 76px;
        }
        width: 216px;
        p {
          margin-left: 20px;
        }
      }
    }
  }

  @media(max-width: 510px) {
    .box-wrap {
      display: flex;
      flex-direction: column;
      .box {
        width: 100%;
      }
    }

    .midlogo.box {
      p {
        margin-left: 40px;
      }
    }
  }
</style>

