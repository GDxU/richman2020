import Vue from "Vue"
import _ from "lodash"
import NDArray from "ndarray"
import {Text, Texture, Sprite, Container, DisplayObject, filters} from "pixi.js"
import {Config, DepthItem, FUNC_ID, MapItem, Player, TileAssetData} from "./Common";
import {FULL_EXTENDS_DIRECTIONS, PRICE_LV_TYPE_A, FULL_CROSS_DIRECTIONS, RENT_LV_TYPE_A} from "./DataSample";

/**
 * formulate 2d tiles helper
 */
export class Helper {
  constructor() {
  }

  static getTilePos(d: Config, real_pos: { x: number, y: number }): { x: number, y: number } {
    /* let mouse_x = real_pos.x;
       let mouse_y = real_pos.y;*/
    let rx1 = real_pos.x / (d.tileSize * d.tileScale);
    let ry1 = real_pos.y / (d.tileSize * d.tileScale);
    return {
      x: Math.floor(rx1),
      y: Math.floor(ry1)
    }
  }

  static getDistance(r1: { x: number, y: number }, r2: { x: number, y: number }): number {
    let d1 = r1.x - r2.x;
    let d2 = r1.y - r2.y;
    let sq = Math.pow(d1, 2) + Math.pow(d2, 2);
    return Math.sqrt(sq);
  }

  /**
   * for the tile positions only
   * @param {{x: number; y: number}} r1
   * @param {{x: number; y: number}} r2
   * @returns {number}
   * 1: RIGHT
   * 2: UP
   * 3: DOWN
   * 4: LEFT
   */
  static getDir(r1: { x: number, y: number }, r2: { x: number, y: number }): number {
    let d1 = r1.x - r2.x;
    let d2 = r1.y - r2.y;
    let dir = 0;

    if (d1 > 0) {
      dir = 1;
    } else if (d1 < 0) {
      dir = 4;
    }

    if (d2 > 0) {
      dir = 3;
    } else if (d2 < 0) {
      dir = 2;
    }

    return dir;
  }


  static GenerateRoutePlayerDir(start: { x: number, y: number }, route: Array<GapPath>): Array<number> {
    let previous_dir = start;
    let d: Array<number> = [];
    _.each(route, function (step, stepIndex) {
      let dir = Helper.getDir(step.tilepos, previous_dir);
      previous_dir = step.tilepos;
      d.push(dir);
    });
    return d;
  }

  static adjustNormalPosLocal(d: Config, sprite: Sprite): { x: number, y: number, s: number } {
    return Helper.adjustNormalTilePos(d, {x: 0, y: 0},
      sprite.width,
      sprite.height
    )
  };

  static adjustNormalTilePos(d: Config, basePos: { x: number, y: number }, w: number, h: number): { x: number, y: number, s: number } {
    const {tileSize, tileOffset, tileScale} = d;
    const total = tileScale * tileSize;
    let offset_y = 0;
    if (h > w && w * 1.1 > total && h > total * 1.5) {
      offset_y = (h - w * 0.8) - total / 2;
    } else {
      offset_y = total / 2;
    }
    return {
      x: basePos.x + total / 2,
      y: basePos.y + offset_y,
      s: (tileSize + (tileOffset * 2)),
    };
  };

  static adjustPathPos(d: Config, basePos: { x: number, y: number }, w: number, h: number, percent: number): { x: number, y: number, s: number } {
    const {tileSize, tileOffset, tileScale} = d;
    // const total = tileScale * tileSize;
    // let offset_y = 0;
    return {
      x: basePos.x + tileSize * tileScale / 2,
      y: basePos.y + tileSize * tileScale / 2,
      s: (tileSize + (tileOffset * 2)),
    };
  };

  /**
   * adjusting walking path positions
   * @param {Config} d
   * @param {{x: number; y: number}} basePos
   * @param {number} w
   * @param {number} h
   * @param {number} percent
   * @returns {{x: number; y: number; s: number}}
   */
  static adjustWalkPathPos(d: Config, basePos: { x: number, y: number }, w: number, h: number, percent: number): { x: number, y: number, s: number } {
    const {tileSize, tileOffset, tileScale} = d;
    // const total = tileScale * tileSize;
    // let offset_y = 0;

    return {
      x: basePos.x + (Math.random() * 0.8 + 0.2) * tileSize * tileScale,
      y: basePos.y + (Math.random() * 0.8 + 0.2) * tileSize * tileScale,
      s: (tileSize + (tileOffset * 2)),
    };
  };

  /**
   * adjust land position
   * @param {Config} d
   * @param {{x: number; y: number}} basePos
   * @param {number} w
   * @param {number} h
   * @param {number} percent
   * @returns {{x: number; y: number; s: number}}
   */
  static adjustLandPos(d: Config, basePos: { x: number, y: number }, w: number, h: number, percent: number): { x: number, y: number, s: number } {
    const {tileSize, tileOffset} = d;
    // const total = tileScale * tileSize;
    // let offset_y = 0;
    return {
      x: basePos.x,
      y: basePos.y,
      s: (tileSize + (tileOffset * 2)),
    };
  };

