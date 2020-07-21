var CxSocket = (function () {
    function CxSocket(endpoint, protocols, prefix) {
        var _this = this;
        this.isReady = false;
        this.websocketMessagePrefix = prefix;
        this.websocketStringMessageType = 0;
        this.websocketIntMessageType = 1;
        this.websocketBoolMessageType = 2;
        this.websocketJSONMessageType = 4;
        this.websocketMessageSeparator = ";";
        this.websocketMessagePrefixLen = this.websocketMessagePrefix.length;
        this.websocketMessageSeparatorLen = this.websocketMessageSeparator.length;
        this.websocketMessagePrefixAndSepIdx = this.websocketMessagePrefixLen + this.websocketMessageSeparatorLen - 1;
        this.websocketMessagePrefixIdx = this.websocketMessagePrefixLen - 1;
        this.websocketMessageSeparatorIdx = this.websocketMessageSeparatorLen - 1;
        this.connectListeners = [];
        this.disconnectListeners = [];
        this.nativeMessageListeners = [];
        this.messageListeners = {};
        if (!window["WebSocket"]) {
            return;
        }
        if (endpoint.indexOf("ws") === -1) {
            endpoint = "ws://" + endpoint;
        }
        if (protocols != null && protocols.length > 0) {
            this.conn = new WebSocket(endpoint, protocols);
        }
        else {
            this.conn = new WebSocket(endpoint);
        }
        this.conn.onopen = function (evt) {
            _this.fireConnect();
            _this.isReady = true;
            return null;
        };
        this.conn.onclose = function (evt) {
            _this.fireDisconnect();
            return null;
        };
        this.conn.onmessage = function (evt) {
            _this.messageReceivedFromConn(evt);
        };
    }
    CxSocket.prototype.forceStringMessageType = function () {
        this.websocketJSONMessageType = this.websocketStringMessageType;
    };
    CxSocket.prototype.isNumber = function (obj) {
        return !isNaN(obj - 0) && obj !== null && obj !== "" && obj !== false;
    };
    CxSocket.prototype.isString = function (obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    };
    ;
    CxSocket.prototype.isBoolean = function (obj) {
        return typeof obj === 'boolean' ||
            (typeof obj === 'object' && typeof obj.valueOf() === 'boolean');
    };
    ;
    CxSocket.prototype.isJSON = function (obj) {
        return typeof obj === 'object';
    };
    ;
    CxSocket.prototype._msg = function (event, websocketMessageType, dataMessage) {
        return this.websocketMessagePrefix + ":" + event + this.websocketMessageSeparator + String(websocketMessageType) + this.websocketMessageSeparator + dataMessage;
    };
    ;
    CxSocket.prototype.encodeMessage = function (event, data) {
        var m = "";
        var t = 0;
        if (this.isNumber(data)) {
            t = this.websocketIntMessageType;
            m = data.toString();
        }
        else if (this.isBoolean(data)) {
            t = this.websocketBoolMessageType;
            m = data.toString();
        }
        else if (this.isString(data)) {
            t = this.websocketStringMessageType;
            m = data.toString();
        }
        else if (this.isJSON(data)) {
            t = this.websocketJSONMessageType;
            m = JSON.stringify(data);
        }
        else if (data !== null && typeof (data) !== "undefined") {
            console.log("unsupported type of input argument passed, try to not include this argument to the 'Emit'");
        }
        return this._msg(event, t, m);
    };
    ;
    CxSocket.prototype.decodeMessage = function (event, websocketMessage) {
        var skipLen = this.websocketMessagePrefixLen + this.websocketMessageSeparatorLen + event.length + 2;
        if (websocketMessage.length < skipLen + 1) {
            return null;
        }
        var websocketMessageType = parseInt(websocketMessage.charAt(skipLen - 2));
        var theMessage = websocketMessage.substring(skipLen, websocketMessage.length);
        if (websocketMessageType == this.websocketIntMessageType) {
            return parseInt(theMessage);
        }
        else if (websocketMessageType == this.websocketBoolMessageType) {
            return Boolean(theMessage);
        }
        else if (websocketMessageType == this.websocketStringMessageType) {
            return theMessage;
        }
        else if (websocketMessageType == this.websocketJSONMessageType) {
            return JSON.parse(theMessage);
        }
        else {
            return null;
        }
    };
    ;
    CxSocket.prototype.getWebsocketCustomEvent = function (websocketMessage) {
        if (websocketMessage.length < this.websocketMessagePrefixAndSepIdx) {
            return "";
        }
        var s = websocketMessage.substring(this.websocketMessagePrefixAndSepIdx, websocketMessage.length);
        var evt = s.substring(0, s.indexOf(this.websocketMessageSeparator));
        return evt;
    };
    ;
    CxSocket.prototype.getCustomMessage = function (event, websocketMessage) {
        var eventIdx = websocketMessage.indexOf(event + this.websocketMessageSeparator);
        var s = websocketMessage.substring(eventIdx + event.length + this.websocketMessageSeparator.length + 2, websocketMessage.length);
        return s;
    };
    CxSocket.prototype.messageReceivedFromConn = function (evt) {
        var that = this;
        var message = evt.data;
        if (message.indexOf(that.websocketMessagePrefix) !== -1) {
            var event_1 = that.getWebsocketCustomEvent(message);
            if (event_1 != "") {
                that.fireMessage(event_1, that.getCustomMessage(event_1, message));
                return;
            }
        }
        that.fireNativeMessage(message);
    };
    CxSocket.prototype.OnConnect = function (fn) {
        if (this.isReady) {
            fn();
        }
        this.connectListeners.push(fn);
    };
    CxSocket.prototype.OnDisconnect = function (fn) {
        this.disconnectListeners.push(fn);
    };
    ;
    CxSocket.prototype.fireConnect = function () {
        for (var i = 0; i < this.connectListeners.length; i++) {
            this.connectListeners[i]();
        }
    };
    CxSocket.prototype.fireDisconnect = function () {
        for (var i = 0; i < this.disconnectListeners.length; i++) {
            this.disconnectListeners[i]();
        }
    };
    CxSocket.prototype.OnMessage = function (cb) {
        this.nativeMessageListeners.push(cb);
    };
    CxSocket.prototype.fireNativeMessage = function (websocketMessage) {
        for (var i = 0; i < this.nativeMessageListeners.length; i++) {
            this.nativeMessageListeners[i](websocketMessage);
        }
    };
    CxSocket.prototype.On = function (event, cb) {
        if (this.messageListeners[event] == null || this.messageListeners[event] == undefined) {
            this.messageListeners[event] = [];
        }
        this.messageListeners[event].push(cb);
    };
    CxSocket.prototype.fireMessage = function (event, message) {
        var str = new String(event);
        var event_final = str.substring(1, str.length);
        if (event_final === "ping") {
            return this.firePong();
        }
        if (this.messageListeners.hasOwnProperty(event_final)) {
            var cast = this.messageListeners[event_final];
            for (var i = 0; i < cast.length; i++) {
                cast[i](message);
            }
        }
    };
    CxSocket.prototype.firePong = function () {
        this.Emit("pong", "");
    };
    CxSocket.prototype.Disconnect = function () {
        this.conn.close();
    };
    CxSocket.prototype.EmitMessage = function (websocketMessage) {
        this.conn.send(websocketMessage);
    };
    CxSocket.prototype.Emit = function (event, data) {
        var messageStr = this.encodeMessage(event, data);
        this.EmitMessage(messageStr);
    };
    return CxSocket;
}());
export default CxSocket;
