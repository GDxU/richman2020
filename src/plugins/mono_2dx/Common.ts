import {GapPath, Helper, Land} from "./MapMaker";
import {Container, DisplayObject, Sprite, Texture, utils} from "pixi.js";
import {DigitalWallet} from "./BlockchainCash";
import Animation, {FullSheetAnimation} from "./Animation";

export interface RoadEventDescriptor {
  name: string;
  code: number;
  luck: number;
  description: string;
}

/**
 * #LEVEL 1-5 -> PROPERTY
 *
 * ID > 100 - special function
 * @type {number}
 */
export enum FUNC_ID {
  PROPERTY = 0,
  BANK = 100,
  SHOP = 101,
  CASINO = 102,
  DRAWCARD = 103,
}


export declare interface Config {
  tileSize: number,
  tileScale: number,
  tileOffset: number,
  arenaSizeX: number,
  arenaSizeY: number,
  tileX: number,
  tileY: number,
  brushTiles: Array<any>,
  animationChars: Array<any>,
  items: Array<any>,
}

export declare interface TileAssetData {
  //full name
  name: String,
  //short name
  k: String,
  //texture resource
  t: Texture,
  //custom height focal
  h?: number,
}

export declare interface DepthItem {
  type: Object,
  depth: number,
  //array index from that item
  index: number,
}

export interface PassStopEvent {
  event: number;
  nextSum: number;
  player: Player;
  pathGap: GapPath;
  card: RoadEventDescriptor;
}

export interface FullStopEvent {
  /**
   * as the development id / the type of land or the path
   */
  outstanding_events: Array<number>;
  /**
   * instance of the player
   */
  player: Player;
  /**
   * the land object
   */
  land?: Land;
  pathTile?: GapPath;
  focusTile?: { x: number, y: number };
}

interface PlayerData {
  action?: number,
  player_id: number,
  dice_count: number,
  tilePos: { x: number, y: number }
  finance: DigitalWallet;
  colorRotation: number;
  player_status: number;
  /**
   * walking speed in second
   */
  walking_speed: number;

  appendFrom(container: Container): void;

  updateDepth(container: Container): void;
}

export interface PlayStatus {
  action?: number,
  player_id: number,
  history_id: number,
  dice_result?: Array<number>,
  current_event: FullStopEvent,
}

export interface History {
  id: number,
  action: number,
  player_id: number,
  dice_result: Array<number>,
}

export declare interface MapRenderPixiBasic {
  sprite: Sprite;
  depth: number;
  tilepos: { x: number, y: number };

  removeFrom(parent: Container): void

  appendFrom(parent: Container): void

  getDisplayItem(parent: Container): DisplayObject

  isMatchTile(x: number, y: number): boolean

  EditorDisplay(d: Config): void

  InitGameDisplay(d: Config): void
}

export class PlayHelper {
  static RandomGenerate(dice_count: number): Array<number> {
    let playedDice = 0, dice_results: Array<number> = [];
    while (playedDice < dice_count) {
      let m = Math.ceil(Math.random() * 6);
      dice_results.push(m);
      playedDice++;
    }
    return dice_results
  }

  static DiceSum(list: Array<number>): number {
    return list.reduce((a, b) => a + b, 0)
  }

  static GetCurrentLoopAt(list: Array<Player>, player_id: number): number {
    return list.findIndex(function (ply: Player, i: number) {
      return ply.player_id === player_id;
    })
  }

  static GetCurrentPlayer(list: Array<Player>, player_id: number): Player {
    const index = list.findIndex(function (ply: Player, i: number) {
      return ply.player_id === player_id;
    });
    return list[index]
  }

  static GetNextLoopPlayerId(list: Array<Player>, player_id: number): number {
    let k = list.findIndex(function (ply: Player, i: number) {
      return ply.player_id === player_id;
    });

    return (k + 1) % list.length;
  }

  static GenerateColorMaps(total_players: number): Array<number> {
    let ch_num: Array<number> = [];
    let k = 360 / total_players;
    let start = Math.random() * 360;
    for (let u = 0; u < total_players; u++) {
      let f = start + k * u;
      ch_num.push(f);
    }
    return ch_num;
  }
}

export class Player implements PlayerData {
  action?: number;
  player_id: number;
  dice_count: number;
  /**
   * player_status:
   * 0: normal can walk
   * 2: sick in hospital
   * 3: jailed
   * 4: on the car
   * 5: on the plane
   * 6: on the candle
   */
  player_status: number;
  tilePos: { x: number, y: number };
  finance: DigitalWallet;
  walking_speed: number;
  colorRotation: number;
  emitter: utils.EventEmitter;
  sprite: Sprite;
  nowplay: Animation;
  playerContainer: Container;
  items: Array<number>;

  /**
   * not allow the player to make dice play for how many turns?
   * 0 = disabled
   * [1- infinite]
   *
   */
  frozen_play_turns: number;
  /**
   * is this player controlled by the computer
   */
  isAuto: boolean;
  /**
   * the depth of the player
   */
  deep: number;
  /**
   * the short name for this avatar
   */
  shortname: string;
  fullname: string;
  /**
   * redux store item
   */
  store: any;


