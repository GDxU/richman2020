import { Helper } from "./MapMaker";
import { Container, Sprite, utils } from "pixi.js";
import { DigitalWallet } from "./BlockchainCash";
import Animation, { FullSheetAnimation } from "./Animation";
export var FUNC_ID;
(function (FUNC_ID) {
    FUNC_ID[FUNC_ID["PROPERTY"] = 0] = "PROPERTY";
    FUNC_ID[FUNC_ID["BANK"] = 100] = "BANK";
    FUNC_ID[FUNC_ID["SHOP"] = 101] = "SHOP";
    FUNC_ID[FUNC_ID["CASINO"] = 102] = "CASINO";
    FUNC_ID[FUNC_ID["DRAWCARD"] = 103] = "DRAWCARD";
})(FUNC_ID || (FUNC_ID = {}));
var PlayHelper = (function () {
    function PlayHelper() {
    }
    PlayHelper.RandomGenerate = function (dice_count) {
        var playedDice = 0, dice_results = [];
        while (playedDice < dice_count) {
            var m = Math.ceil(Math.random() * 6);
            dice_results.push(m);
            playedDice++;
        }
        return dice_results;
    };
    PlayHelper.DiceSum = function (list) {
        return list.reduce(function (a, b) { return a + b; }, 0);
    };
    PlayHelper.GetCurrentLoopAt = function (list, player_id) {
        return list.findIndex(function (ply, i) {
            return ply.player_id === player_id;
        });
    };
    PlayHelper.GetCurrentPlayer = function (list, player_id) {
        var index = list.findIndex(function (ply, i) {
            return ply.player_id === player_id;
        });
        return list[index];
    };
    PlayHelper.GetNextLoopPlayerId = function (list, player_id) {
        var k = list.findIndex(function (ply, i) {
            return ply.player_id === player_id;
        });
        return (k + 1) % list.length;
    };
    PlayHelper.GenerateColorMaps = function (total_players) {
        var ch_num = [];
        var k = 360 / total_players;
        var start = Math.random() * 360;
        for (var u = 0; u < total_players; u++) {
            var f = start + k * u;
            ch_num.push(f);
        }
        return ch_num;
    };
    return PlayHelper;
}());
export { PlayHelper };
var Player = (function () {
    function Player(id, _store) {
        this.player_id = id;
        this.dice_count = 1;
        this.walking_speed = 0.1;
        this.frozen_play_turns = 0;
        this.player_status = 0;
        this.isAuto = false;
        this.finance = new DigitalWallet(_store, id);
        this.emitter = new utils.EventEmitter();
        this.playerContainer = new Container();
        this.store = _store;
        this.colorRotation = Math.random() * 360;
        this.items = [];
    }
    Player.prototype.setup = function (isPc, sprite_short_name, total_cash, dice, color_hue) {
        this.isAuto = isPc;
        this.finance.SetCashStart(total_cash);
        this.dice_count = dice;
        this.shortname = sprite_short_name;
        this.fullname = "BigSan " + sprite_short_name;
        this.colorRotation = color_hue;
        return this;
    };
    Player.prototype.appendFrom = function (container) {
        this.deep = Helper.calActorDepth(this.tilePos, this.playerContainer.position.y);
        container.addChild(this.playerContainer);
    };
    Player.prototype.Init = function (d, tilePos, actualPos) {
        this.sprite = new Sprite(d.brushTiles[0].t);
        this.tilePos = tilePos;
        this.nowplay = new Animation(d, this.shortname, this.playerContainer);
        this.playerContainer.position.set(actualPos.x, actualPos.y);
        console.log("add playerContainer");
    };
    Player.prototype.CollectItem = function (code) {
        this.items.push(code);
    };
    Player.prototype.FaceFront = function () {
        this.nowplay.setDir(3);
    };
    Player.prototype.SetFace = function (dir) {
        this.nowplay.setDir(dir);
    };
    Player.prototype.addEvent = function (name, func) {
        console.log("add emitter event");
        this.emitter.on(name, func);
    };
    Player.prototype.updateDepth = function (container) {
    };
    Player.prototype.PlayDice = function (store, cb) {
        var result = PlayHelper.RandomGenerate(this.dice_count);
        var rowID = store.RecordHistory(result, this.player_id);
        cb(PlayHelper.DiceSum(result), rowID);
    };
    Player.prototype.getDisplayItem = function () {
        return this.playerContainer;
    };
    Player.prototype.startFrozen = function (n) {
        this.frozen_play_turns = n;
    };
    Player.prototype.changeStatus = function (n) {
        this.player_status = n;
    };
    Player.prototype.IsFrozen = function () {
        return this.frozen_play_turns > 0;
    };
    Player.prototype.reduceFrozen = function () {
        if (this.frozen_play_turns > 0) {
            this.frozen_play_turns--;
        }
        return this.frozen_play_turns;
    };
    return Player;
}());
export { Player };
var PlayHistory = (function () {
    function PlayHistory() {
        this.history = [];
        this.now_id = 0;
    }
    PlayHistory.prototype.clear = function () {
        this.history = [];
    };
    PlayHistory.prototype.RecordHistory = function (dice_result, player_id) {
        var record_id = this.now_id;
        var new_history = {
            id: record_id,
            action: 0,
            player_id: player_id,
            dice_result: dice_result,
        };
        this.now_id++;
        this.history.push(new_history);
        return record_id;
    };
    return PlayHistory;
}());
export { PlayHistory };
var MapItem = (function () {
    function MapItem(depth, tile) {
        this.depth = depth;
        this.tilepos = tile;
    }
    MapItem.prototype.InitGameDisplay = function (d) {
    };
    MapItem.prototype.setSprite = function (sp) {
        this.sprite = sp;
    };
    MapItem.prototype.EditorDisplay = function (d) {
    };
    MapItem.prototype.removeFrom = function (parent) {
        parent.removeChild(this.sprite);
    };
    MapItem.prototype.appendFrom = function (__parent) {
        console.log(parent, this.sprite);
        __parent.addChild(this.sprite);
    };
    MapItem.prototype.getDisplayItem = function () {
        return this.sprite;
    };
    MapItem.prototype.isMatchTile = function (x, y) {
        return this.tilepos.x === x && this.tilepos.y === y;
    };
    return MapItem;
}());
export { MapItem };
var PathItem = (function () {
    function PathItem(d) {
        this.context = d;
    }
    PathItem.prototype.EditorDisplay = function (d) {
    };
    PathItem.prototype.InitGameDisplay = function (d) {
    };
    PathItem.prototype.InitRoadBlock = function (path) {
        var texture_context = this.context.items[0].t;
        this.sprite = new Sprite(texture_context);
        this.tilepos = path.tilepos;
        if (this.sprite instanceof Sprite) {
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(0.6, 0.6);
        }
        this.depth = Helper.calNormalTileDepth(this.tilepos);
    };
    PathItem.prototype.InitCard = function (path) {
        var texture_contexts = this.context.items[1].t;
        var ani = new FullSheetAnimation(texture_contexts);
        this.tilepos = path.tilepos;
        if (ani.animations instanceof PIXI.AnimatedSprite) {
            ani.animations.anchor.set(0.5);
            ani.animations.scale.set(0.1, 0.1);
        }
        ani.setSpeedFast();
        this.sprite = ani.animations;
        this.depth = Helper.calNormalTileDepth(this.tilepos);
    };
    PathItem.prototype.attachToPlayer = function (p) {
        p.getDisplayItem().addChild(this.sprite);
    };
    PathItem.prototype.detachFromPlayer = function (p) {
        p.getDisplayItem().removeChild(this.sprite);
    };
    PathItem.prototype.appendFrom = function (container) {
        container.addChild(this.getDisplayItem());
        var _a = Helper.getTilePosCameraCentered(this.context, this.tilepos), x = _a.x, y = _a.y;
        this.getDisplayItem().position.set(x, y);
    };
    PathItem.prototype.removeFrom = function (container) {
        container.removeChild(this.getDisplayItem());
    };
    PathItem.prototype.getDisplayItem = function () {
        return this.sprite;
    };
    PathItem.prototype.isMatchTile = function (x, y) {
        return this.tilepos.x === x && this.tilepos.y === y;
    };
    return PathItem;
}());
export { PathItem };
