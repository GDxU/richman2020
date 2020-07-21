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
import createPlanner from "l1-path-finder";
import _ from "lodash";
import { TimelineLite, Linear } from "gsap";
import MapMaker, { GapPath, Helper, Mob } from "./MapMaker";
import EventDescriptors from "./EventDescriptors";
import { FUNC_ID, Player, PlayHelper, PlayHistory } from "./Common";
var MapLogic = (function (_super) {
    __extends(MapLogic, _super);
    function MapLogic(a, b, c, d, ctx) {
        var _this = _super.call(this, a, b, c, d, ctx) || this;
        _this.dice_lock = true;
        _this.playHistory = new PlayHistory();
        _this.status = {
            player_id: -1,
            dice_result: [],
            history_id: -1,
            action: -1,
            current_event: { player: new Player(0, false), outstanding_events: [] }
        };
        _this.temp_player_pos_checker = { x: 0, y: 0 };
        _this.players = [];
        return _this;
    }
    MapLogic.prototype.getTilePathByID = function (n) {
        var c = this.paths.findIndex(function (p) {
            return p.path_order === n;
        });
        if (c > -1) {
            return this.paths[c];
        }
        return false;
    };
    MapLogic.prototype.getStartPos = function (cb) {
        var result = this.getTilePathByID(0);
        if (result) {
            if (result instanceof GapPath) {
                cb(Helper.getTileRealPosCentered(this.config, result.tilepos), result.tilepos);
            }
        }
    };
    MapLogic.prototype.LevelUp = function (land) {
        if (land.development_id > -1) {
            if (land.level < 7) {
                land.level++;
                if (land.level > 1) {
                    try {
                        this.removeSwapMob(land.tilepos);
                    }
                    catch (e) {
                        console.log("during remove entity", e);
                    }
                    finally {
                        var mob = new Mob(land.tilepos);
                        mob.setupByLevel(land.level - 1, this.config);
                        mob.build(this.entities, this.zoo_keeper);
                        this.DepthRenderGamePlay();
                    }
                }
                return true;
            }
            else {
                var r = "the level has reached to top";
                console.log(r);
                this.context.notificationError(r);
                return false;
            }
        }
        else {
            var r = "please set building style first";
            console.log(r);
            this.context.notificationError(r);
            return false;
        }
    };
    MapLogic.prototype.InitPlayers = function (human, pc, cb) {
        var _this = this;
        var that = this;
        var colorList = PlayHelper.GenerateColorMaps(human + pc);
        that.getStartPos(function (finalpos, tilePos) {
            for (var a = 0; a < pc; a++) {
                var player = new Player(a + 400, _this.context.$store);
                player
                    .setup(true, "nko", 10000, 1, colorList[a])
                    .Init(that.config, tilePos, Helper.calRandomizeInRealPosition(that.config, finalpos));
                that.status.player_id = player.player_id;
                player.appendFrom(_this.zoo_keeper);
                that.players.push(player);
                that.BindPlayerEvents(player);
            }
            for (var a = 0; a < human; a++) {
                var player = new Player(a + 300, _this.context.$store);
                player
                    .setup(false, "oic", 10000, 1, colorList[pc + a])
                    .Init(that.config, tilePos, Helper.calRandomizeInRealPosition(that.config, finalpos));
                that.status.player_id = player.player_id;
                player.appendFrom(that.zoo_keeper);
                that.players.push(player);
                that.BindPlayerEvents(player);
            }
            that.event_play = new EventDescriptors(_this);
            that.DepthRenderGamePlay();
            if (cb !== undefined) {
                cb();
            }
        });
    };
    MapLogic.prototype.DebugTrigger = function () {
        this.event_play.SpawnRoadEvents();
        return;
    };
    MapLogic.prototype.Dice = function () {
        var player = PlayHelper.GetCurrentPlayer(this.players, this.status.player_id);
        if (this.dice_lock) {
            this.context.notificationError("currently cannot play the dice");
            return;
        }
        var that = this;
        this.dice_lock = true;
        that.context.$emit("start_dice", {});
        player.PlayDice(this.playHistory, function (sum, id) {
            console.log("dice result in total: ", sum);
            that.context.$emit("dice_result", {
                total_steps: sum,
                auto: player.isAuto
            });
            var ok = Helper.getPartOf(that.paths, player.tilePos);
            if (ok instanceof GapPath) {
                that.eventMoves(sum, ok, player, id);
            }
        });
    };
    MapLogic.prototype.DiceAuto = function (actor) {
        var that = this;
        actor.PlayDice(this.playHistory, function (sum, id) {
            console.log("dice result in total: ", sum);
            that.context.$emit("dice_result", {
                total_steps: sum,
                auto: actor.isAuto
            });
            var ok = Helper.getPartOf(that.paths, actor.tilePos);
            if (ok instanceof GapPath) {
                that.eventMoves(sum, ok, actor, id);
            }
        });
    };
    MapLogic.prototype.eventMoves = function (totalmoves, roadtile, player, id) {
        var that = this;
        var tween = new TimelineLite();
        var steps = Helper.getFutureTilesArray(totalmoves, roadtile.path_order, that.paths);
        var end_step_func = [];
        var immediate_func = -1;
        var immediate_step;
        var outstanding_steps = -1;
        var previous = Helper.calRandomizeInRealCenterPosition(that.config, Helper.getTileRealPosCentered(that.config, player.tilePos));
        that.status.history_id = id;
        if (steps.length > 0) {
            var listDir_1 = Helper.GenerateRoutePlayerDir(player.tilePos, steps);
            player.SetFace(listDir_1[0]);
            _.each(steps, function (step, stepIndex) {
                outstanding_steps = steps.length - stepIndex;
                var p = Helper.getTileRealPosCentered(that.config, step.tilepos);
                var rn = Helper.calRandomizeInRealCenterPosition(that.config, p);
                var dist = Helper.getDistance(rn, previous);
                previous = rn;
                var t = dist * player.walking_speed / 10;
                var tween_config = Object.assign(rn, { ease: Linear.easeNone });
                tween.to(player.getDisplayItem(), t, tween_config);
                if (step.pass_fun > 0) {
                    immediate_func = step.pass_fun;
                    immediate_step = step;
                    return false;
                }
                if (outstanding_steps === 1) {
                    tween.call(EventsCore.MiddleTileEvent, [true, player, listDir_1[stepIndex + 1]]);
                }
                else {
                    tween.call(EventsCore.MiddleTileEvent, [false, player, listDir_1[stepIndex + 1]]);
                }
            });
            if (immediate_func === -1) {
                var last_step = steps[steps.length - 1];
                end_step_func = Helper.scanEventOnLands(that.lands, last_step.path_order);
                if (outstanding_steps === -1) {
                    outstanding_steps = 0;
                }
                tween.eventCallback("onComplete", EventsCore.EndStepsEvent, [player, end_step_func, last_step, id]);
            }
            else {
                var card = this.event_play.GetEventCard(immediate_func);
                console.log("gen", card);
                tween.eventCallback("onComplete", EventsCore.ImmediateEvent, [player, immediate_func, outstanding_steps, immediate_step, card]);
            }
            tween.eventCallback("onUpdate", EventsCore.UpdatePlayerDepth, [that, player]);
        }
    };
    MapLogic.prototype.DepthRenderGamePlay = function () {
        this.allItemsDescriptor = [];
        var that = this;
        var paths = that.paths;
        var entities = that.entities;
        var lands = that.lands;
        var players = that.players;
        var total = entities.length + players.length;
        var basics = paths.length + lands.length;
        entities.forEach(function (obj, i) {
            that.allItemsDescriptor.push({ type: obj, depth: obj.depth, index: i });
        });
        players.forEach(function (obj, i) {
            that.allItemsDescriptor.push({ type: obj, depth: obj.deep, index: i });
        });
        that.allItemsDescriptor.sort(function (a, b) { return (a.depth > b.depth) ? 1 : -1; });
        for (var i = 0; i < total; i++) {
            var type_instance = that.allItemsDescriptor[i].type;
            var order_index = that.allItemsDescriptor[i].index;
            if (type_instance instanceof Mob) {
                that.zoo_keeper.setChildIndex(entities[order_index].getDisplayItem(), i + basics);
            }
            if (type_instance instanceof Player) {
                that.zoo_keeper.setChildIndex(players[order_index].getDisplayItem(), i + basics);
            }
        }
    };
    MapLogic.prototype.UpdateDepthCheck = function (pos) {
        if (pos.x === this.temp_player_pos_checker.x && pos.y === this.temp_player_pos_checker.y) {
            return false;
        }
        else {
            this.temp_player_pos_checker = pos;
            return true;
        }
    };
    MapLogic.prototype.LoadMap = function (data, cb) {
        if (MapMaker.isValidMapData(data)) {
            var mapParams = new URLSearchParams(data);
            var result = this.getCustomLayout(mapParams, false);
            if (result) {
                this.context.notificationSuccess("Loaded map");
                cb();
            }
            else {
                this.context.notificationError("Failed to load the map");
            }
        }
    };
    MapLogic.prototype.InitGame = function (human, pc, map_stored_data) {
        var that = this;
        new Promise(function (resolve, reject) {
            that.LoadMap(map_stored_data, resolve);
        }).then(function () {
            that.context.notificationSuccess("Load Players");
        }).then(function () {
            that.InitPlayers(human, pc, function () {
                that.context.notificationSuccess("Now starts");
                that.dice_lock = false;
            });
            that.event_play.SpawnRoadEvents();
        }).catch(function (e) {
            console.log("there is an error.", e);
        });
    };
    MapLogic.prototype.OnNextPlayerTurn = function () {
        var _this = this;
        var next_player_index = PlayHelper.GetNextLoopPlayerId(this.players, this.status.player_id);
        var actor = this.players[next_player_index];
        this.status.player_id = actor.player_id;
        if (actor.IsFrozen()) {
            var remain = actor.reduceFrozen() + 1;
            var msg = actor.fullname + " is now remain " + remain + " days in the hospital";
            this.CameraFocus(actor, 2000);
            this.context.notificationInfo(msg);
            setTimeout(function () {
                _this.OnNextPlayerTurn();
            }, 2000);
        }
        else {
            console.log("now actor ID ", this.status.player_id);
            this.CameraFocusDefault(actor);
            if (actor.player_status === 0) {
                this.PlayerOps(actor);
            }
            else {
                this.ProceedStatusToNormal(actor, function (actor, t) {
                    actor.tilePos = t;
                    actor.changeStatus(0);
                    _this.PlayerOps(actor);
                });
            }
        }
    };
    MapLogic.prototype.CameraFocus = function (actor, ms) {
        var h = Object.assign(Helper.getTilePosCameraCentered(this.config, actor.tilePos), { time: ms });
        this.context.$emit("cam_focus", h);
    };
    MapLogic.prototype.CameraFocusDefault = function (actor) {
        this.CameraFocus(actor, 1000);
    };
    MapLogic.prototype.ProceedStatusToNormal = function (actor, callbacks) {
        var status = actor.player_status;
        if (status === 1) {
            var from_hospital = Helper.findHospital(this.entities);
            EventsCore.AutoReturnFromMobLocation(this.config, actor, this.entities, this.paths, from_hospital, callbacks);
        }
        else if (status === 2) {
            var from_hospital = Helper.findHospital(this.entities);
            EventsCore.AutoReturnFromMobLocation(this.config, actor, this.entities, this.paths, from_hospital, callbacks);
        }
        else {
            console.error("cannot proceed animation from this status " + status);
        }
    };
    MapLogic.prototype.PlayerOps = function (actor) {
        var _this = this;
        setTimeout(function () {
            _this.CameraFocusDefault(actor);
            if (actor.isAuto) {
                console.log("AI turn now..");
                _this.DiceAuto(actor);
            }
            else {
                console.log("Its now Actor turn");
                _this.context.$emit("player_turn", {
                    player: actor,
                    system: _this.status,
                });
                _this.dice_lock = false;
            }
        }, 2000);
    };
    MapLogic.prototype.OnNextEvent = function () {
        var ____msg = "";
        var _data = this.status.current_event;
        var defer_next = false;
        if (_data.outstanding_events.length === 0) {
            console.log("done turn for player => ", _data.player.player_id);
            this.OnNextPlayerTurn();
            return;
        }
        var evtCode = _.head(_data.outstanding_events);
        if (_data.player.isAuto) {
            if (AIPackage.stopEvent(evtCode, _data.player, _data, this.players)) {
                defer_next = true;
            }
        }
        else {
            if (evtCode === FUNC_ID.PROPERTY && _data.land) {
                console.log("land done::", _data.land);
                if (_data.land.owner === _data.player.player_id || _data.land.owner === -1) {
                    this.context.$emit("stop_event", _data);
                    console.log("land done:: popup");
                }
                else {
                    var rent_mark = _data.land.rent_schedule[_data.land.level];
                    if (rent_mark > 0) {
                        if (_data.player.finance.cash > rent_mark) {
                            var owner = PlayHelper.GetCurrentPlayer(this.players, _data.land.owner);
                            owner.finance.EarnCash(rent_mark);
                            _data.player.finance.ReduceCash(rent_mark);
                            this.context.$emit("transfer_cash");
                            ____msg = _data.player.fullname + " paid rent to " + owner.fullname + "!";
                            _data.player.emitter.emit("message", ____msg);
                        }
                        else {
                            ____msg = _data.player.fullname + " is now low on wallet money !";
                            _data.player.emitter.emit("message", ____msg);
                        }
                    }
                    console.log("rent related.");
                    defer_next = true;
                }
            }
            else if (evtCode > 0) {
                this.context.$emit("stop_event", _data);
                console.log("event more:", evtCode);
            }
            else {
                defer_next = true;
                console.log("dead end");
            }
        }
        this.status.current_event.outstanding_events = _.drop(_data.outstanding_events);
        if (defer_next) {
            this.OnNextEvent();
        }
    };
    MapLogic.prototype.OnPassEvent = function (data) {
        console.log("received pass event");
        this.context.$emit("pass_event", data);
    };
    MapLogic.prototype.OnPassReturn = function (data) {
        var _this = this;
        console.log("reached pass event");
        var can_move_next = this.event_play.TakeEffective(data);
        var wait = 1300;
        setTimeout(function () {
            if (data.nextSum > 0) {
                if (can_move_next === 1) {
                    _this.eventMoves(data.nextSum, data.pathGap, data.player, _this.status.history_id);
                }
                else if (can_move_next === 0) {
                    _this.TriggerStopEvent(data.pathGap, data.player);
                }
                else {
                    _this.OnNextPlayerTurn();
                }
            }
            else {
                _this.TriggerStopEvent(data.pathGap, data.player);
            }
        }, wait);
    };
    MapLogic.prototype.TriggerStopEvent = function (gap, actor) {
        var LandList = Helper.scanEventOnLands(this.lands, gap.path_order);
        var list = _.map(LandList, function (j) {
            return j.development_id;
        });
        if (list.length > 0) {
            var eventd = {
                outstanding_events: list,
                player: actor,
                land: LandList[0],
                pathTile: gap,
                focusTile: gap.tilepos,
            };
            actor.emitter.emit("stopEvent", eventd);
        }
        else {
            actor.emitter.emit("message", "There is no actions for " + actor.fullname);
            actor.emitter.emit("next");
        }
    };
    MapLogic.prototype.OnStopEvent = function (data) {
        this.status.current_event = data;
        this.OnNextEvent();
        this.DepthRenderGamePlay();
    };
    MapLogic.prototype.OnDialogNotice = function (data) {
        this.context.notificationInfo(data.msg);
        this.OnNextPlayerTurn();
    };
    MapLogic.prototype.OnMessageFromPlayerEvent = function (message) {
        this.context.notificationInfo(message);
    };
    MapLogic.prototype.OnItemCollected = function (loc, item_code) {
        if (this.event_play.TakeItem(loc)) {
            var player = PlayHelper.GetCurrentPlayer(this.players, this.status.player_id);
            player.CollectItem(item_code);
            console.log(player);
        }
    };
    MapLogic.prototype.BindPlayerEvents = function (actor) {
        actor.addEvent("next", this.OnNextPlayerTurn.bind(this));
        actor.addEvent("stopEvent", this.OnStopEvent.bind(this));
        actor.addEvent("dialogNotice", this.OnDialogNotice.bind(this));
        actor.addEvent("message", this.OnMessageFromPlayerEvent.bind(this));
        actor.addEvent("collected_item", this.OnItemCollected.bind(this));
        actor.addEvent("levelup", this.LevelUp.bind(this));
        actor.addEvent("passEvent", this.OnPassEvent.bind(this));
    };
    return MapLogic;
}(MapMaker));
export default MapLogic;
var EventsCore = (function () {
    function EventsCore() {
    }
    EventsCore.EndStepsEvent = function (actor, end_functions, last_step, history_r_id) {
        actor.tilePos = last_step.tilepos;
        var list = [];
        actor.FaceFront();
        if (last_step.stop_fun > 0) {
            list.push(last_step.stop_fun);
        }
        if (end_functions.length > 0) {
            for (var p = 0; p < end_functions.length; p++) {
                list.push(end_functions[p].development_id);
            }
        }
        if (list.length > 0) {
            var evtp = {
                outstanding_events: list,
                player: actor,
                land: end_functions[0],
                pathTile: last_step,
                focusTile: last_step.tilepos,
            };
            actor.emitter.emit("stopEvent", evtp);
        }
        else {
            actor.emitter.emit("message", "There is no actions for " + actor.fullname);
            actor.emitter.emit("next");
        }
    };
    EventsCore.ImmediateEvent = function (actor, immediate_func, steps_outstanding, path, carditem) {
        var o = {
            event: immediate_func,
            player: actor,
            pathGap: path,
            nextSum: steps_outstanding,
            card: carditem,
        };
        actor.emitter.emit("passEvent", o);
    };
    EventsCore.MiddleTileEvent = function (final_step, player, dir) {
        player.SetFace(dir);
    };
    EventsCore.UpdatePlayerDepth = function (p, pl) {
        var tp = Helper.getTilePos(p.config, pl.getDisplayItem().position);
        if (p.UpdateDepthCheck(tp)) {
        }
        var st = Helper.calAdjustCharCameraCenter(p.config, pl.getDisplayItem().position);
        p.context.$emit("focus_moving", st);
    };
    EventsCore.AutoReturnFromMobLocation = function (_c, player, entities, paths, target, callback_event) {
        var tween = new TimelineLite();
        var _a = Helper.findClosestPointFromPathRoutes(target.tilepos, paths), distance = _a.distance, collection = _a.collection;
        var dest = collection[0].tilepos;
        var actual_rpg_1 = Helper.getTileRealPosCentered(_c, { x: dest.x, y: dest.y });
        var rn = Helper.adjustRealCentered(_c, actual_rpg_1);
        tween.to(player.getDisplayItem(), 1, { alpha: 1, ease: Linear.easeNone });
        tween.to(player.getDisplayItem(), distance * player.walking_speed, {
            x: rn.x, y: rn.y, ease: Linear.easeNone
        });
        tween.eventCallback("onComplete", callback_event, [player, dest]);
    };
    EventsCore.AutoMoveToMobLocation = function (_c, player, entities, paths, target, callback_event) {
        var lp_map = Helper.generateNArrayPathMap(_c, paths);
        var planner = createPlanner(lp_map);
        var raw_path = [];
        var tween = new TimelineLite();
        if (target instanceof Mob) {
            var _a = Helper.findClosestPointFromPathRoutes(target.tilepos, paths), distance = _a.distance, collection = _a.collection;
            var dest = collection[0].tilepos;
            planner.search(player.tilePos.x, player.tilePos.y, dest.x, dest.y, raw_path);
            if (raw_path.length === 0) {
                console.log("solutions not found", lp_map);
                return;
            }
            var speed = 0.3;
            var params_len = 2;
            var mobSets = raw_path.length / params_len;
            var tilePos = { x: raw_path[0], y: raw_path[1] };
            console.log("path findings:", player, collection, raw_path);
            for (var f = 0; f < mobSets; f++) {
                var start = f * params_len;
                var param_x = raw_path[start];
                var param_y = raw_path[start + 1];
                var length_x = Math.abs(param_x - tilePos.x);
                var length_y = Math.abs(param_y - tilePos.y);
                var total_len = length_x + length_y;
                var actual_rpg_1 = Helper.getTileRealPosCentered(_c, { x: param_x, y: param_y });
                var rn = Helper.adjustRealCentered(_c, actual_rpg_1);
                var tween_config = { x: rn.x, y: rn.y, ease: Linear.easeNone };
                tween.to(player.getDisplayItem(), total_len * speed, tween_config);
            }
            var rn_hospital = Helper.getTileRealPosCentered(_c, target.tilepos);
            tween.to(player.getDisplayItem(), distance * speed, {
                x: rn_hospital.x, y: rn_hospital.y, ease: Linear.easeNone
            });
            tween.to(player.getDisplayItem(), 3, { alpha: 0, ease: Linear.easeNone });
            tween.eventCallback("onComplete", callback_event, [player, target.tilepos]);
        }
    };
    return EventsCore;
}());
export { EventsCore };
var AIPackage = (function () {
    function AIPackage() {
    }
    AIPackage.stopEvent = function (event_code, ai, data, player_list) {
        var ____msg = "";
        var cash_50_enough = ai.finance.isCash50Enough();
        var cash_10_enough = ai.finance.isCash10Enough();
        if (!cash_10_enough) {
            var ____msg_1 = ai.fullname + " doesn't have enough money now and he decided to move forward!";
            ai.emitter.emit("message", ____msg_1);
            ai.emitter.emit("next");
            return false;
        }
        if (event_code === FUNC_ID.PROPERTY) {
            if (!cash_50_enough) {
                ____msg = ai.fullname + " is now low on wallet!";
                ai.emitter.emit("message", ____msg);
            }
            if (data.land && data.hasOwnProperty("land")) {
                var price_mark = data.land.price_schedule[data.land.level];
                var rent_mark = data.land.rent_schedule[data.land.level];
                var pre_owned = data.land.owner === ai.player_id || data.land.owner === -1;
                if (pre_owned) {
                    var level = data.land.level;
                    if (price_mark < ai.finance.cash) {
                        ai.finance.ReduceCash(price_mark);
                        if (data.land.owner === -1) {
                            data.land.Acquire(ai);
                        }
                        if (level === 0) {
                            ____msg = ai.fullname + " spent " + price_mark + " on the land acquisition!";
                        }
                        else if (level === 1) {
                            ____msg = ai.fullname + " spent " + price_mark + " on the development of land!";
                        }
                        else {
                            ____msg = ai.fullname + " spent " + price_mark + " on the upgrading the building!";
                        }
                        ai.emitter.emit("message", ____msg);
                        ai.emitter.emit("levelup", data.land);
                    }
                    else {
                        if (data.land.owner === -1) {
                            ____msg = ai.fullname + " doesn't have enough money to acquire this land!";
                        }
                        else if (data.land.owner === data.player.player_id) {
                            ____msg = ai.fullname + " doesn't have enough money to upgrade the building!";
                        }
                        else {
                            ____msg = ai.fullname + " now its done.";
                        }
                        ai.emitter.emit("message", ____msg);
                    }
                    ai.emitter.emit("next");
                }
                else {
                    if (rent_mark > 0) {
                        if (ai.finance.cash > rent_mark) {
                            var owner = PlayHelper.GetCurrentPlayer(player_list, data.land.owner);
                            owner.finance.EarnCash(rent_mark);
                            ai.finance.ReduceCash(rent_mark);
                            ____msg = ai.fullname + " paid " + rent_mark + " rent to " + owner.fullname + "!";
                            ai.emitter.emit("message", ____msg);
                        }
                        else {
                            ____msg = ai.fullname + " is now low on wallet and cannot afford the high rent";
                            ai.emitter.emit("message", ____msg);
                        }
                    }
                    else {
                        ____msg = ai.fullname + " has nothing to do!";
                        ai.emitter.emit("message", ____msg);
                    }
                    ai.emitter.emit("next");
                }
            }
            else {
                console.log("unexpected error");
            }
            return false;
        }
        else if (event_code > 10000) {
            ____msg = ai.fullname + " has picked up a card!";
            ai.emitter.emit("message", ____msg);
            ai.emitter.emit("collected_item", data.pathTile, event_code);
            return true;
        }
        else {
            return true;
        }
    };
    return AIPackage;
}());
export { AIPackage };