  /**
   * the positions are additions only
   * @param {{x: number; y: number}} a
   * @param {{x: number; y: number}} b
   * @returns {{x: number; y: number; id?: number}}
   */
  static addPos(a: { x: number, y: number }, b: { x: number, y: number }): { x: number, y: number, id?: number } {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    }
  }

  /**
   * positions are factored
   * @param {{x: number; y: number}} a base
   * @param {{x: number; y: number}} b add
   * @param {number} m multiply
   * @returns {{x: number; y: number; id?: number}}
   */
  static addPosMul(a: { x: number, y: number }, b: { x: number, y: number }, m: number): { x: number, y: number, id?: number } {
    return {
      x: a.x + b.x * m,
      y: a.y + b.y * m,
    }
  }

  /**
   * tile real pos centered
   * @param {Config} d configuration
   * @param {{x: number; y: number}} tile_pos
   * @returns {{x: number; y: number}} tile position
   */
  static getTileRealPosCentered(d: Config, tile_pos: { x: number, y: number }): { x: number, y: number } {
    return {
      x: tile_pos.x * d.tileSize * d.tileScale,
      y: tile_pos.y * d.tileSize * d.tileScale,
    }
  }

  /**
   * position only for the camera
   * @param {Config} d
   * @param {{x: number; y: number}} tile_pos
   * @returns {{x: number; y: number}}
   */
  static getTilePosCameraCentered(d: Config, tile_pos: { x: number, y: number }): { x: number, y: number } {
    const half = d.tileSize * d.tileScale / 2;
    return {
      x: tile_pos.x * d.tileSize * d.tileScale + half,
      y: tile_pos.y * d.tileSize * d.tileScale + half,
    }
  }

  /**
   *
   * @param {Config} d
   * @param {{x: number; y: number}} base
   * @returns {{x: number; y: number}}
   */
  static adjustRealCentered(d: Config, base: { x: number, y: number }): { x: number, y: number } {
    return {
      x: base.x + d.tileSize * d.tileScale / 2 - 12,
      y: base.y + d.tileSize * d.tileScale / 2 - 12,
    }
  }

  /**
   * randomized in tile position
   * @param {Config} d
   * @param {{x: number; y: number}} actorPos
   * @returns {{x: number; y: number}}
   */
  static calAdjustCharCameraCenter(d: Config, actorPos: { x: number, y: number }): { x: number, y: number } {
    // const half = d.tileSize * d.tileScale / 2;
    return {
      x: actorPos.x + 16,
      y: actorPos.y + 16,
    }
  }

  /**
   * cal randomized in real position
   * @param {Config} d
   * @param {{x: number; y: number}} final_pos
   * @returns {{x: number; y: number}}
   */
  static calRandomizeInRealPosition(d: Config, final_pos: { x: number, y: number }): { x: number, y: number } {
    return {
      x: final_pos.x + (d.tileSize * d.tileScale - 32) * Math.random(),
      y: final_pos.y + (d.tileSize * d.tileScale - 32) * Math.random(),
    }
  }

  /**
   * cal randomized in real center position
   * @param {Config} d
   * @param {{x: number; y: number}} final_pos
   * @returns {{x: number; y: number}}
   */
  static calRandomizeInRealCenterPosition(d: Config, final_pos: { x: number, y: number }): { x: number, y: number } {
    const padding = 0;
    return {
      x: final_pos.x + (d.tileSize * d.tileScale - 32 - padding) * Math.random() + padding,
      y: final_pos.y + (d.tileSize * d.tileScale - 32 - padding) * Math.random() + padding,
    }
  }


  static calPathTileDepth(tilepos: { x: number, y: number }): number {
    return tilepos.y * 10 + tilepos.x + 1;
  }

  static calLandTileDepth(tilepos: { x: number, y: number }): number {
    return tilepos.y * 10 + tilepos.x + 2;
  }

  static calNormalTileDepth(tilepos: { x: number, y: number }): number {
    return tilepos.y * 100 + tilepos.x + 100;
  }

  static calActorDepth(tilepos: { x: number, y: number }, y: number): number {
    return tilepos.x + 3 + y;
  }

  static findMatchedTileIndex(item: Array<MapItem>, x: number, y: number): number {
    return item.findIndex(function (mapItem: MapItem) {
      return mapItem.isMatchTile(x, y)
    });
  }

  static isPartOf(items: Array<MapItem>, tilePos: { x: number, y: number }): boolean {
    for (let item of items) {
      let g = item.isMatchTile(tilePos.x, tilePos.y);
      if (g) {
        return true
      }
    }
    return false;
  }

  /**
   * scan for all potential events from the end part of game
   * @param {Array<Land>} lands
   * @param {number} pathID
   * @returns {Array<number>} the event IDs
   */
  static scanEvents(lands: Array<Land>, pathID: number): Array<number> {
    let events: Array<number> = [];
    _.each(lands, function (land: Land) {
      //console.log(land.path_id);
      if (land.path_id === pathID) {
        events.push(land.development_id);
      }
    });
    return events;
  }

  /**
   * scan all events from the existing lands which is related to this path location
   * @param {Array<Land>} lands
   * @param {number} pathID
   * @returns {Array<Land>}
   */
  static scanEventOnLands(lands: Array<Land>, pathID: number): Array<Land> {
    let events: Array<Land> = [];
    _.each(lands, function (land: Land) {
      //console.log(land.path_id);
      if (land.path_id === pathID) {
        events.push(land);
      }
    });
    return events;
  }

  /**
   * is this a part of the map item series?
   * @param {Array<MapItem>} items
   * @param {{x: number; y: number}} tilePos
   * @returns {MapItem | boolean}
   */
  static getPartOf(items: Array<MapItem>, tilePos: { x: number, y: number }): MapItem | boolean {
    if (tilePos) {
      for (let item of items) {
        let g = item.isMatchTile(tilePos.x, tilePos.y);
        if (g) {
          return item;
        }
      }
    }

    return false;
  }

  static getFutureTilesArray(positive_steps: number, current_path_id: number, road: Array<GapPath>): Array<GapPath> {
    let list: Array<GapPath> = [];
    /*  const index = road.findIndex(function (path: GapPath) {
        return path.path_order === current_path_id
      });
      list.push(road[index]);*/

    let total = Math.abs(positive_steps) + 1, count = 1;

    if (positive_steps > 0) {
      while (count < total) {
        const index = road.findIndex(function (path: GapPath) {
          return path.path_order === (current_path_id + count) % road.length
        });
        list.push(road[index]);
        count++;
      }
    } else {
      while (count < total) {
        const index = road.findIndex(function (path: GapPath) {
          return path.path_order === (current_path_id - count) % road.length
        });
        list.push(road[index]);
        count++;
      }
    }

    return list;
  }


  static findJail(entities: Array<Mob>): any {
    let hospital;
    _.each(entities, (m: Mob) => {
      if (m.meta.k === "ja") {
        hospital = m;
        return false
      }
    });
    return hospital;
  }

  static findHospital(entities: Array<Mob>): any {
    let hospital;
    _.each(entities, (m: Mob) => {
      if (m.meta.k === "hs") {
        hospital = m;
        return false
      }
    });
    return hospital;
  }

  /**
   * generating LP map for lp-pathfinding
   * @param {Config} c
   * @param {Array<GapPath>} paths
   * @returns {Array<number>}
   */
  static generateNArrayPathMap(c: Config, paths: Array<GapPath>): NDArray {
    let nArray: Array<number> = [];
    for (let mx = 0; mx < c.tileX; mx++) {
      for (let my = 0; my < c.tileY; my++) {
        let default_solid = 1;
        _.each(paths, function (p: GapPath) {
          if (p.isMatchTile(mx, my)) {
            default_solid = 0;
          }
        });
        nArray.push(default_solid);
      }
    }
    return NDArray(nArray, [c.tileX, c.tileY]);
  }

  static findClosestPointFromPathRoutes(fromPoint: { x: number, y: number }, ___paths: Array<GapPath>) {
    let level: number = 0;
    let reached = false;
    let collected_positions: Array<GapPath> = [];
    for (let i = 0; i < FULL_CROSS_DIRECTIONS.length; i++) {
      for (let m = 1; m < 10; m++) {
        if (reached) break;
        level = m;
        const delpos = FULL_CROSS_DIRECTIONS[i];
        const projected_loc = Helper.addPosMul(fromPoint, delpos, m);
        for (let r = 0; r < ___paths.length; r++) {
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
    }
  }

  static getName(n: number): string {
    return "." + n;
  }

  static getPropertyName(n: number): string {
    return "p" + n;
  }

  static getFName(n: number): string {
    return "f" + n;
  }

  static isContainedObjectName(name: string, item: TileAssetData): boolean {
    if (item.name.indexOf(name) > -1) {
      return true;
    } else {
      return false;
    }
  }

  /*
    static toDataString(str: string): string {

    }

    static dataStringToCode(str: string): string {

    }*/
  static BuildingTextureSearch(lv: number, allk: string, config: Config): TileAssetData {
    let prefix = "lv";
    let loc = -1;
    const names: Array<string> = allk.split("");
    let list: Array<TileAssetData> = [];
    _.each(names, function (sub: string) {
      let short_name = `${prefix}${lv}${sub}`;
      loc = _.findIndex(config.brushTiles, function (o) {
        return o.k === short_name;
      });
      if (loc > -1) {
        list.push(config.brushTiles[loc]);
        return;
      }
    });
    return list[0];
  }

  /**
   * get gap path from the path_id
   * @param {number} f
   * @param {Array<GapPath>} list
   * @returns {GapPath}
   */
  static getPathFromPathID(path_id: number, list: Array<GapPath>): GapPath {
    let k = list.findIndex((gap) => {
      return gap.path_order === path_id
    });
    return list[k];
  }

}


export class GapPath extends MapItem {
  //AKA path ID
  path_order: number;
  stop_fun: number;
  pass_fun: number;
  texture: Texture;
  keeper: Container;

  constructor(tile: { x: number, y: number }, txture: Texture) {
    super(Helper.calPathTileDepth(tile), tile);
    this.stop_fun = 0;
    this.pass_fun = 0;
    this.texture = txture;
    this.path_order = -1;
    this.keeper = new Container();
    this.sprite = new Sprite(this.texture);
    this.sprite.scale.set(1.16, 1.1);
    this.keeper.addChild(this.sprite);
  }

  InitEditPaint(d: Config, order: number) {
    this.path_order = order;
    this.RenderEditorMark(d);
  }

  EditorDisplay(d: Config) {
    this.RenderEditorMark(d);
  }

  Setup(path_order: number, stop: number, pass: number) {
    this.path_order = path_order;
    this.stop_fun = stop;
    this.pass_fun = pass;
    return this;
  }

  InitGameDisplay(d: Config) {
    //let text = this.getName(path_order);
    this.RenderTilePath(d);
  }

  RenderEditorMark(d: Config) {
    let text_instance = new Text(Helper.getName(this.path_order), {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0x69fffa,
      align: "left"
    });
    text_instance.position.set(0, d.tileScale * d.tileSize - text_instance.height);
    this.keeper.addChild(text_instance);

    const p = Helper.getTileRealPosCentered(d, this.tilepos);
    this.keeper.position.set(p.x, p.y);
  }

  RenderTilePath(d: Config) {
    //console.log(this.sprite.texture);
    const p = Helper.getTileRealPosCentered(d, this.tilepos);
    //const {x, y} = Helper.adjustPathPos(d, p, this.sprite.width, this.sprite.height, 0.5);
    //console.log("path tile@", this.path_order, this.tilepos, x, y);
    //  this.sprite.position.set(x, y);
    //  const p = Helper.getTileRealPosCentered(d, this.tilepos);
    this.keeper.position.set(p.x, p.y);
  }

  ResetOrder(order: number): void {
    this.path_order = order;
    if (this.sprite instanceof Text) {
      this.sprite.text = Helper.getName(order)
    }
  }


  removeFrom(parent: Container): void {
    parent.removeChild(this.keeper);
  }

  appendFrom(parent: Container): void {
    parent.addChild(this.keeper);
  }

  getDisplayItem(): DisplayObject {
    return this.keeper;
  }

  /*  positionTxt2d(p, d: Config) {
      return {x: p.x, y: p.y + d.tileScale * d.tileSize - this.sprite.height}
    }*/
  SpawnPassEvent(eventCode: number): GapPath {
    this.pass_fun = eventCode;
    console.log("planted location for pass event:", this.path_order);
    return this;
  }

  SpawnEndEvent(eventCode: number): GapPath {
    this.stop_fun = eventCode;
    console.log("planted location for stop event:", this.path_order);
    return this;
  }

  RemoveRoadEvents(): void {
    this.stop_fun = 0;
    this.pass_fun = 0;
  }
}


export class Mob extends MapItem {
  type: number;
  meta: TileAssetData;
  //realPos: { x: number, y: number };
  config: Config;

  /*
    sprite: Sprite;
    depth: number;
    tilepos: { x: number, y: number };*/

  constructor(tPos: { x: number, y: number }) {
    super(Helper.calNormalTileDepth(tPos), tPos);
  }

  setupByTypeIndex(_type: number, _config: Config): Mob {
    let _percentage = 0.68;
    return this.setupByTypeIndexHeight(_type, _config, _percentage);
  }

  setDefaultProperties(sprite: Sprite, _cfg: Config, height_anchor: number): void {
    sprite.anchor.set(0.5, height_anchor);
    sprite.scale.set(0.6, 0.6);
    const unadjusted_pos = Helper.getTileRealPosCentered(_cfg, this.tilepos);
    const Q = Helper.adjustNormalTilePos(_cfg, unadjusted_pos, sprite.width, sprite.height);
    sprite.position.set(Q.x, Q.y);
    sprite.interactive = false;
  }

  setupByTypeIndexHeight(_type: number, _cfg: Config, height_adjustment: number): Mob {
    this.type = _type;
    this.config = _cfg;
    this.meta = _cfg.brushTiles[_type];
    const texture = _cfg.brushTiles[_type].t;
    const act = new Sprite(texture);
    this.setDefaultProperties(act, _cfg, height_adjustment);
    this.setSprite(act);
    return this;
  }

  setupByLevel(c: number, _cfg: Config): Mob {
    const texture = Helper.BuildingTextureSearch(c, "abcde", _cfg);
    const act = new Sprite(texture.t);
    this.setDefaultProperties(act, _cfg, 0.68);
    this.setSprite(act);
    return this;
  }

  getDisplayItem(): DisplayObject {
    return this.sprite;
  }

  /**
   * finalize the land and make buildings for it.
   * @param {Array<Mob>} list
   * @param {PIXI.Container} parent
   */
  build(list: Array<Mob>, parent: Container): void {
    list.push(this);
    this.appendFrom(parent);
  }
}

export class Land extends MapItem {
  /* sprite: Sprite;
   depth: number;
   tilepos: { x: number, y: number };
  */
  /**
   * for relation_id
   *
   * 1 2 3
   * 0   4
   * 7 6 5
   */
  relation_id: number;
  /**
   * the building styling group ID
   */
  development_id: number;
  /**
   * the path ID
   */
  path_id: number;
  /**
   * the level of developments from its land
   */
  level: number;
  /**
   * editing mode = 0
   */
  status: number;
  /**
   * the owner ID
   * no owner -1
   * owned by the bank 888
   */
  owner: number;
  /**
   * the below are generated dynamically
   */
  texture_id: string;
  texture: Texture;
  calculation_map: Array<{ x: number, y: number }> = FULL_EXTENDS_DIRECTIONS;
  price_schedule: Array<number>;
  rent_schedule: Array<number>;
  temp_path_locations: Array<{ x: number, y: number, id?: number }>;
  keeper: Container;
  text_instance: Text;
  editor_temp_location_index: number;
  global_config: Config;

  constructor(tile: { x: number, y: number }, texture_id: string, txture: Texture, d: Config) {
    super(Helper.calLandTileDepth(tile), tile);
    this.keeper = new Container();
    this.temp_path_locations = [];
    this.price_schedule = [];
    this.rent_schedule = [];
    this.status = 0;
    this.level = 0;
    this.owner = -1;
    this.development_id = -1;
    this.path_id = -1;
    this.relation_id = -1;
    this.editor_temp_location_index = -1;
    this.texture_id = texture_id;
    this.sprite = new Sprite(txture);
    const unadjusted_pos = Helper.getTileRealPosCentered(d, tile);
    const {x, y} = Helper.adjustLandPos(d, unadjusted_pos, this.sprite.width, this.sprite.height, 0.5);
    // this.sprite.position.set(x, y);
    this.sprite.scale.set(1.16, 1.1);
    //land texture only
    this.keeper.addChild(this.sprite);
    this.keeper.position.set(x, y);
    this.global_config = d;
  }

  /**
   * the editor display moment of it.
   * @param {Config} d
   * @constructor
   */
  EditorDisplay(d: Config): void {
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
  }

  /**
   * the configurations of the data
   * @param {Config} d
   * @constructor
   */
  InitGameDisplay(d: Config): void {
    this.status = 1;
    this.price_schedule = PRICE_LV_TYPE_A;
    this.rent_schedule = RENT_LV_TYPE_A;
    this.global_config = d;
  }

  /**
   * the check back form the possible temp
   * @param {Array<GapPath>} paths
   * @constructor
   */
  CheckAllPossibleTempLocs(paths: Array<GapPath>): void {
    this.temp_path_locations = [];
    for (let i = 0; i < this.calculation_map.length; i++) {
      const delpos = this.calculation_map[i];
      for (let r = 0; r < paths.length; r++) {
        const projected_loc = Helper.addPos(delpos, this.tilepos);
        if (paths[r].isMatchTile(projected_loc.x, projected_loc.y)) {
          projected_loc.id = i;
          this.temp_path_locations.push(projected_loc);
        }
      }
    }
  }

  public removeFrom(parent: Container): void {
    parent.removeChild(this.keeper);
  }

  public appendFrom(parent: Container): void {
    parent.addChild(this.keeper);
  }

  public getDisplayItem(): DisplayObject {
    return this.keeper;
  }

  public Acquire(player: Player): void {
    this.colorUp(player.colorRotation);
    this.owner = player.player_id;
  }

  destroyLand(): void {
    this.owner = -1;
    this.keeper.removeChildAt(0);
  }

  destroyBuildings(): void {
    this.keeper.removeChildAt(1);
  }

  SetGameMode(): void {
    this.status = 1;
  }

  SetEditorMode(): void {
    this.status = 0;
  }

  private getAfterRotatedTiles(): { x: number, y: number, id?: number } {
    return this.temp_path_locations[this.editor_temp_location_index % (this.temp_path_locations.length + 1)];
  }

  private colorUp(degree: number): void {
    const nightFilter = new filters.ColorMatrixFilter();
    nightFilter.hue(degree, false);
    this.sprite.filters = [nightFilter];
  }

  RotateSpecialShop(paths: Array<GapPath>, d: Config, function_id: number): void {
    if (this.status === 0) {
      this.CheckAllPossibleTempLocs(paths);
      if (this.temp_path_locations.length > 0) {
        this.colorUp(60);
        this.editor_temp_location_index++;
        let ch = Helper.getPartOf(paths, this.getAfterRotatedTiles());
        this.development_id = function_id;

        if (ch) {
          if (ch instanceof GapPath) {
            this.path_id = ch.path_order;
            let tag = Helper.getFName(ch.path_order);
            if (this.text_instance == null) {
              this.addTextBox(d, 0x26396c, tag);
            } else {
              this.setLabel(tag);
            }
          }
        } else {
          this.clearLandProperties();
        }
      }
    }
  }

  RotatePathProperty(paths: Array<GapPath>, d: Config): void {
    if (this.status === 0) {
      this.CheckAllPossibleTempLocs(paths);
      if (this.temp_path_locations.length > 0) {
        const nightFilter = new filters.ColorMatrixFilter();
        nightFilter.vintage(true);
        this.sprite.filters = [nightFilter];
        this.editor_temp_location_index++;

        let ch = Helper.getPartOf(paths, this.getAfterRotatedTiles());
        this.development_id = FUNC_ID.PROPERTY;
        if (ch) {
          if (ch instanceof GapPath) {
            this.path_id = ch.path_order;
            let tag = Helper.getPropertyName(ch.path_order);
            if (this.text_instance == null) {
              this.addTextBox(d, 0x69fffa, tag);
            } else {
              this.setLabel(tag);
            }
          }
        } else {
          this.clearLandProperties();
        }
      }
    }
  }

  public clearLandProperties(): void {
    this.path_id = -1;
    this.setLabel("");
    this.sprite.filters = [];
    this.owner = -1;
  }

  private setLabel(tag: string): void {
    if (this.text_instance != null) {
      this.text_instance.text = tag;
    }
  }

  private addTextBox(d: Config, color: number, text): void {
    this.text_instance = new Text(text, {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: color,
      align: "left"
    });
    this.text_instance.position.set(0, d.tileScale * d.tileSize - this.text_instance.height);
    this.keeper.addChild(this.text_instance);
  }
}


export default class MapMaker {
  res: any;
  zoo_keeper: Container;
  bg_layer: Container;
  config: Config;
  entities: Array<Mob>;
  paths: Array<GapPath>;
  lands: Array<Land>;
  context: any;
  player: { x: number, y: number };
  brush: number;
  allItemsDescriptor: Array<DepthItem>;

  constructor(a: any, b: Container, c: Container, d: Config, ctx: Vue) {
    this.res = a;
    this.brush = -1;
    this.zoo_keeper = b;
    this.bg_layer = c;
    this.config = d;
    this.entities = [];
    this.paths = [];
    this.lands = [];
    this.context = ctx;
    const bg = new Sprite(a.map_arena.texture);
    //bg.interactive = true;
    //  this.bindMouseEvents(bg);
    this.bg_layer.addChild(bg);
    this.player = {x: 0, y: 0};
  }


  reorderDepths(): void {
    this.allItemsDescriptor = [];
    const that = this;
    const paths = that.paths;
    const entities = that.entities;
    const lands = that.lands;
    const total = entities.length + paths.length + lands.length;
    // let path_count = 0, entity_count = 0, land_count = 0;

    paths.forEach(function (obj, i) {
      that.allItemsDescriptor.push({type: obj, depth: obj.depth, index: i});
    });

    lands.forEach(function (obj, i) {
      that.allItemsDescriptor.push({type: obj, depth: obj.depth, index: i});
    });

    entities.forEach(function (obj, i) {
      that.allItemsDescriptor.push({type: obj, depth: obj.depth, index: i});
    });

    that.allItemsDescriptor.sort((a, b) => (a.depth > b.depth) ? 1 : -1);

    for (let i = 0; i < total; i++) {
      let type_instance = that.allItemsDescriptor[i].type;
      let order_index = that.allItemsDescriptor[i].index;
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
    //================== children
  }

  /*
  private bindMouseEvents(instance: Sprite): void {
    const that = this;
    instance.on("touchend", function (e) {
      const realPos = e.data.getLocalPosition(instance);
      that.EditorPaintEvent(realPos);
    });
    instance.on("pointerup", function (e) {
      const realPos = e.data.getLocalPosition(instance);
      that.EditorPaintEvent(realPos);
    });
  }*/

  private inBounds(x: number, y: number): boolean {
    const {arenaSizeX, arenaSizeY} = this.config;

    const inb = (
      x >= 0 && x < arenaSizeX &&
      y >= 0 && y < arenaSizeY
    );

    //console.log("in bounded", inb);
    return inb;

  };

  use(brush_type): void {
    this.brush = brush_type;
  }

  private removeForLand({x, y}): void {
    // if entity exists in this spot, replace it
    const paths = this.paths;
    const lands = this.lands;

    let gapIdx = Helper.findMatchedTileIndex(paths, x, y);
    let landIdx = Helper.findMatchedTileIndex(lands, x, y);

    if (landIdx != -1) {
      //console.log("remove this sprite a ", entIdx, x, y);
      lands[landIdx].removeFrom(this.zoo_keeper);
      // this.zoo_keeper.removeChild(entities[entIdx].removeFrom());
      lands.splice(landIdx, 1);
    }

    if (gapIdx != -1) {
      paths[gapIdx].removeFrom(this.zoo_keeper);
      //      this.zoo_keeper.removeChild(paths[entIdx]);
      paths.splice(gapIdx, 1);
      if (gapIdx < paths.length - 1) {
        for (let j = 0; j < paths.length; j++) {
          paths[j].ResetOrder(j);
        }
      }
    }
  };

  /**
   * remove the construction and also the properties along with the land
   * @param {any} x
   * @param {any} y
   */
  private removeForEntity({x, y}): void {
    // if entity exists in this spot, replace it
    const entities = this.entities;
    const paths = this.paths;

    let entIdx = Helper.findMatchedTileIndex(entities, x, y);
    let gapIdx = Helper.findMatchedTileIndex(paths, x, y);

    if (entIdx != -1) {
      //console.log("remove this sprite a ", entIdx, x, y);
      entities[entIdx].removeFrom(this.zoo_keeper);
      // this.zoo_keeper.removeChild(entities[entIdx].removeFrom());
      entities.splice(entIdx, 1);
    }

    if (gapIdx != -1) {
      paths[gapIdx].removeFrom(this.zoo_keeper);
      //      this.zoo_keeper.removeChild(paths[entIdx]);
      paths.splice(gapIdx, 1);
      if (gapIdx < paths.length - 1) {
        for (let j = 0; j < paths.length; j++) {
          paths[j].ResetOrder(j);
        }
      }
    }
  };

  private removeOnlyOnEntity(tilePos: { x: number, y: number }): void {
    this.removeSwapMob(tilePos);
    const lands = this.lands;
    let entLandx = Helper.findMatchedTileIndex(lands, tilePos.x, tilePos.y);
    lands[entLandx].clearLandProperties();
  }

  protected removeSwapMob(tilePos: { x: number, y: number }): void {
    const entities = this.entities;
    let entIdx = Helper.findMatchedTileIndex(entities, tilePos.x, tilePos.y);
    if (entIdx != -1) {
      //console.log("remove this sprite a ", entIdx, x, y);
      entities[entIdx].removeFrom(this.zoo_keeper);
      // this.zoo_keeper.removeChild(entities[entIdx].removeFrom());
      entities.splice(entIdx, 1);
    }
  }

  private removeAllKindsAt({x, y}): void {

    // if entity exists in this spot, replace it
    const entities = this.entities;
    const paths = this.paths;
    const lands = this.lands;

    let entIdx = Helper.findMatchedTileIndex(entities, x, y);
    let gapIdx = Helper.findMatchedTileIndex(paths, x, y);
    let landIdx = Helper.findMatchedTileIndex(lands, x, y);

    if (entIdx != -1) {
      //console.log("remove this sprite a ", entIdx, x, y);
      entities[entIdx].removeFrom(this.zoo_keeper);
      // this.zoo_keeper.removeChild(entities[entIdx].removeFrom());
      entities.splice(entIdx, 1);
    }

    if (landIdx != -1) {
      //console.log("remove this sprite a ", entIdx, x, y);
      lands[landIdx].removeFrom(this.zoo_keeper);
      // this.zoo_keeper.removeChild(entities[entIdx].removeFrom());
      lands.splice(landIdx, 1);
    }

    if (gapIdx != -1) {
      paths[gapIdx].removeFrom(this.zoo_keeper);
      //      this.zoo_keeper.removeChild(paths[entIdx]);
      paths.splice(gapIdx, 1);
      if (gapIdx < paths.length - 1) {
        for (let j = 0; j < paths.length; j++) {
          paths[j].ResetOrder(j);
        }
      }
    }
  }

  ClearAll() {
    for (let path of this.paths) {
      path.removeFrom(this.zoo_keeper);
    }
    for (let entity of this.entities) {
      entity.removeFrom(this.zoo_keeper);
    }
    for (let land of this.lands) {
      land.removeFrom(this.zoo_keeper);
    }
    this.paths = [];
    this.entities = [];
    this.lands = [];
  }


  /**
   * only available in the editor paint event
   * @param mousePos
   * @constructor
   */
  EditorPaintEvent(mousePos: { x: number, y: number }): void {
    const that = this;

    if (that.brush === -1) return;

    const tile_pos = Helper.getTilePos(that.config, mousePos);

    // is this even possible?
    if (!that.inBounds(mousePos.x, mousePos.y)) {
      return
    }

    const type = that.brush;
    const brush = that.config.brushTiles[type];

    if (type === 2) {
      /**
       * land only
       */
      if (Helper.isPartOf(that.lands, tile_pos)) {
        const landuncasted = Helper.getPartOf(that.lands, tile_pos);
        if (landuncasted instanceof Land) {
          landuncasted.RotatePathProperty(that.paths, that.config);
        }
      } else {
        that.removeForLand(tile_pos);
        const land = new Land(tile_pos, brush.k, brush.t, that.config);
        //land.RotatePathProperty(that.paths);
        that.storeNewData(land, that.lands);
        that.reorderDepths();
        land.EditorDisplay(that.config);
      }
      that.update_export_data();
      return;
    }


    // const type: number = that.context.$data.brush;
    // console.log("vue brush setting: ", type);
    // console.log("detection mouse position: ", mousePos);
    // if brush is eraser, update the share link and leave;
    if (type === 3) {
      /**
       * eraser for everything
       */
      that.removeAllKindsAt(tile_pos);
      that.reorderDepths();
      that.update_export_data();
      return;
    }

    if (type === 4) {
      /**
       * eraser constructions only
       */
      that.removeOnlyOnEntity(tile_pos);
      that.reorderDepths();
      that.update_export_data();
      return;
    }


    if (type === 1) {
      /**
       * path brush - gap
       */
      that.removeAllKindsAt(tile_pos);
      const land = new GapPath(tile_pos, brush.t);
      land.InitEditPaint(that.config, that.paths.length);
      that.storeNewData(land, that.paths);
      // const long = that.paths.length;
      that.reorderDepths();
      that.update_export_data();
      return;
    }

    // if brush is player-knight remove any old entity info so there"s only one player
    if (type === 0) {
      // if (that.player != null) {
      //   that.removeForEntity(x, y);
      // }
      //that.player = MapMaker.getTileRealPosCentered(that.config, tile_pos);
      // that.player = tile_pos;
      /**
       * land only
       */
      if (!Helper.isPartOf(that.lands, tile_pos)) {
        that.removeForLand(tile_pos);
        const land = new Land(tile_pos, brush.k, brush.t, that.config);
        //land.RotatePathProperty(that.paths);
        that.storeNewData(land, that.lands);
        that.reorderDepths();
        land.EditorDisplay(that.config);
      }
      that.update_export_data();
      return;

    }
    if (Helper.isPartOf(that.entities, tile_pos) && Helper.isPartOf(that.lands, tile_pos)) {

      if (Helper.isContainedObjectName("minishop", brush)) {
        const shopland = Helper.getPartOf(this.lands, tile_pos);
        if (shopland instanceof Land) {
          shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.SHOP);
        }
      }
      if (Helper.isContainedObjectName("bank", brush)) {
        const shopland = Helper.getPartOf(this.lands, tile_pos);
        if (shopland instanceof Land) {
          shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.BANK);
        }
      }
      if (Helper.isContainedObjectName("casino", brush)) {
        const shopland = Helper.getPartOf(this.lands, tile_pos);
        if (shopland instanceof Land) {
          shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.CASINO);
        }
      }
      if (Helper.isContainedObjectName("freecard", brush)) {
        const shopland = Helper.getPartOf(this.lands, tile_pos);
        if (shopland instanceof Land) {
          shopland.RotateSpecialShop(this.paths, that.config, FUNC_ID.DRAWCARD);
        }
      }
    } else if (Helper.isPartOf(that.paths, tile_pos)) {

      /**
       * do nothing when this is a path.
       */

    } else {
      that.removeForEntity(tile_pos);
      //enter mob
      //  const s = that.getSpriteFromType(type);
      //    let perc = 0.68;
      const mob = new Mob(tile_pos);
      if (that.config.brushTiles[type].hasOwnProperty("h")) {
        mob.setupByTypeIndexHeight(type, that.config, brush.h)
      } else {
        mob.setupByTypeIndex(type, that.config)
      }
      mob.build(that.entities, that.zoo_keeper);
//      that.storeNewData(mob, that.entities);
      that.reorderDepths();
    }
    that.update_export_data();
  }

  getSpriteFromType(type: number): Sprite {
    // console.log("added sprited", type);
    const texture = this.config.brushTiles[type].t;
    const sp = new Sprite(texture);
    sp.interactive = false;
    return sp;
  }

  update_export_data(): void {
    //  let link = "p=" + this.player.x + "," + this.player.y;
    let link = "";

    if (this.entities.length > 0) {
      link += "&m=";
      /* this.context.$emit("link",
         {content: "", err: "you must add at least 1 enemy to generate the share url"}
       );
       return;*/

      // add entities to url
      for (let i = 0; i < this.entities.length; ++i) {
        // player is handled differently, for probably unnecessary reasons
        let ent = this.entities[i];
        if (ent.type !== 0) {
          link += ent.meta.k + "," +
            ent.tilepos.x + "," +
            ent.tilepos.y + ",";
        }
      }
      link = link.slice(0, -1);

    }


    // add paths to url
    if (this.paths.length > 0) {
      link += "&g=";
      for (let gp of this.paths) {
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
      for (let land of this.lands) {
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
    //    let finalLink = "http://www.baselink.com/?" + link;
    this.context.$emit("link", {content: link, err: ""});

  }

  getNameFromBrushTiles(name: string): number {
    for (let i = 0; i < this.config.brushTiles.length; ++i) {
      const shortname = this.config.brushTiles[i].k;
      if (name === shortname) {
        return i
      }
    }
    return -1;
  }

  getCustomLayout(params, forEditor: boolean): boolean {
    // console.log("loadMapEditor start", params);
    // any failure here will and we just go to level 1 instead
    try {
      this.ClearAll();

      let mobParam = params.get("m").split(",");
      // let playerParam = params.get("p").split(",");
      let gapsParam = params.get("g").split(",");
      let landParam = params.get("l").split(",");

      // console.log("loadMapEditor start", playerParam);
      // console.log("loadMapEditor start", gapsParam);
      // console.log("loadMapEditor start", mobParam);
      /**
       * normal tiles entities loadings
       */
      const total_mob_params: number = 3;
      // check #1, we expect type-name,x,y, so sets of 3 inputs
      if (mobParam.length % total_mob_params != 0) {
        return false
      }

      let mobSets = mobParam.length / total_mob_params;

      for (let f: number = 0; f < mobSets; f++) {
        let start = f * total_mob_params;
        let param1 = mobParam[start];
        let param2 = Number.parseInt(mobParam[start + 1]);
        let param3 = Number.parseInt(mobParam[start + 2]);

        let result_index = this.getNameFromBrushTiles(param1);
        if (result_index === -1) continue;

        // mobs.push({type: type, x: x, y: y});

        const tilePos = {x: param2, y: param3};
        const actorTile = new Mob(tilePos);
        actorTile.setupByTypeIndex(result_index, this.config);
        actorTile.build(this.entities, this.zoo_keeper);
        //  that.bindMouseEvents(s);
        //this.storeNewData(actorTile, this.entities);
      }

      /**
       * path loadings
       */
      // gaps are optional
      if (gapsParam != null) {

        //gap part
        const total_gap_params: number = 5;
        if (gapsParam.length % total_gap_params != 0) {
          return false
        }
        let gapParams = gapsParam.length / total_gap_params;

        for (let gc = 0; gc < gapParams; gc++) {
          let start = gc * total_gap_params;
          let param1 = Number.parseInt(gapsParam[start]);
          let param2 = Number.parseInt(gapsParam[start + 1]);
          let param3 = Number.parseInt(gapsParam[start + 2]);
          let param4 = Number.parseInt(gapsParam[start + 3]);
          let param5 = Number.parseInt(gapsParam[start + 4]);


          const tilePos = {x: param1, y: param2};
          // const texture_path = this.config.brushTiles[type].t;
          // console.log("path tile@", tilePos, param5);


          const land = new GapPath(tilePos, this.config.brushTiles[1].t);
          if (forEditor) {
            land
              .Setup(param5, param3, param4)
              .EditorDisplay(this.config);
          } else {
            land
              .Setup(param5, param3, param4)
              .InitGameDisplay(this.config);
          }
          this.storeNewData(land, this.paths);
        }
      }

      /**
       * land loadings
       */
      if (landParam != null) {

        //gap part
        const total_l_params: number = 8;
        if (landParam.length % total_l_params != 0) {
          return false
        }

        let gapParams = landParam.length / total_l_params;

        for (let lp = 0; lp < gapParams; lp++) {
          let start = lp * total_l_params;
          let param1 = Number.parseInt(landParam[start]);
          let param2 = Number.parseInt(landParam[start + 1]);
          let param3 = Number.parseInt(landParam[start + 2]);
          let param4 = Number.parseInt(landParam[start + 3]);
          let param5 = Number.parseInt(landParam[start + 4]);
          let param6 = Number.parseInt(landParam[start + 5]);
          let param7 = Number.parseInt(landParam[start + 6]);
          let param8 = landParam[start + 7];


          const tilePos = {x: param1, y: param2};
          // const texture_path = this.config.brushTiles[type].t;

          console.log("land tile@", tilePos, param6);
          const id = this.getNameFromBrushTiles(param8);
          const texture_t = this.config.brushTiles[id].t;
          const texture_k = this.config.brushTiles[id].k;
          const gLand = new Land(tilePos, texture_k, texture_t, this.config);
          gLand.level = param3;
          gLand.development_id = param4;
          gLand.relation_id = param5;
          gLand.path_id = param6;
          gLand.status = param7;
          this.storeNewData(gLand, this.lands);
          if (forEditor) {
            gLand.EditorDisplay(this.config);
          } else {
            gLand.InitGameDisplay(this.config);
          }
        }
      }
      /*
            if (playerParam != null) {
              let px = Number.parseInt(playerParam.shift());
              let py = Number.parseInt(playerParam.shift());
              this.player = {x: px, y: py};
            }*/
      this.update_export_data();
      this.reorderDepths();
      // store this so if player dies we can re-init to it
      console.log("load completed 📣");
      return true;
    } catch (e) {
      console.log("err load: ", e);
      return false;
    }
  }

  storeNewData(item: MapItem, list: Array<MapItem>) {
    list.push(item);
    item.appendFrom(this.zoo_keeper);
  }

  import_data_from_url_bar() {
    const url = location.search.slice(1);
    if (url !== undefined) {
      this.loadMapEditor(url);
    }
  }

  static isValidMapData(data: string): boolean {
    let mapParams = new URLSearchParams(data);
    return mapParams.get("m") != null && mapParams.get("l") != null && mapParams.get("g") != null;
  }

  static isValidMapSizeData(data: string): boolean {
    let mapParams = new URLSearchParams(data);
    return mapParams.get("map") != null;
  }

  /**
   *

   link += "&map=";
   link += this.config.tileX + "," +
   this.config.tileY + "," +
   this.config.tileSize + "," +
   this.config.tileScale + ",";
   * @param {string} data
   */
  //{ tileX: number, tileY: number, tileSize: number, tileScale: number }
  static extractMapSize(data: string, success: any): boolean {
    try {
      let mapParams = new URLSearchParams(data);
      let mapp = mapParams.get("map");
      if (mapp) {

        let mobParam = mapp.split(",");
        let _x = Number.parseInt(mobParam[0]);
        let _y = Number.parseInt(mobParam[1]);
        let _size = Number.parseInt(mobParam[2]);
        let _scale = Number.parseFloat(mobParam[3]);

        const temp_config = {
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
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }


  loadMapEditor(data) {
    // console.log("loadMapEditor start", data);
    // URLSearchParams isn't working on Safari, disable custom maps for now
    try {
      // if we have custom map params try and parse those
      // console.log ("loadMapEditor: ", mapParams);
      if (MapMaker.isValidMapData(data)) {
        let mapParams = new URLSearchParams(data);
        //   console.log ("load URLSearchParams: ", mapParams);
        this.getCustomLayout(mapParams, true);
      } else {
        console.log("incomplete params");
      }
    } catch (e) {
      // forget it jake, it's chinatown
      console.log("failed to load data", e);
    }
  }

  initLevel(n: number, map?: any): void {

  }
}

