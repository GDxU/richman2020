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
import CxSocket from "./cxsock";
var WsMineClient = (function (_super) {
    __extends(WsMineClient, _super);
    function WsMineClient(_a, int_options) {
        var commit = _a.commit;
        var _this = _super.call(this) || this;
        var socket_ws = new CxSocket("ws://localhost:2025/ws", null, "iris-websocket-message");
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
        socket_ws.On("ping", function (msg) {
            socket_ws.Emit("pong", "");
        });
        socket_ws.On("rollin", function (json) {
            WsBasis.takeCommitOnly(commit, "update_game_result_dice", json);
        });
        socket_ws.On("rafflin", function (json) {
            WsBasis.takeCommitOnly(commit, "update_game_result_raffle", json);
        });
        socket_ws.On("rt", function (json) {
            if (json === "")
                return;
            var jsb = JSON.parse(json);
            if (jsb.gid === 1) {
                commit("append_gh1", jsb);
            }
            if (jsb.gid === 2) {
                commit("append_gh2", jsb);
            }
        });
        socket_ws.On("ebzinfo", function (json) {
            WsBasis.takeCommitOnly(commit, "roulette_updates", json);
        });
        socket_ws.On("ebzact", function (json) {
            WsBasis.takeCommitOnly(commit, "roulette_action", json);
        });
        socket_ws.On("ebzl", function (json) {
            WsBasis.takeCommitOnly(commit, "roulette_players", json);
        });
        socket_ws.On("ebz", function (json) {
            WsBasis.takeCommitOnly(commit, "roulette_result", json);
        });
        socket_ws.On("initsub", function (json) {
            WsBasis.takeAllChannels(commit, "update_init_kj", "initsub", json);
        });
        socket_ws.On("gp", function (json) {
            WsBasis.takeAllChannels(commit, "in_pg_update", "ingamepg", json);
        });
        socket_ws.On("kj", function (json) {
            WsBasis.takeAllChannels(commit, "in_kj", "ingamekj", json);
        });
        socket_ws.On("bet_confirm", function (json) {
            WsBasis.takeAllChannels(commit, "bet_confirm", "bet_confirm", json);
        });
        socket_ws.OnDisconnect(function () {
            EventBus.$emit("disconnect", true);
        });
        WsBasis.EventEmit(socket_ws, "submit_lotto_ticket_exec", "buy_ticket");
        WsBasis.EventEmit(socket_ws, "submit_lotto_ticket_save", "save_ticket");
        WsBasis.EventEmit(socket_ws, "check_result_transaction_id", "check_result_transaction_id");
        return _this;
    }
    return WsMineClient;
}(WsBasis));
export default WsMineClient;
