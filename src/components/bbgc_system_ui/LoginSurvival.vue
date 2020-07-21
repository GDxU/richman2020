<template>
  <div class="flexcontainx grid control_planel_view">
    <div class="flexhitem flex-banner control_face_cover">
      <div v-if="!login_process">
        <input type="text"
               class="input-login"
               inputmode="latin text"
               pattern="[\.0-9A-Za-z@]" placeholder="email"
               id="account"
               v-model="account_blank"/>
        <input type="password"
               class="input-login"
               inputmode="latin text"
               pattern="[\.0-9A-Za-z@]" placeholder="password"
               id="password"
               v-model="password_blank"/>
        <a class="btn-3d small gold ready_bet" @click="login_account">Login</a>
        <p>
          <nuxt-link class="bbg_login_back" to="#nec32k" @click.native="$emit('back')">
            <small>return 返回</small>
          </nuxt-link>

          <nuxt-link class="bbg_login_back" to="#nec32k" @click.native="$emit('forgetpw')">
            <small>forgot?</small>
          </nuxt-link>
        </p>
      </div>
      <div v-else>
                    <span style="vertical-align: middle">
                        {{status_text}}
                    </span>
      </div>
    </div>
  </div>
</template>
<script>
  import { EventBus } from '../../plugins/EventBus'

  export default {
    name : "loginControl",
    props : ["after_login_page"],
    data () {
      return {
        login_process : false,
        password_blank : "",
        account_blank : "",
        status_text : "Checking...",
      }
    },
    methods : {
      login_account () {
        if (this.password_blank === "" || this.account_blank === "") {
          return
        }
        this.login_process = true;
        this.status_text = "Checking...";
        //  const link = e.target.text;
        EventBus.$emit ("login_pass", {
          Pass : this.password_blank,
          Email : this.account_blank,
        });
        setTimeout (() => {
          this.status_text = "登录超时 ... ";
          setTimeout (() => {
            this.login_process = false;
          }, 3000)
        }, 4000)
      },
      login_response (res) {
        if (res.code === 1) {
          this.status_text = "Login Success ...";
          setTimeout (() => {
            this.status_text = "Now ...";
            // this.$router.back ()
            if (this.after_login_page instanceof Object) {
              this.$router.push (this.after_login_page)
            } else {
              this.$router.push (this.after_login_page)
            }
          }, 1000)
        } else {
          this.status_text = "Login Failure ...";
          if (res.code === 1319) {
            this.status_text += "\nSomeone else is using it now"
          } else if (res.code === 1320) {
            this.status_text += "\nInvalid password or user name"
          } else {

          }
          this.status_text += "\nTry again...";
          setTimeout (() => {
            this.login_process = false;
          }, 3000)
        }
      }
    },


    mounted () {
      const that = this;
      that.$nextTick (() => {
        EventBus.$on ("login_result", that.login_response);
        if (window) {
          const msg = window.localStorage.getItem ("AUTH");
          if (msg) {
            const auth = JSON.parse (msg);
            that.password_blank = auth.Pass;
            that.account_blank = auth.Email;
          }
        }
      })
    },

    destroyed () {
      EventBus.$off ("login_result", this.login_response);
    }
  }
</script>
<style lang="scss" scoped>

</style>
