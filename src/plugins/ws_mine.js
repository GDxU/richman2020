var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import WsBasis from "./wsBase";
import { EventBus } from "./EventBus";
import Vue from "vue";
import CxSocket from "../plugins/cxsock";
var WsMineClient = (function (_super) {
    __extends(WsMineClient, _super);
    function WsMineClient(_a, int_options) {
        var commit = _a.commit;
        var _this = _super.call(this) || this;
        var csx = {
            A: "ws://161.",
            V: "117.8",
            O: "4.89:202",
            C: "1",
            P: "/ws"
        };
        var list_ws = csx.A + csx.V + csx.O + csx.C;
        var socket_ws = new CxSocket(list_ws + csx.P, null, "ssc");
        socket_ws.forceStringMessageType();
        socket_ws.OnConnect(function () {
            if (typeof int_options === "object") {
                socket_ws.Emit("start", JSON.stringify(int_options));
            }
            else {
                socket_ws.Emit("start", "");
            }
            console.log("connected now ");
            EventBus.$emit("connected", "back to connected");
        });
        socket_ws.OnDisconnect(function () {
            EventBus.$emit("disconnected", "You are now disconnected. Please refresh.. 你现在离线了。");
        });
        socket_ws.On("init", function (msg) {
            WsBasis.takeCommitOnly(commit, "INIT_MINE_GAME", msg);
        });
        socket_ws.On("auth_request", function (data_bet) {
            WsBasis.takeAllChannels(commit, "LOGIN_RESULT", "login_result", data_bet);
        });
        socket_ws.On("bank_update", function (data_bet) {
            WsBasis.takeAllChannels(commit, "UPDATE_BANK", "pot_update", data_bet);
        });
        socket_ws.On("endgame", function (msg) {
            WsBasis.takeCommitOnly(commit, "ANNOUNCE_GAME_RESULT", msg);
        });
        socket_ws.On("player_update", function (msg) {
            WsBasis.takeCommitOnly(commit, "PLAYER_BET_UPDATE", msg);
        });
        socket_ws.On("draw", function (msg) {
            WsBasis.takeEventBusOnly(commit, "draw_result", msg);
        });
        socket_ws.On("bet", function (msg) {
            WsBasis.takeEventBusOnly(commit, "bet_result", msg);
        });
        WsBasis.EventEmitCommit(commit, socket_ws, "request_start_game_monster_mine", "bet", "GAME_START");
        WsBasis.EventEmit(socket_ws, "request_draw_step_monster_mine", "draw");
        WsBasis.EventEmit(socket_ws, "login_mine_ssc", "auth");
        WsBasis.EventEmit(socket_ws, "join_game", "sub");
        WsBasis.EventEmit(socket_ws, "exit_game", "unsub");
        WsBasis.EventEmit(socket_ws, "request_snapshot_data_packet", "snapshot_load");
        socket_ws.On("recover_pass", function (msg) {
            WsBasis.takeEventBusOnly(commit, "passwrecovery_response", msg);
        });
        socket_ws.On("recover_verify", function (msg) {
            WsBasis.takeEventBusOnly(commit, "passwrecverif_response", msg);
        });
        WsBasis.EventEmit(socket_ws, "request_fgpw_send", "recover_pass");
        WsBasis.EventEmit(socket_ws, "request_fgpw_setup", "recover_verify");
        return _this;
    }
    WsMineClient.dedicated_pot_ls = function (commit, msg) {
        if (msg === "")
            return;
        try {
            var object_filled = JSON.parse(msg);
            commit("pot_ls_update", object_filled.p);
            commit("append_block_history", object_filled);
        }
        catch (e) {
            console.error("server internal error dedicated_pot_ls ", e, msg);
        }
    };
    WsMineClient.last_update_wallet = function (state, wallet_payloads) {
        if (typeof wallet_payloads !== "object")
            return;
        wallet_payloads.forEach(function (coin_payload, a, b) {
            if (String(coin_payload.c).trim() === "")
                return;
            var coinName = String(coin_payload.c).toLowerCase();
            var paylo = {
                b: coin_payload.b,
                l: coin_payload.l,
                c: coinName,
            };
            if (state.profile_wallet.hasOwnProperty(coinName)) {
                state.last_update_wallet_info.coin = coinName;
                state.last_update_wallet_info.gain = state.profile_wallet[coinName].b < coin_payload.b;
            }
            Vue.set(state.profile_wallet, coinName, paylo);
        });
    };
    return WsMineClient;
}(WsBasis));
export default WsMineClient;