  constructor(id: number, _store: any) {
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

  public setup(isPc: boolean, sprite_short_name: string, total_cash: number, dice: number, color_hue: number): Player {
    this.isAuto = isPc;
    this.finance.SetCashStart(total_cash);
    this.dice_count = dice;
    this.shortname = sprite_short_name;
    this.fullname = `BigSan ${sprite_short_name}`;
    this.colorRotation = color_hue;
//    console.log("player init in here:", sprite_short_name);
    return this;
  }

  public appendFrom(container: Container): void {
    this.deep = Helper.calActorDepth(this.tilePos, this.playerContainer.position.y);
    container.addChild(this.playerContainer);
  }

  public Init(d: Config, tilePos: { x: number, y: number }, actualPos: { x: number, y: number }) {
    this.sprite = new Sprite(d.brushTiles[0].t);
    this.tilePos = tilePos;
    this.nowplay = new Animation(d, this.shortname, this.playerContainer);
    // console.log(this.nowplay);
    // this.playerContainer.addChild(this.sprite);
    this.playerContainer.position.set(actualPos.x, actualPos.y);
    console.log("add playerContainer");
  }

  public CollectItem(code: number): void {
    this.items.push(code);
  }

  public FaceFront(): void {
    this.nowplay.setDir(3);
  }

  public SetFace(dir: number): void {
    this.nowplay.setDir(dir);
  }

  public addEvent(name: string, func): void {
    console.log("add emitter event");
    this.emitter.on(name, func)
  }

  public updateDepth(container: Container): void {
    //container.setChildIndex(this.sprite, Helper.calActorDepth(this.tilePos));
  }

  /**
   * triggered from the map logic for the dice button event
   * @param {PlayHistory} store
   * @param cb
   * @constructor
   */
  public PlayDice(store: PlayHistory, cb): void {
    const result = PlayHelper.RandomGenerate(this.dice_count);
    const rowID = store.RecordHistory(result, this.player_id);

    /**
     * wait for animations for the dice results
     */
    //console.log(store);
    cb(PlayHelper.DiceSum(result), rowID)
  }

  public getDisplayItem(): Container {
    return this.playerContainer
  }

  /**
   * set frozen turns
   * @returns {number}
   */
  public startFrozen(n: number): void {
    this.frozen_play_turns = n;
  }

  public changeStatus(n: number): void {
    this.player_status = n;
  }

  public IsFrozen(): boolean {
    return this.frozen_play_turns > 0;
  }


  /**
   * the remain turns to be frozen
   * @returns {number}
   */
  public reduceFrozen(): number {
    if (this.frozen_play_turns > 0) {
      this.frozen_play_turns--;
    }


    return this.frozen_play_turns
  }

}

export class PlayHistory {
  history: Array<History>;
  now_id: number;

  constructor() {
    this.history = [];
    this.now_id = 0;
  }

  clear() {
    this.history = [];
  }

  RecordHistory(dice_result: Array<number>, player_id): number {
    const record_id = this.now_id;

    const new_history: History = {
      id: record_id,
      action: 0,
      player_id: player_id,
      dice_result: dice_result,
    };

    this.now_id++;
    this.history.push(new_history);
    return record_id;
  }
}

export class MapItem implements MapRenderPixiBasic {
  sprite: Sprite;
  depth: number;
  tilepos: { x: number, y: number };

  constructor(depth: number, tile: { x: number, y: number }) {
    this.depth = depth;
    this.tilepos = tile;
  }

  InitGameDisplay(d: Config): void {

  }

  setSprite(sp: Sprite): void {
    this.sprite = sp;
  }

  EditorDisplay(d: Config): void {
  }

  removeFrom(parent: Container): void {
    parent.removeChild(this.sprite)
  }

  appendFrom(__parent: Container): void {
    console.log(parent, this.sprite);
    __parent.addChild(this.sprite);
  }

  getDisplayItem(): DisplayObject {
    return this.sprite;
  }

  isMatchTile(x: number, y: number): boolean {
    return this.tilepos.x === x && this.tilepos.y === y;
  }
}

export class PathItem implements MapRenderPixiBasic {
  sprite: PIXI.Sprite;
  func_id: number;
  tilepos: { x: number; y: number };
  depth: number;
  context: Config;

  constructor(d: Config) {
    this.context = d;
  }

  EditorDisplay(d: Config): void {
  }

  InitGameDisplay(d: Config): void {
  }

  InitRoadBlock(path: GapPath): void {
    const texture_context = this.context.items[0].t;
    this.sprite = new Sprite(texture_context);
    this.tilepos = path.tilepos;
    if (this.sprite instanceof Sprite) {
      this.sprite.anchor.set(0.5);
      this.sprite.scale.set(0.6, 0.6);
    }
    this.depth = Helper.calNormalTileDepth(this.tilepos);
  }

  InitCard(path: GapPath): void {
    const texture_contexts = this.context.items[1].t;
    let ani = new FullSheetAnimation(texture_contexts);
    this.tilepos = path.tilepos;
    if (ani.animations instanceof PIXI.AnimatedSprite) {
      ani.animations.anchor.set(0.5);
      ani.animations.scale.set(0.1, 0.1);
    }
    ani.setSpeedFast();
    this.sprite = ani.animations;
    this.depth = Helper.calNormalTileDepth(this.tilepos);
  }

  attachToPlayer(p: Player): void {
    p.getDisplayItem().addChild(this.sprite)
  }

  detachFromPlayer(p: Player): void {
    p.getDisplayItem().removeChild(this.sprite);
  }

  appendFrom(container: Container): void {
    container.addChild(this.getDisplayItem());
    const {x, y} = Helper.getTilePosCameraCentered(this.context, this.tilepos);
    this.getDisplayItem().position.set(x, y);
  }

  removeFrom(container: PIXI.Container): void {
    container.removeChild(this.getDisplayItem());
  }

  getDisplayItem(): DisplayObject {
    return this.sprite;
  }

  isMatchTile(x: number, y: number): boolean {
    return this.tilepos.x === x && this.tilepos.y === y;
  }
}
