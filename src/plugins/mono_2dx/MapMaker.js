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
import _ from "lodash";
import NDArray from "ndarray";
import { Text, Sprite, Container, filters } from "pixi.js";
import { FUNC_ID, MapItem } from "./Common";
import { FULL_EXTENDS_DIRECTIONS, PRICE_LV_TYPE_A, FULL_CROSS_DIRECTIONS, RENT_LV_TYPE_A } from "./DataSample";
var Helper = (function () {
    function Helper() {
    }
    Helper.getTilePos = function (d, real_pos) {
        var rx1 = real_pos.x / (d.tileSize * d.tileScale);
        var ry1 = real_pos.y / (d.tileSize * d.tileScale);
        return {
            x: Math.floor(rx1),
            y: Math.floor(ry1)
        };
    };
    Helper.getDistance = function (r1, r2) {
        var d1 = r1.x - r2.x;
        var d2 = r1.y - r2.y;
        var sq = Math.pow(d1, 2) + Math.pow(d2, 2);
        return Math.sqrt(sq);
    };
    Helper.getDir = function (r1, r2) {
        var d1 = r1.x - r2.x;
        var d2 = r1.y - r2.y;
        var dir = 0;
        if (d1 > 0) {
            dir = 1;
        }
        else if (d1 < 0) {
            dir = 4;
        }
        if (d2 > 0) {
            dir = 3;
        }
        else if (d2 < 0) {
            dir = 2;
        }
        return dir;
    };
    Helper.GenerateRoutePlayerDir = function (start, route) {
        var previous_dir = start;
        var d = [];
        _.each(route, function (step, stepIndex) {
            var dir = Helper.getDir(step.tilepos, previous_dir);
            previous_dir = step.tilepos;
            d.push(dir);
        });
        return d;
    };
    Helper.adjustNormalPosLocal = function (d, sprite) {
        return Helper.adjustNormalTilePos(d, { x: 0, y: 0 }, sprite.width, sprite.height);
    };
    ;
    Helper.adjustNormalTilePos = function (d, basePos, w, h) {
        var tileSize = d.tileSize, tileOffset = d.tileOffset, tileScale = d.tileScale;
        var total = tileScale * tileSize;
        var offset_y = 0;
        if (h > w && w * 1.1 > total && h > total * 1.5) {
            offset_y = (h - w * 0.8) - total / 2;
        }
        else {
            offset_y = total / 2;
        }
        return {
            x: basePos.x + total / 2,
            y: basePos.y + offset_y,
            s: (tileSize + (tileOffset * 2)),
        };
    };
    ;
    Helper.adjustPathPos = function (d, basePos, w, h, percent) {
        var tileSize = d.tileSize, tileOffset = d.tileOffset, tileScale = d.tileScale;
        return {
            x: basePos.x + tileSize * tileScale / 2,
            y: basePos.y + tileSize * tileScale / 2,
            s: (tileSize + (tileOffset * 2)),
        };
    };
    ;
    Helper.adjustWalkPathPos = function (d, basePos, w, h, percent) {
        var tileSize = d.tileSize, tileOffset = d.tileOffset, tileScale = d.tileScale;
        return {
            x: basePos.x + (Math.random() * 0.8 + 0.2) * tileSize * tileScale,
            y: basePos.y + (Math.random() * 0.8 + 0.2) * tileSize * tileScale,
            s: (tileSize + (tileOffset * 2)),
        };
    };
    ;
    Helper.adjustLandPos = function (d, basePos, w, h, percent) {
        var tileSize = d.tileSize, tileOffset = d.tileOffset;
        return {
            x: basePos.x,
            y: basePos.y,
            s: (tileSize + (tileOffset * 2)),
        };
    };
    ;
    Helper.addPos = function (a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    };
    Helper.addPosMul = function (a, b, m) {
        return {
            x: a.x + b.x * m,
            y: a.y + b.y * m,
        };
    };
    Helper.getTileRealPosCentered = function (d, tile_pos) {
        return {
            x: tile_pos.x * d.tileSize * d.tileScale,
            y: tile_pos.y * d.tileSize * d.tileScale,
        };
    };
    Helper.getTilePosCameraCentered = function (d, tile_pos) {
        var half = d.tileSize * d.tileScale / 2;
        return {
            x: tile_pos.x * d.tileSize * d.tileScale + half,
            y: tile_pos.y * d.tileSize * d.tileScale + half,
        };
    };
    Helper.adjustRealCentered = function (d, base) {
        return {
            x: base.x + d.tileSize * d.tileScale / 2 - 12,
            y: base.y + d.tileSize * d.tileScale / 2 - 12,
        };
    };
    Helper.calAdjustCharCameraCenter = function (d, actorPos) {
        return {
            x: actorPos.x + 16,
            y: actorPos.y + 16,
        };
    };
    Helper.calRandomizeInRealPosition = function (d, final_pos) {
        return {
            x: final_pos.x + (d.tileSize * d.tileScale - 32) * Math.random(),
            y: final_pos.y + (d.tileSize * d.tileScale - 32) * Math.random(),
        };
    };
    Helper.calRandomizeInRealCenterPosition = function (d, final_pos) {
        var padding = 0;
        return {
            x: final_pos.x + (d.tileSize * d.tileScale - 32 - padding) * Math.random() + padding,
            y: final_pos.y + (d.tileSize * d.tileScale - 32 - padding) * Math.random() + padding,
        };
    };
    Helper.calPathTileDepth = function (tilepos) {
        return tilepos.y * 10 + tilepos.x + 1;
    };
    Helper.calLandTileDepth = function (tilepos) {
        return tilepos.y * 10 + tilepos.x + 2;
    };
    Helper.calNormalTileDepth = function (tilepos) {
        return tilepos.y * 100 + tilepos.x + 100;
    };
    Helper.calActorDepth = function (tilepos, y) {
        return tilepos.x + 3 + y;
    };
    Helper.findMatchedTileIndex = function (item, x, y) {
        return item.findIndex(function (mapItem) {
            return mapItem.isMatchTile(x, y);
        });
    };
    Helper.isPartOf = function (items, tilePos) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var g = item.isMatchTile(tilePos.x, tilePos.y);
            if (g) {
                return true;
            }
        }
        return false;
    };
    Helper.scanEvents = function (lands, pathID) {
        var events = [];
        _.each(lands, function (land) {
            if (land.path_id === pathID) {
                events.push(land.development_id);
            }
        });
        return events;
    };
    Helper.scanEventOnLands = function (lands, pathID) {
        var events = [];
        _.each(lands, function (land) {
            if (land.path_id === pathID) {
                events.push(land);
            }
        });
        return events;
    };
    Helper.getPartOf = function (items, tilePos) {
        if (tilePos) {
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var item = items_2[_i];
                var g = item.isMatchTile(tilePos.x, tilePos.y);
                if (g) {
                    return item;
                }
            }
        }
        return false;
    };
    Helper.getFutureTilesArray = function (positive_steps, current_path_id, road) {
        var list = [];
        var total = Math.abs(positive_steps) + 1, count = 1;
        if (positive_steps > 0) {
            while (count < total) {
                var index = road.findIndex(function (path) {
                    return path.path_order === (current_path_id + count) % road.length;
                });
                list.push(road[index]);
                count++;
            }
        }
        else {
            while (count < total) {
                var index = road.findIndex(function (path) {
                    return path.path_order === (current_path_id - count) % road.length;
                });
                list.push(road[index]);
                count++;
            }
        }
        return list;
    };
    Helper.findJail = function (entities) {
        var hospital;
        _.each(entities, function (m) {
            if (m.meta.k === "ja") {
                hospital = m;
                return false;
            }
        });
        return hospital;
    };
    Helper.findHospital = function (entities) {
        var hospital;
        _.each(entities, function (m) {
            if (m.meta.k === "hs") {
                hospital = m;
                return false;
            }
        });
        return hospital;
    };
    Helper.generateNArrayPathMap = function (c, paths) {
        var nArray = [];
        var _loop_1 = function (mx) {
            var _loop_2 = function (my) {
                var default_solid = 1;
                _.each(paths, function (p) {
                    if (p.isMatchTile(mx, my)) {
                        default_solid = 0;
                    }
                });
                nArray.push(default_solid);
            };
            for (var my = 0; my < c.tileY; my++) {
                _loop_2(my);
            }
        };
        for (var mx = 0; mx < c.tileX; mx++) {
            _loop_1(mx);
        }
        return NDArray(nArray, [c.tileX, c.tileY]);
    };
    Helper.findClosestPointFromPathRoutes = function (fromPoint, ___paths) {
        var level = 0;
        var reached = false;
        var collected_positions = [];
        for (var i = 0; i < FULL_CROSS_DIRECTIONS.length; i++) {
            for (var m = 1; m < 10; m++) {
                if (reached)
                    break;
                level = m;
                var delpos = FULL_CROSS_DIRECTIONS[i];
                var projected_loc = Helper.addPosMul(fromPoint, delpos, m);
                for (var r = 0; r < ___paths.length; r++) {
                    if (___paths[r].isMatchTile(projected_loc.x, projected_loc.y)) {
                        reached = true;
                        collected_positions.push(___paths[r]);
                    }
                }
            }
        }
        return {
            distance: level,
            collection: collected_positions,
        };
    };
    Helper.getName = function (n) {
        return "." + n;
    };
    Helper.getPropertyName = function (n) {
        return "p" + n;
    };
    Helper.getFName = function (n) {
        return "f" + n;
    };
    Helper.isContainedObjectName = function (name, item) {
        if (item.name.indexOf(name) > -1) {
            return true;
        }
        else {
            return false;
        }
    };
    Helper.BuildingTextureSearch = function (lv, allk, config) {
        var prefix = "lv";
        var loc = -1;
        var names = allk.split("");
        var list = [];
        _.each(names, function (sub) {
            var short_name = "" + prefix + lv + sub;
            loc = _.findIndex(config.brushTiles, function (o) {
                return o.k === short_name;
            });
            if (loc > -1) {
                list.push(config.brushTiles[loc]);
                return;
            }
        });
        return list[0];
    };
    Helper.getPathFromPathID = function (path_id, list) {
        var k = list.findIndex(function (gap) {
            return gap.path_order === path_id;
        });
        return list[k];
    };
    return Helper;
}());
export { Helper };
var GapPath = (function (_super) {
    __extends(GapPath, _super);
    function GapPath(tile, txture) {
        var _this = _super.call(this, Helper.calPathTileDepth(tile), tile) || this;
        _this.stop_fun = 0;
        _this.pass_fun = 0;
        _this.texture = txture;
        _this.path_order = -1;
        _this.keeper = new Container();
        _this.sprite = new Sprite(_this.texture);
        _this.sprite.scale.set(1.16, 1.1);
        _this.keeper.addChild(_this.sprite);
        return _this;
    }
    GapPath.prototype.InitEditPaint = function (d, order) {
        this.path_order = order;
        this.RenderEditorMark(d);
    };
    GapPath.prototype.EditorDisplay = function (d) {
        this.RenderEditorMark(d);
    };
    GapPath.prototype.Setup = function (path_order, stop, pass) {
        this.path_order = path_order;
        this.stop_fun = stop;
        this.pass_fun = pass;
        return this;
    };
    GapPath.prototype.InitGameDisplay = function (d) {
        this.RenderTilePath(d);
    };
    GapPath.prototype.RenderEditorMark = function (d) {
        var text_instance = new Text(Helper.getName(this.path_order), {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x69fffa,
            align: "left"
        });
        text_instance.position.set(0, d.tileScale * d.tileSize - text_instance.height);
        this.keeper.addChild(text_instance);
        var p = Helper.getTileRealPosCentered(d, this.tilepos);
        this.keeper.position.set(p.x, p.y);
    };
    GapPath.prototype.RenderTilePath = function (d) {
        var p = Helper.getTileRealPosCentered(d, this.tilepos);
        this.keeper.position.set(p.x, p.y);
    };
    GapPath.prototype.ResetOrder = function (order) {
        this.path_order = order;
        if (this.sprite instanceof Text) {
            this.sprite.text = Helper.getName(order);
        }
    };
    GapPath.prototype.removeFrom = function (parent) {
        parent.removeChild(this.keeper);
    };
    GapPath.prototype.appendFrom = function (parent) {
        parent.addChild(this.keeper);
    };
    GapPath.prototype.getDisplayItem = function () {
        return this.keeper;
    };
    GapPath.prototype.SpawnPassEvent = function (eventCode) {
        this.pass_fun = eventCode;
        console.log("planted location for pass event:", this.path_order);
        return this;
    };
    GapPath.prototype.SpawnEndEvent = function (eventCode) {
        this.stop_fun = eventCode;
        console.log("planted location for stop event:", this.path_order);
        return this;
    };
    GapPath.prototype.RemoveRoadEvents = function () {
        this.stop_fun = 0;
        this.pass_fun = 0;
    };
    return GapPath;
}(MapItem));
export { GapPath };
var Mob = (function (_super) {
    __extends(Mob, _super);
    function Mob(tPos) {
        return _super.call(this, Helper.calNormalTileDepth(tPos), tPos) || this;
    }
    Mob.prototype.setupByTypeIndex = function (_type, _config) {
        var _percentage = 0.68;
        return this.setupByTypeIndexHeight(_type, _config, _percentage);
    };
    Mob.prototype.setDefaultProperties = function (sprite, _cfg, height_anchor) {
        sprite.anchor.set(0.5, height_anchor);
        sprite.scale.set(0.6, 0.6);
        var unadjusted_pos = Helper.getTileRealPosCentered(_cfg, this.tilepos);
        var Q = Helper.adjustNormalTilePos(_cfg, unadjusted_pos, sprite.width, sprite.height);
        sprite.position.set(Q.x, Q.y);
        sprite.interactive = false;
    };
    Mob.prototype.setupByTypeIndexHeight = function (_type, _cfg, height_adjustment) {
        this.type = _type;
        this.config = _cfg;
        this.meta = _cfg.brushTiles[_type];
        var texture = _cfg.brushTiles[_type].t;
        var act = new Sprite(texture);
        this.setDefaultProperties(act, _cfg, height_adjustment);
        this.setSprite(act);
        return this;
    };
    Mob.prototype.setupByLevel = function (c, _cfg) {
        var texture = Helper.BuildingTextureSearch(c, "abcde", _cfg);
        var act = new Sprite(texture.t);
        this.setDefaultProperties(act, _cfg, 0.68);
        this.setSprite(act);
        return this;
    };
    Mob.prototype.getDisplayItem = function () {
        return this.sprite;
    };
    Mob.prototype.build = function (list, parent) {
        list.push(this);
        this.appendFrom(parent);
    };
    return Mob;
}(MapItem));
export { Mob };
var Land = (function (_super) {
    __extends(Land, _super);
    function Land(tile, texture_id, txture, d) {
        var _this = _super.call(this, Helper.calLandTileDepth(tile), tile) || this;
        _this.calculation_map = FULL_EXTENDS_DIRECTIONS;
        _this.keeper = new Container();
        _this.temp_path_locations = [];
        _this.price_schedule = [];
        _this.rent_schedule = [];
        _this.status = 0;
        _this.level = 0;
        _this.owner = -1;
        _this.development_id = -1;
        _this.path_id = -1;
        _this.relation_id = -1;
        _this.editor_temp_location_index = -1;
        _this.texture_id = texture_id;
        _this.sprite = new Sprite(txture);
        var unadjusted_pos = Helper.getTileRealPosCentered(d, tile);
        var _a = Helper.adjustLandPos(d, unadjusted_pos, _this.sprite.width, _this.sprite.height, 0.5), x = _a.x, y = _a.y;
        _this.sprite.scale.set(1.16, 1.1);
        _this.keeper.addChild(_this.sprite);
        _this.keeper.position.set(x, y);
        _this.global_config = d;
        return _this;
    }
    Land.prototype.EditorDisplay = function (d) {
        if (this.text_instance == null && this.development_id > -1) {
            switch (this.development_id) {
                case FUNC_ID.BANK:
                    this.addTextBox(d, 0x69fffa, Helper.getFName(this.path_id));
                    break;
                case FUNC_ID.SHOP:
                    this.addTextBox(d, 0x69fffa, Helper.getFName(this.path_id));
                    break;
                case FUNC_ID.CASINO:
                    this.addTextBox(d, 0x69fffa, Helper.getFName(this.path_id));
                    break;
                case FUNC_ID.DRAWCARD:
                    this.addTextBox(d, 0x69fffa, Helper.getFName(this.path_id));
                    break;
                default:
                    this.addTextBox(d, 0x26396c, Helper.getPropertyName(this.path_id));
                    break;
            }
        }
    };
    Land.prototype.InitGameDisplay = function (d) {
        this.status = 1;
        this.price_schedule = PRICE_LV_TYPE_A;
        this.rent_schedule = RENT_LV_TYPE_A;
        this.global_config = d;
    };
    Land.prototype.CheckAllPossibleTempLocs = function (paths) {
        this.temp_path_locations = [];
        for (var i = 0; i < this.calculation_map.length; i++) {
            var delpos = this.calculation_map[i];
            for (var r = 0; r < paths.length; r++) {
                var projected_loc = Helper.addPos(delpos, this.tilepos);
                if (paths[r].isMatchTile(projected_loc.x, projected_loc.y)) {
                    projected_loc.id = i;
                    this.temp_path_locations.push(projected_loc);
                }
            }
        }
    };
    Land.prototype.removeFrom = function (parent) {
        parent.removeChild(this.keeper);
    };
    Land.prototype.appendFrom = function (parent) {
        parent.addChild(this.keeper);
    };
    Land.prototype.getDisplayItem = function () {
        return this.keeper;
    };
    Land.prototype.Acquire = function (player) {
        this.colorUp(player.colorRotation);
        this.owner = player.player_id;
    };
    Land.prototype.destroyLand = function () {
        this.owner = -1;
        this.keeper.removeChildAt(0);
    };
    Land.prototype.destroyBuildings = function () {
        this.keeper.removeChildAt(1);
    };
    Land.prototype.SetGameMode = function () {
        this.status = 1;
    };
    Land.prototype.SetEditorMode = function () {
        this.status = 0;
    };
    Land.prototype.getAfterRotatedTiles = function () {
        return this.temp_path_locations[this.editor_temp_location_index % (this.temp_path_locations.length + 1)];
    };
    Land.prototype.colorUp = function (degree) {
        var nightFilter = new filters.ColorMatrixFilter();
        nightFilter.hue(degree, false);
        this.sprite.filters = [nightFilter];
    };
    Land.prototype.RotateSpecialShop = function (paths, d, function_id) {
        if (this.status === 0) {
            this.CheckAllPossibleTempLocs(paths);
            if (this.temp_path_locations.length > 0) {
                this.colorUp(60);
                this.editor_temp_location_index++;
                var ch = Helper.getPartOf(paths, this.getAfterRotatedTiles());
                this.development_id = function_id;
                if (ch) {
                    if (ch instanceof GapPath) {
                        this.path_id = ch.path_order;
                        var tag = Helper.getFName(ch.path_order);
                        if (this.text_instance == null) {
                            this.addTextBox(d, 0x26396c, tag);
                        }
                        else {
                            this.setLabel(tag);
                        }
                    }
                }
                else {
                    this.clearLandProperties();
                }
            }
        }
    };
    Land.prototype.RotatePathProperty = function (paths, d) {
        if (this.status === 0) {
            this.CheckAllPossibleTempLocs(paths);
            if (this.temp_path_locations.length > 0) {
                var nightFilter = new filters.ColorMatrixFilter();
                nightFilter.vintage(true);
                this.sprite.filters = [nightFilter];
                this.editor_temp_location_index++;
                var ch = Helper.getPartOf(paths, this.getAfterRotatedTiles());
                this.development_id = FUNC_ID.PROPERTY;
                if (ch) {
                    if (ch instanceof GapPath) {
                        this.path_id = ch.path_order;
                        var tag = Helper.getPropertyName(ch.path_order);
                        if (this.text_instance == null) {
                            this.addTextBox(d, 0x69fffa, tag);
                        }
                        else {
                            this.setLabel(tag);
                        }
                    }
                }
                else {
                    this.clearLandProperties();
                }
            }
        }
    };
    Land.prototype.clearLandProperties = function () {
        this.path_id = -1;
        this.setLabel("");
        this.sprite.filters = [];
        this.owner = -1;
    };
    Land.prototype.setLabel = function (tag) {
        if (this.text_instance != null) {
            this.text_instance.text = tag;
        }
    };
    Land.prototype.addTextBox = function (d, color, text) {
        this.text_instance = new Text(text, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: color,
            align: "left"
        });
        this.text_instance.position.set(0, d.tileScale * d.tileSize - this.text_instance.height);
        this.keeper.addChild(this.text_instance);
    };
    return Land;
}(MapItem));
export { Land };
var MapMaker = (function () {
    function MapMaker(a, b, c, d, ctx) {
        this.res = a;
        this.brush = -1;
        this.zoo_keeper = b;
        this.bg_layer = c;
        this.config = d;
        this.entities = [];
        this.paths = [];
        this.lands = [];
        this.context = ctx;
        var bg = new Sprite(a.map_arena.texture);
        this.bg_layer.addChild(bg);
        this.player = { x: 0, y: 0 };
    }
    MapMaker.prototype.reorderDepths = function () {
        this.allItemsDescriptor = [];
        var that = this;
        var paths = that.paths;
        var entities = that.entities;
        var lands = that.lands;
        var total = entities.length + paths.length + lands.length;
        paths.forEach(function (obj, i) {
            that.allItemsDescriptor.push({ type: obj, depth: obj.depth, index: i });
        });
        lands.forEach(function (obj, i) {
            that.allItemsDescriptor.push({ type: obj, depth: obj.depth, index: i });
        });
        entities.forEach(function (obj, i) {
            that.allItemsDescriptor.push({ type: obj, depth: obj.depth, index: i });
        });
        that.allItemsDescriptor.sort(function (a, b) { return (a.depth > b.depth) ? 1 : -1; });
        for (var i = 0; i < total; i++) {
            var type_instance = that.allItemsDescriptor[i].type;
            var order_index = that.allItemsDescriptor[i].index;
            if (type_instance instanceof GapPath) {
                that.zoo_keeper.setChildIndex(paths[order_index].getDisplayItem(), i);
            }
            if (type_instance instanceof Mob) {
                that.zoo_keeper.setChildIndex(entities[order_index].getDisplayItem(), i);
            }
            if (type_instance instanceof Land) {
                that.zoo_keeper.setChildIndex(lands[order_index].getDisplayItem(), i);
            }
        }
    };
    MapMaker.prototype.inBounds = function (x, y) {
        var _a = this.config, arenaSizeX = _a.arenaSizeX, arenaSizeY = _a.arenaSizeY;
        var inb = (x >= 0 && x < arenaSizeX &&
            y >= 0 && y < arenaSizeY);
        return inb;
    };
    ;
    MapMaker.prototype.use = function (brush_type) {
        this.brush = brush_type;
    };
    MapMaker.prototype.removeForLand = function (_a) {
        var x = _a.x, y = _a.y;
        var paths = this.paths;
        var lands = this.lands;
        var gapIdx = Helper.findMatchedTileIndex(paths, x, y);
        var landIdx = Helper.findMatchedTileIndex(lands, x, y);
        if (landIdx != -1) {
            lands[landIdx].removeFrom(this.zoo_keeper);
            lands.splice(landIdx, 1);
        }
        if (gapIdx != -1) {
            paths[gapIdx].removeFrom(this.zoo_keeper);
            paths.splice(gapIdx, 1);
            if (gapIdx < paths.length - 1) {
                for (var j = 0; j < paths.length; j++) {
                    paths[j].ResetOrder(j);
                }
            }
        }
    };
    ;
    MapMaker.prototype.removeForEntity = function (_a) {
        var x = _a.x, y = _a.y;
        var entities = this.entities;
        var paths = this.paths;
        var entIdx = Helper.findMatchedTileIndex(entities, x, y);
        var gapIdx = Helper.findMatchedTileIndex(paths, x, y);
        if (entIdx != -1) {
            entities[entIdx].removeFrom(this.zoo_keeper);
            entities.splice(entIdx, 1);
        }
        if (gapIdx != -1) {
            paths[gapIdx].removeFrom(this.zoo_keeper);
            paths.splice(gapIdx, 1);
            if (gapIdx < paths.length - 1) {
                for (var j = 0; j < paths.length; j++) {
                    paths[j].ResetOrder(j);
                }
            }
        }
    };
    ;
    MapMaker.prototype.removeOnlyOnEntity = function (tilePos) {
        this.removeSwapMob(tilePos);
        var lands = this.lands;
        var entLandx = Helper.findMatchedTileIndex(lands, tilePos.x, tilePos.y);
        lands[entLandx].clearLandProperties();
    };
    MapMaker.prototype.removeSwapMob = function (tilePos) {
        var entities = this.entities;
        var entIdx = Helper.findMatchedTileIndex(entities, tilePos.x, tilePos.y);
        if (entIdx != -1) {
            entities[entIdx].removeFrom(this.zoo_keeper);
            entities.splice(entIdx, 1);
        }
    };
    MapMaker.prototype.removeAllKindsAt = function (_a) {
        var x = _a.x, y = _a.y;
        var entities = this.entities;
        var paths = this.paths;
        var lands = this.lands;
        var entIdx = Helper.findMatchedTileIndex(entities, x, y);
        var gapIdx = Helper.findMatchedTileIndex(paths, x, y);
        var landIdx = Helper.findMatchedTileIndex(lands, x, y);
        if (entIdx != -1) {
            entities[entIdx].removeFrom(this.zoo_keeper);
            entities.splice(entIdx, 1);
        }
        if (landIdx != -1) {
            lands[landIdx].removeFrom(this.zoo_keeper);
            lands.splice(landIdx, 1);
        }
        if (gapIdx != -1) {
            paths[gapIdx].removeFrom(this.zoo_keeper);
            paths.splice(gapIdx, 1);
            if (gapIdx < paths.length - 1) {
                for (var j = 0; j < paths.length; j++) {
                    paths[j].ResetOrder(j);
                }
            }
        }
    };
    MapMaker.prototype.ClearAll = function () {
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            var path = _a[_i];
            path.removeFrom(this.zoo_keeper);
        }
        for (var _b = 0, _c = this.entities; _b < _c.length; _b++) {
            var entity = _c[_b];
            entity.removeFrom(this.zoo_keeper);
        }
        for (var _d = 0, _e = this.lands; _d < _e.length; _d++) {
            var land = _e[_d];
            land.removeFrom(this.zoo_keeper);
        }
        this.paths = [];
        this.entities = [];
        this.lands = [];
    };
    MapMaker.prototype.EditorPaintEvent = function (mousePos) {
        var that = this;
        if (that.brush === -1)
            return;
        var tile_pos = Helper.getTilePos(that.config, mousePos);
        if (!that.inBounds(mousePos.x, mousePos.y)) {
            return;
        }
        var type = that.brush;
        var brush = that.config.brushTiles[type];
        if (type === 2) {
            if (Helper.isPartOf(that.lands, tile_pos)) {
                var landuncasted = Helper.getPartOf(that.lands, tile_pos);
                if (landuncasted instanceof Land) {
                    landuncasted.RotatePathProperty(that.paths, that.config);
                }
            }
            else {
                that.removeForLand(tile_pos);
                var land = new Land(tile_pos, brush.k, brush.t, that.config);
                that.storeNewData(land, that.lands);
                that.reorderDepths();
                land.EditorDisplay(that.config);
            }
            that.update_export_data();
            return;
        }
        if (type === 3) {
            that.removeAllKindsAt(tile_pos);
            that.reorderDepths();
            that.update_export_data();
            return;
        }
        if (type === 4) {
            that.removeOnlyOnEntity(tile_pos);
            that.reorderDepths();
            that.update_export_data();
            return;
        }
        if (type === 1) {
            that.removeAllKindsAt(tile_pos);
            var land = new GapPath(tile_pos, brush.t);
            land.InitEditPaint(that.config, that.paths.length);
            that.storeNewData(land, that.paths);
            that.reorderDepths();
            that.update_export_data();
            return;
        }
        if (type === 0) {
            if (!Helper.isPartOf(that.lands, tile_pos)) {
                that.removeForLand(tile_pos);
                var land = new Land(tile_pos, brush.k, brush.t, that.config);
                that.storeNewData(land, that.lands);
                that.reorderDepths();
                land.EditorDisplay(that.config);
            }
            that.update_export_data();
            return;
        }
        if (Helper.isPartOf(that.entities, tile_pos) && Helper.isPartOf(that.lands, tile_pos)) {
            if (Helper.isContainedObjectName("minishop", brush)) {
                var shopland = Helper.getPartOf(this.lands, tile_pos);
                if (shopland instanceof Land) {
                    shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.SHOP);
                }
            }
            if (Helper.isContainedObjectName("bank", brush)) {
                var shopland = Helper.getPartOf(this.lands, tile_pos);
                if (shopland instanceof Land) {
                    shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.BANK);
                }
            }
            if (Helper.isContainedObjectName("casino", brush)) {
                var shopland = Helper.getPartOf(this.lands, tile_pos);
                if (shopland instanceof Land) {
                    shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.CASINO);
                }
            }
            if (Helper.isContainedObjectName("freecard", brush)) {
                var shopland = Helper.getPartOf(this.lands, tile_pos);
                if (shopland instanceof Land) {
                    shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.DRAWCARD);
                }
            }
        }
        else if (Helper.isPartOf(that.paths, tile_pos)) {
        }
        else {
            that.removeForEntity(tile_pos);
            var mob = new Mob(tile_pos);
            if (that.config.brushTiles[type].hasOwnProperty("h")) {
                mob.setupByTypeIndexHeight(type, that.config, brush.h);
            }
            else {
                mob.setupByTypeIndex(type, that.config);
            }
            mob.build(that.entities, that.zoo_keeper);
            that.reorderDepths();
        }
        that.update_export_data();
    };
    MapMaker.prototype.getSpriteFromType = function (type) {
        var texture = this.config.brushTiles[type].t;
        var sp = new Sprite(texture);
        sp.interactive = false;
        return sp;
    };
    MapMaker.prototype.update_export_data = function () {
        var link = "";
        if (this.entities.length > 0) {
            link += "&m=";
            for (var i = 0; i < this.entities.length; ++i) {
                var ent = this.entities[i];
                if (ent.type !== 0) {
                    link += ent.meta.k + "," +
                        ent.tilepos.x + "," +
                        ent.tilepos.y + ",";
                }
            }
            link = link.slice(0, -1);
        }
        if (this.paths.length > 0) {
            link += "&g=";
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var gp = _a[_i];
                link += gp.tilepos.x + "," +
                    gp.tilepos.y + "," +
                    gp.stop_fun + "," +
                    gp.pass_fun + "," +
                    gp.path_order + ",";
            }
            link = link.slice(0, -1);
        }
        if (this.lands.length > 0) {
            link += "&l=";
            for (var _b = 0, _c = this.lands; _b < _c.length; _b++) {
                var land = _c[_b];
                link += land.tilepos.x + "," +
                    land.tilepos.y + "," +
                    land.level + "," +
                    land.development_id + "," +
                    land.relation_id + "," +
                    land.path_id + "," +
                    land.status + "," +
                    land.texture_id + ",";
            }
            link = link.slice(0, -1);
        }
        link += "&map=";
        link += this.config.tileX + "," +
            this.config.tileY + "," +
            this.config.tileSize + "," +
            this.config.tileScale + ",";
        link = link.slice(0, -1);
        console.log("assets list", link);
        this.context.$emit("link", { content: link, err: "" });
    };
    MapMaker.prototype.getNameFromBrushTiles = function (name) {
        for (var i = 0; i < this.config.brushTiles.length; ++i) {
            var shortname = this.config.brushTiles[i].k;
            if (name === shortname) {
                return i;
            }
        }
        return -1;
    };
    MapMaker.prototype.getCustomLayout = function (params, forEditor) {
        try {
            this.ClearAll();
            var mobParam = params.get("m").split(",");
            var gapsParam = params.get("g").split(",");
            var landParam = params.get("l").split(",");
            var total_mob_params = 3;
            if (mobParam.length % total_mob_params != 0) {
                return false;
            }
            var mobSets = mobParam.length / total_mob_params;
            for (var f = 0; f < mobSets; f++) {
                var start = f * total_mob_params;
                var param1 = mobParam[start];
                var param2 = Number.parseInt(mobParam[start + 1]);
                var param3 = Number.parseInt(mobParam[start + 2]);
                var result_index = this.getNameFromBrushTiles(param1);
                if (result_index === -1)
                    continue;
                var tilePos = { x: param2, y: param3 };
                var actorTile = new Mob(tilePos);
                actorTile.setupByTypeIndex(result_index, this.config);
                actorTile.build(this.entities, this.zoo_keeper);
            }
            if (gapsParam != null) {
                var total_gap_params = 5;
                if (gapsParam.length % total_gap_params != 0) {
                    return false;
                }
                var gapParams = gapsParam.length / total_gap_params;
                for (var gc = 0; gc < gapParams; gc++) {
                    var start = gc * total_gap_params;
                    var param1 = Number.parseInt(gapsParam[start]);
                    var param2 = Number.parseInt(gapsParam[start + 1]);
                    var param3 = Number.parseInt(gapsParam[start + 2]);
                    var param4 = Number.parseInt(gapsParam[start + 3]);
                    var param5 = Number.parseInt(gapsParam[start + 4]);
                    var tilePos = { x: param1, y: param2 };
                    var land = new GapPath(tilePos, this.config.brushTiles[1].t);
                    if (forEditor) {
                        land
                            .Setup(param5, param3, param4)
                            .EditorDisplay(this.config);
                    }
                    else {
                        land
                            .Setup(param5, param3, param4)
                            .InitGameDisplay(this.config);
                    }
                    this.storeNewData(land, this.paths);
                }
            }
            if (landParam != null) {
                var total_l_params = 8;
                if (landParam.length % total_l_params != 0) {
                    return false;
                }
                var gapParams = landParam.length / total_l_params;
                for (var lp = 0; lp < gapParams; lp++) {
                    var start = lp * total_l_params;
                    var param1 = Number.parseInt(landParam[start]);
                    var param2 = Number.parseInt(landParam[start + 1]);
                    var param3 = Number.parseInt(landParam[start + 2]);
                    var param4 = Number.parseInt(landParam[start + 3]);
                    var param5 = Number.parseInt(landParam[start + 4]);
                    var param6 = Number.parseInt(landParam[start + 5]);
                    var param7 = Number.parseInt(landParam[start + 6]);
                    var param8 = landParam[start + 7];
                    var tilePos = { x: param1, y: param2 };
                    console.log("land tile@", tilePos, param6);
                    var id = this.getNameFromBrushTiles(param8);
                    var texture_t = this.config.brushTiles[id].t;
                    var texture_k = this.config.brushTiles[id].k;
                    var gLand = new Land(tilePos, texture_k, texture_t, this.config);
                    gLand.level = param3;
                    gLand.development_id = param4;
                    gLand.relation_id = param5;
                    gLand.path_id = param6;
                    gLand.status = param7;
                    this.storeNewData(gLand, this.lands);
                    if (forEditor) {
                        gLand.EditorDisplay(this.config);
                    }
                    else {
                        gLand.InitGameDisplay(this.config);
                    }
                }
            }
            this.update_export_data();
            this.reorderDepths();
            console.log("load completed 📣");
            return true;
        }
        catch (e) {
            console.log("err load: ", e);
            return false;
        }
    };
    MapMaker.prototype.storeNewData = function (item, list) {
        list.push(item);
        item.appendFrom(this.zoo_keeper);
    };
    MapMaker.prototype.import_data_from_url_bar = function () {
        var url = location.search.slice(1);
        if (url !== undefined) {
            this.loadMapEditor(url);
        }
    };
    MapMaker.isValidMapData = function (data) {
        var mapParams = new URLSearchParams(data);
        return mapParams.get("m") != null && mapParams.get("l") != null && mapParams.get("g") != null;
    };
    MapMaker.isValidMapSizeData = function (data) {
        var mapParams = new URLSearchParams(data);
        return mapParams.get("map") != null;
    };
    MapMaker.extractMapSize = function (data, success) {
        try {
            var mapParams = new URLSearchParams(data);
            var mapp = mapParams.get("map");
            if (mapp) {
                var mobParam = mapp.split(",");
                var _x = Number.parseInt(mobParam[0]);
                var _y = Number.parseInt(mobParam[1]);
                var _size = Number.parseInt(mobParam[2]);
                var _scale = Number.parseFloat(mobParam[3]);
                var temp_config = {
                    tileX: _x,
                    tileY: _y,
                    tileSize: _size,
                    tileScale: _scale,
                    ww: _x * _size * _scale,
                    wh: _y * _size * _scale,
                };
                success(temp_config);
                return true;
            }
        }
        catch (e) {
            console.error(e);
            return false;
        }
        return true;
    };
    MapMaker.prototype.loadMapEditor = function (data) {
        try {
            if (MapMaker.isValidMapData(data)) {
                var mapParams = new URLSearchParams(data);
                this.getCustomLayout(mapParams, true);
            }
            else {
                console.log("incomplete params");
            }
        }
        catch (e) {
            console.log("failed to load data", e);
        }
    };
    MapMaker.prototype.initLevel = function (n, map) {
    };
    return MapMaker;
}());
export default MapMaker;
