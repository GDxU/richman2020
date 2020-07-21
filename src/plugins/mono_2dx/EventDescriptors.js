import _ from "lodash";
import { EventsCore } from "./MapLogic";
import { Helper } from "./MapMaker";
import { PlayHelper, PathItem } from "./Common";
import { OnRoadEvents } from "./DataSample";
var EventDescriptors = (function () {
    function EventDescriptors(logic) {
        this._roadItems = [];
        this._logic = logic;
    }
    EventDescriptors.prototype.FindEventIndex = function (code) {
        return _.findIndex(OnRoadEvents, function (k) {
            return k.code === code;
        });
    };
    EventDescriptors.prototype.GetEventCard = function (j) {
        var k = this.FindEventIndex(j);
        return OnRoadEvents[k];
    };
    EventDescriptors.prototype.HasEvent = function (code) {
        return this.FindEventIndex(code) > -1;
    };
    EventDescriptors.prototype.getLocationForRoadEvent = function () {
        var road = this._logic.paths;
        var random_rd = _.filter(road, function (g) {
            var e = g.path_order !== 0 && g.pass_fun === 0 && g.stop_fun === 0;
            if (e) {
                return true;
            }
            else {
                return false;
            }
        });
        var k = Math.random() * random_rd.length;
        var path_decided = random_rd[Math.floor(k)];
        return path_decided;
    };
    EventDescriptors.prototype.SpawnRoadEvents = function () {
        this._roadItems = [];
        for (var o = 0; o < 3; o++) {
            var ec = new PathItem(this._logic.config);
            ec.InitRoadBlock(this.getLocationForRoadEvent().SpawnPassEvent(1013));
            ec.appendFrom(this._logic.zoo_keeper);
            this._roadItems.push(ec);
        }
        for (var p = 0; p < 7; p++) {
            var card = new PathItem(this._logic.config);
            card.InitCard(this.getLocationForRoadEvent().SpawnEndEvent(11012));
            card.appendFrom(this._logic.zoo_keeper);
            this._roadItems.push(card);
        }
    };
    EventDescriptors.prototype.EventJailTime = function () {
        this._logic.dice_lock = true;
        var player = PlayHelper.GetCurrentPlayer(this._logic.players, this._logic.status.player_id);
        var target_mob = Helper.findJail(this._logic.entities);
        if (target_mob === undefined) {
            console.error("the jail is not found.");
        }
        else {
            EventsCore.AutoMoveToMobLocation(this._logic.config, player, this._logic.entities, this._logic.paths, target_mob, EventDescriptors.ToJail);
        }
    };
    EventDescriptors.prototype.EventAmbulance = function () {
        this._logic.dice_lock = true;
        var player = PlayHelper.GetCurrentPlayer(this._logic.players, this._logic.status.player_id);
        var target_mob = Helper.findHospital(this._logic.entities);
        if (target_mob === undefined) {
            console.error("the hospital is not found.");
        }
        else {
            EventsCore.AutoMoveToMobLocation(this._logic.config, player, this._logic.entities, this._logic.paths, target_mob, EventDescriptors.ToHospital);
        }
    };
    EventDescriptors.prototype.EncounterRoadEvent = function (code) {
        var has = this.HasEvent(code);
        if (!has) {
            return;
        }
        switch (code) {
            case 1013:
                break;
        }
    };
    EventDescriptors.ToHospital = function (actor, tilepos) {
        actor.tilePos = tilepos;
        console.log("hospital event is now end");
        var frozen_ops = 3;
        actor.startFrozen(frozen_ops);
        actor.changeStatus(2);
        var ____msg = actor.fullname + " is found injured and went ICU for " + frozen_ops + " days!";
        actor.emitter.emit("dialogNotice", { msg: ____msg });
    };
    EventDescriptors.ToJail = function (actor, tile_pos) {
        actor.tilePos = tile_pos;
        var frozen_ops = 5;
        actor.startFrozen(frozen_ops);
        actor.changeStatus(3);
        var ____msg = actor.fullname + " is arrested and went administrative detention for " + frozen_ops + " days!";
        actor.emitter.emit("dialogNotice", { msg: ____msg });
    };
    EventDescriptors.prototype.RemoveRoadItem = function (gap, item_index) {
        this._roadItems[item_index].removeFrom(this._logic.zoo_keeper);
        gap.RemoveRoadEvents();
        this._roadItems.splice(item_index, 1);
    };
    EventDescriptors.prototype.TakeEffective = function (n) {
        var cIndex = _.findIndex(this._roadItems, function (c) {
            return c.isMatchTile(n.pathGap.tilepos.x, n.pathGap.tilepos.y);
        });
        n.player.tilePos = n.pathGap.tilepos;
        if (cIndex === -1) {
            return 1;
        }
        switch (n.event) {
            case 1013:
                this.RemoveRoadItem(n.pathGap, cIndex);
                return 0;
            case 1014:
                n.nextSum;
                break;
        }
        return 1;
    };
    EventDescriptors.prototype.TakeItem = function (loc) {
        var cIndex = _.findIndex(this._roadItems, function (c) {
            return loc.isMatchTile(c.tilepos.x, c.tilepos.y);
        });
        if (cIndex === -1) {
            return false;
        }
        console.log("item is taken now");
        this.RemoveRoadItem(loc, cIndex);
        return true;
    };
    return EventDescriptors;
}());
export default EventDescriptors;
