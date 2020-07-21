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
import CxSocket from "../plugins/cxsock";
var WsAppSurvival = (function (_super) {
    __extends(WsAppSurvival, _super);
    function WsAppSurvival(_a, int_options) {
        var commit = _a.commit;
        var _this = _super.call(this) || this;
        var socket_ws = new CxSocket("ws://161.117.84.89:2019/ws", null, "iris-websocket-message");
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
            WsBasis.takeCommitOnly(commit, "init_sock", msg);
        });
        socket_ws.On("auth_request", function (msg) {
            console.log("test", msg);
            WsBasis.takeAllChannels(commit, "login_result", "login_result", msg);
        });
        socket_ws.On("pot_update", function (msg) {
            WsBasis.takeAllChannels(commit, "pot_update", "pot_update", msg);
        });
        socket_ws.On("recover_pass", function (msg) {
            WsBasis.takeEventBusOnly(commit, "passwrecovery_response", msg);
        });
        socket_ws.On("recover_verify", function (msg) {
            WsBasis.takeEventBusOnly(commit, "passwrecverif_response", msg);
        });
        socket_ws.On("player_list_update", function (msg) {
        });
        socket_ws.On("escape_request", function (msg) {
            WsBasis.takeEventBusOnly(commit, "escape_request", msg);
        });
        socket_ws.On("bet_request", function (msg) {
            WsBasis.takeEventBusOnly(commit, "bet_request", msg);
        });
        socket_ws.On("pot_ls_update", function (msg) {
            WsAppSurvival.dedicated_pot_ls(commit, msg);
        });
        socket_ws.On("player_update", function (msg) {
            WsBasis.takeAllChannels(commit, "player_update", "player_update", msg);
        });
        socket_ws.On("snapshot_load", function (msg) {
            WsBasis.takeCommitOnly(commit, "snapshot_load_ec", msg);
        });
        socket_ws.On("bb_status", function (msg) {
            WsBasis.takeEventChildCommitOnly(commit, msg, "bb_extra", "extras");
            WsBasis.takeAllChannels(commit, "bb_status", "bb_status", msg);
        });
        socket_ws.On("profile_update", function (msg) {
            WsAppSurvival.dedicated_profile_update(commit, msg);
        });
        socket_ws.On("bb_tick", function (msg) {
            WsBasis.takeEventBusOnly(commit, "bb_tick", msg);
        });
        WsBasis.EventEmit(socket_ws, "bb_bet", "bet");
        WsBasis.EventEmit(socket_ws, "bb_escape", "escape");
        WsBasis.EventEmit(socket_ws, "login_pass", "auth");
        WsBasis.EventEmit(socket_ws, "join_game", "sub");
        WsBasis.EventEmit(socket_ws, "exit_game", "unsub");
        WsBasis.EventEmit(socket_ws, "request_snapshot_data_packet", "snapshot_load");
        WsBasis.EventEmit(socket_ws, "request_fgpw_send", "recover_pass");
        WsBasis.EventEmit(socket_ws, "request_fgpw_setup", "recover_verify");
        return _this;
    }
    WsAppSurvival.dedicated_profile_update = function (commit, msg) {
        if (msg === "")
            return;
        try {
            var object_filled = JSON.parse(msg);
            commit("user_wallet_renew", object_filled.wallet);
            commit("bb_profile_update", object_filled);
        }
        catch (e) {
            console.error("server internal error dedicated_profile_update ", e);
        }
    };
    WsAppSurvival.dedicated_pot_ls = function (commit, msg) {
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
    WsAppSurvival.UpdateWallet = function (state, wallet_payload) {
        if (typeof wallet_payload !== "object")
            return;
        wallet_payload.forEach(function (coin_payload, a, b) {
            if (String(coin_payload.c).trim() === "")
                return;
            var coin = String(coin_payload.c).toLowerCase();
            var paylo = {
                b: coin_payload.b,
                l: coin_payload.l,
                c: coin,
            };
            if (state.profile_wallet.hasOwnProperty(coin)) {
                state.last_update_wallet_info.coin = coin;
                state.last_update_wallet_info.gain = state.profile_wallet[coin].b < coin_payload.b;
            }
            if (!state.profile_wallet.hasOwnProperty(coin)) {
                state.profile_wallet[coin] = Object.assign({}, paylo);
            }
            else {
                state.profile_wallet[coin] = Object.assign(state.profile_wallet[coin], paylo);
            }
        });
    };
    return WsAppSurvival;
}(WsBasis));
export default WsAppSurvival;
