import { EventBus } from "./EventBus";
var WsBasis = (function () {
    function WsBasis() {
    }
    WsBasis.EventEmitCommit = function (commit, socket, tag, socket_emit_tag, commit_name) {
        EventBus.$on(tag, function (msg) {
            socket.Emit(socket_emit_tag, JSON.stringify(msg));
            commit(commit_name, msg);
            if (socket_emit_tag === "auth") {
                window.localStorage.setItem("AUTH", JSON.stringify(msg));
            }
        });
    };
    WsBasis.EventEmit = function (socket, tag, socket_emit_tag) {
        EventBus.$on(tag, function (msg) {
            socket.Emit(socket_emit_tag, JSON.stringify(msg));
            if (socket_emit_tag === "auth") {
                window.localStorage.setItem("AUTH", JSON.stringify(msg));
            }
        });
    };
    WsBasis.takeCommitOnly = function (commit, commit_name, msg) {
        if (msg === "")
            return;
        try {
            var bjson = JSON.parse(msg);
            commit(commit_name, bjson);
        }
        catch (e) {
            console.error("server internal error message ", e, msg);
        }
    };
    WsBasis.takeEventBusOnly = function (commit, event_name, msg) {
        if (msg === "")
            return;
        try {
            var bjson = JSON.parse(msg);
            var props = window.localStorage.getItem("errorproperties");
            if (props) {
                var result = WsBasis.filter_erro(bjson, props);
                if (result) {
                    EventBus.$emit("ws_error", result);
                }
            }
            EventBus.$emit(event_name, bjson);
        }
        catch (e) {
            console.error("server internal error message ", e, msg);
        }
    };
    WsBasis.takeEventChildCommitOnly = function (commit, msg, commit_name, child) {
        if (msg === "")
            return;
        try {
            var bjson = JSON.parse(msg);
            if (bjson.hasOwnProperty(child)) {
                commit(commit_name, bjson[child]);
            }
        }
        catch (e) {
        }
    };
    WsBasis.takeAllChannels = function (commit, commit_name, event_name, msg) {
        if (msg === "")
            return;
        try {
            var bjson = JSON.parse(msg);
            commit(commit_name, bjson);
            EventBus.$emit(event_name, bjson);
        }
        catch (e) {
            console.error("server internal error message ", e, msg);
        }
    };
    WsBasis.takeLogOnly = function (msg) {
        console.log("log recv message ", msg);
    };
    WsBasis.err = function (msg) {
        console.error("server internal error message ", msg);
    };
    WsBasis.filter_erro = function (json_payload, errorproperties) {
        if (json_payload.code !== 1) {
            if (errorproperties.hasOwnProperty(json_payload.code)) {
                return errorproperties[json_payload.code];
            }
            else {
                return "unknown error (" + json_payload.code + ")";
            }
        }
        else {
            return false;
        }
    };
    WsBasis.prototype.messageProcess = function (msg, success) {
        var that = this;
        try {
            var json = JSON.parse(msg);
            if (json.hasOwnProperty("code")) {
                if (json.code === 1) {
                    success(json);
                }
                else {
                    that.failure_response(json);
                }
            }
            else {
                success(json);
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    WsBasis.prototype.failure_response = function (json) {
    };
    return WsBasis;
}());
export default WsBasis;
