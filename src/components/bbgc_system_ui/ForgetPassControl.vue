<template>
    <div class="flexcontainx grid control_planel_view">
        <div class="flexhitem flex-banner control_face_cover">
            <div v-if="!inprocess && step_x ===1">
                <span>Please enter your email</span>
                <input type="text"
                       class="input-login"
                       inputmode="latin text"
                       pattern="[\.0-9A-Za-z@]" placeholder="email"
                       id="account"
                       v-model="account_blank"/>
                <a class="btn-3d red ready_bet dyn" @click="search_account">Recover Password</a>
                <p>
                    <nuxt-link class="bbg_login_back" to="#nec32k" @click.native="$emit('back')">
                        <small>Return 返回</small>
                    </nuxt-link>
                </p>
            </div>

            <div v-if="!inprocess && step_x ===2">
                <span>Please check your email in {{account_blank}}.</span>
                <input type="text"
                       class="input-login"
                       inputmode="latin text"
                       pattern="[\.0-9@]" placeholder="code"
                       id="code"
                       v-model="email_code"/>
                <input type="text"
                       class="input-login"
                       inputmode="latin text"
                       pattern="[\.0-9@]" placeholder="password"
                       id="pass1"
                       v-model="pass_1"/>
                <input type="text"
                       class="input-login"
                       inputmode="latin text"
                       pattern="[\.0-9@]" placeholder="confirm password"
                       id="pass2"
                       v-model="pass_2"/>
                <a class="btn-3d red ready_bet dyn" @click="account_reset">Password Reset</a>
                <p>
                    <nuxt-link class="bbg_login_back" to="#nec32k" @click.native="$emit('back')">
                        <small>Return 返回</small>
                    </nuxt-link>
                </p>
            </div>

            <div v-if="inprocess">
                    <span>
                        {{status_text}}
                    </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { EventBus } from '../../plugins/EventBus'

    export default {
        name : "forget-pass-control",
        props : ["after_login_page"],
        data () {
            return {
                step_x : 1,
                pass_1 : "",
                pass_2 : "",
                inprocess : false,
                account_blank : "",
                email_code : "",
                status_text : "Please wait ...",
            }
        },
        methods : {
            search_account () {
                if (this.account_blank === "") {
                    return
                }
                this.inprocess = true;
                this.status_text = "Please wait ...";
                //  const link = e.target.text;
                EventBus.$emit ("request_fgpw_send", {
                    Email : this.account_blank,
                });

                setTimeout (() => {
                    this.status_text = "超时 ... ";
                    setTimeout (() => {
                        this.inprocess = false;
                    }, 3000)
                }, 20000)
            },
            account_reset () {
                if (this.account_blank === "") {
                    return
                }
                this.inprocess = true;
                this.status_text = "Please wait ...";
                //  const link = e.target.text;
                EventBus.$emit ("request_fgpw_setup", {
                    Email : this.account_blank,
                    Pass : this.pass_1,
                    Code : this.email_code,
                });

                setTimeout (() => {
                    this.status_text = "超时 ... ";
                    setTimeout (() => {
                        this.inprocess = false;
                    }, 3000)
                }, 20000)
            },
            passw_recover (res) {
                if (res.code === 1) {
                    this.status_text = "Recover Success you can now check your email";
                    setTimeout (() => {
                        this.step_x = 2;
                    }, 4000)
                } else {
                    this.status_text = "Login Failure ...";
                    if (res.code === 1319) {
                        this.status_text += "Someone else is using it now"
                    } else if (res.code === 1320) {
                        this.status_text += "Invalid password or user name"
                    } else {
                        this.status_text += "  " + res.code
                    }
                    this.status_text += "Try again...";
                    setTimeout (() => {
                        this.inprocess = false;
                    }, 3000)
                }
            },
            verify_acc (res) {
                if (res.code === 1) {
                    this.status_text = "Password reset successful";
                    setTimeout (() => {
                        this.$emit ('back');
                    }, 4000)
                } else {
                    this.status_text = "Verification failure ...";
                    this.status_text += "  " + res.code;
                    setTimeout (() => {
                        this.inprocess = false;
                    }, 3000)
                }
            }
        },
        mounted () {
            EventBus.$on ("passwrecovery_response", this.passw_recover);
            EventBus.$on ("passwrecverif_response", this.verify_acc);
        },
        destroyed () {
            EventBus.$off ("passwrecovery_response", this.passw_recover);
            EventBus.$off ("passwrecverif_response", this.verify_acc);
        }
    }

</script>
<style scoped>

</style>