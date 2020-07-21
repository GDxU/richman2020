import createPlanner from "l1-path-finder"
import {Container} from "pixi.js";
import Vue from "Vue"
import _ from "lodash"
import {TimelineLite, Linear} from "gsap"
import MapMaker, {GapPath, Helper, Land, Mob} from "./MapMaker";
import EventDescriptors from "./EventDescriptors";
import {
  PassStopEvent,
  RoadEventDescriptor,
  Config,
  FUNC_ID,
  FullStopEvent,
  Player,
  PlayHelper,
  PlayHistory,
  PlayStatus
} from "./Common";

export default class MapLogic extends MapMaker {
  dice_lock: boolean;
  playHistory: PlayHistory;
  status: PlayStatus;
  players: Array<Player>;
  event_play: EventDescriptors;

  constructor(a: any, b: Container, c: Container, d: Config, ctx: Vue) {
    super(a, b, c, d, ctx);
    this.dice_lock = true;
    this.playHistory = new PlayHistory();
    this.status = {
      player_id: -1,
      dice_result: [],
      history_id: -1,
      action: -1,
      current_event: {player: new Player(0, false), outstanding_events: []}
    };
    this.temp_player_pos_checker = {x: 0, y: 0};
    this.players = [];
  }

  private getTilePathByID(n: number): GapPath | boolean {
    let c = this.paths.findIndex((p: GapPath) => {
      return p.path_order === n;
    });
    if (c > -1) {
      return this.paths[c];
    }
    return false;
  }

  private getStartPos(cb): void {
    const result = this.getTilePathByID(0);
    //console.log(result);
    if (result) {
      if (result instanceof GapPath) {
        cb(Helper.getTileRealPosCentered(this.config, result.tilepos), result.tilepos)
      }
    }
  }

  /**
   * the callback of the function
   * @param {Land} land
   * @constructor
   */
  public LevelUp(land: Land): boolean {
    if (land.development_id > -1) {
      if (land.level < 7) {
        land.level++;
        if (land.level > 1) {
          try {
            this.removeSwapMob(land.tilepos);
          } catch (e) {
            console.log("during remove entity", e);
          } finally {
            const mob = new Mob(land.tilepos);
            mob.setupByLevel(land.level - 1, this.config);
            mob.build(this.entities, this.zoo_keeper);
            this.DepthRenderGamePlay();
            // this.reorderDepths();
          }
        }
        return true;
      } else {
        const r = "the level has reached to top";
        console.log(r);
        this.context.notificationError(r);
        return false;
      }
    } else {
      const r = "please set building style first";
      console.log(r);
      this.context.notificationError(r);
      return false;
    }
  }

  /**
   * generate the first player in the scene
   * @constructor
   */
  public InitPlayers(human: number, pc: number, cb: any): void {
    const that = this;
    const colorList = PlayHelper.GenerateColorMaps(human + pc);
    that.getStartPos((finalpos: { x: number, y: number }, tilePos: { x: number, y: number }) => {
      for (let a = 0; a < pc; a++) {
        const player = new Player(a + 400, this.context.$store);
        player
          .setup(true, "nko", 10000, 1, colorList[a])
          .Init(that.config, tilePos, Helper.calRandomizeInRealPosition(that.config, finalpos));
        that.status.player_id = player.player_id;
        player.appendFrom(this.zoo_keeper);
        that.players.push(player);
        that.BindPlayerEvents(player);
      }

      for (let a = 0; a < human; a++) {
        const player = new Player(a + 300, this.context.$store);
        player
          .setup(false, "oic", 10000, 1, colorList[pc + a])
          .Init(that.config, tilePos, Helper.calRandomizeInRealPosition(that.config, finalpos));
        that.status.player_id = player.player_id;
        player.appendFrom(that.zoo_keeper);
        that.players.push(player);
        that.BindPlayerEvents(player);
      }
      that.event_play = new EventDescriptors(this);
      that.DepthRenderGamePlay();
      if (cb !== undefined) {
        cb();
      }
    });
  }

  public DebugTrigger(): void {
    this.event_play.SpawnRoadEvents();
    return;
  }

  /**
   * draw the lucky number with amount of dice
   * @constructor
   */
  public Dice(): void {
    const player = PlayHelper.GetCurrentPlayer(this.players, this.status.player_id);
    if (this.dice_lock) {
      this.context.notificationError("currently cannot play the dice");
      return
    }
    const that = this;
    this.dice_lock = true;
    that.context.$emit("start_dice", {});
    player.PlayDice(this.playHistory, function (sum, id) {
      console.log("dice result in total: ", sum);
      that.context.$emit("dice_result", {
        total_steps: sum,
        auto: player.isAuto
      });
      const ok = Helper.getPartOf(that.paths, player.tilePos);
      if (ok instanceof GapPath) {
        that.eventMoves(sum, ok, player, id);
      }
    });
  }

  private DiceAuto(actor: Player): void {
    const that = this;
    // that.context.$emit("start_dice", {});
    actor.PlayDice(this.playHistory, function (sum, id) {
      console.log("dice result in total: ", sum);
      that.context.$emit("dice_result", {
        total_steps: sum,
        auto: actor.isAuto
      });
      const ok = Helper.getPartOf(that.paths, actor.tilePos);
      if (ok instanceof GapPath) {
        that.eventMoves(sum, ok, actor, id);
      }
    });
  }

  /**
   *
   * @param {number} totalmoves
   * @param {GapPath} roadtile
   * @param {Player} player
   * @param {number} id data insert for data ID
   */
  private eventMoves(totalmoves: number, roadtile: GapPath, player: Player, id: number): void {
    const that = this;
    const tween = new TimelineLite();
    let steps = Helper.getFutureTilesArray(totalmoves, roadtile.path_order, that.paths);
    let end_step_func: Array<Land> = [];
    let immediate_func = -1;
    let immediate_step;
    let outstanding_steps = -1;
    let previous = Helper.calRandomizeInRealCenterPosition(that.config, Helper.getTileRealPosCentered(that.config, player.tilePos));
    that.status.history_id = id;

    if (steps.length > 0) {
      let listDir = Helper.GenerateRoutePlayerDir(player.tilePos, steps);
      player.SetFace(listDir[0]);

      _.each(steps, function (step, stepIndex) {
        outstanding_steps = steps.length - stepIndex;
        // console.log("step count", stepIndex, outstanding_steps, step);

        /**
         * create tween animation based on its tile position
         *
         */
        const p = Helper.getTileRealPosCentered(that.config, step.tilepos);
        const rn = Helper.calRandomizeInRealCenterPosition(that.config, p);
        const dist = Helper.getDistance(rn, previous);
        previous = rn;

        const t = dist * player.walking_speed / 10;
        const tween_config = Object.assign(rn, {ease: Linear.easeNone});
        // console.log("predict loc: ", rn);
        tween.to(player.getDisplayItem(), t, tween_config);

        if (step.pass_fun > 0) {
          /**
           * stop in the middle of the path and run some events
           * @type {number}
           */
          immediate_func = step.pass_fun;
          immediate_step = step;
          return false;
        }

        if (outstanding_steps === 1) {
          tween.call(EventsCore.MiddleTileEvent, [true, player, listDir[stepIndex + 1]]);
        } else {
          tween.call(EventsCore.MiddleTileEvent, [false, player, listDir[stepIndex + 1]]);
        }
      });
      /**
       * if there is no immediate happened then we supposed add final events
       */
      if (immediate_func === -1) {
        let last_step = steps[steps.length - 1];
        // console.log("get all steps", steps);
        // console.log("get last step", last_step);
        end_step_func = Helper.scanEventOnLands(that.lands, last_step.path_order);

        if (outstanding_steps === -1) {
          /**
           * that meanings all the steps are completed
           * @type {number}
           */
          outstanding_steps = 0;
        }

        tween.eventCallback("onComplete", EventsCore.EndStepsEvent, [player, end_step_func, last_step, id]);
      } else {
        const card = this.event_play.GetEventCard(immediate_func);
        console.log("gen", card);
        tween.eventCallback("onComplete", EventsCore.ImmediateEvent, [player, immediate_func, outstanding_steps, immediate_step, card]);
      }
      tween.eventCallback("onUpdate", EventsCore.UpdatePlayerDepth, [that, player])

    }
  }

  private DepthRenderGamePlay(): void {
    this.allItemsDescriptor = [];
    const that = this;
    const paths = that.paths;
    const entities = that.entities;
    const lands = that.lands;
    const players = that.players;
    const total = entities.length + players.length;
    const basics = paths.length + lands.length;
    // let path_count = 0, entity_count = 0, land_count = 0;

    entities.forEach(function (obj, i) {
      that.allItemsDescriptor.push({type: obj, depth: obj.depth, index: i});
    });

    players.forEach(function (obj, i) {
      that.allItemsDescriptor.push({type: obj, depth: obj.deep, index: i});
    });

    that.allItemsDescriptor.sort((a, b) => (a.depth > b.depth) ? 1 : -1);

    for (let i = 0; i < total; i++) {
      let type_instance = that.allItemsDescriptor[i].type;
      let order_index = that.allItemsDescriptor[i].index;

      if (type_instance instanceof Mob) {
        that.zoo_keeper.setChildIndex(entities[order_index].getDisplayItem(), i + basics);
      }
      if (type_instance instanceof Player) {
        that.zoo_keeper.setChildIndex(players[order_index].getDisplayItem(), i + basics);
      }
    }
  }

  /**
   * check the movement positions of the players
   */
  temp_player_pos_checker: { x: number, y: number };

  public UpdateDepthCheck(pos: { x: number, y: number }): boolean {
    if (pos.x === this.temp_player_pos_checker.x && pos.y === this.temp_player_pos_checker.y) {
      return false;
    } else {
      this.temp_player_pos_checker = pos;
      return true;
    }
  }

  public LoadMap(data: string, cb: any): void {
    if (MapMaker.isValidMapData(data)) {
      let mapParams = new URLSearchParams(data);
      let result = this.getCustomLayout(mapParams, false);
      if (result) {
        this.context.notificationSuccess("Loaded map");
        cb();
      } else {
        this.context.notificationError("Failed to load the map");
      }
    }
  }

  /**
   * the start of the game
   * @param {number} human
   * @param {number} pc
   * @constructor
   */
  public InitGame(human: number, pc: number, map_stored_data: string): void {
    const that = this;
    new Promise((resolve, reject) => {
      that.LoadMap(map_stored_data, resolve);
    }).then(() => {
      that.context.notificationSuccess("Load Players");
    }).then(() => {
      that.InitPlayers(human, pc, () => {
        that.context.notificationSuccess("Now starts");
        that.dice_lock = false;
      });
      that.event_play.SpawnRoadEvents();
    }).catch(function (e) {
      console.log("there is an error.", e)
    });

  }

  /**
   * internal events handlers
   * @constructor
   */

  private OnNextPlayerTurn(): void {
    const next_player_index = PlayHelper.GetNextLoopPlayerId(this.players, this.status.player_id);
    const actor = this.players[next_player_index];
    this.status.player_id = actor.player_id;

    if (actor.IsFrozen()) {
      const remain = actor.reduceFrozen() + 1;
      const msg = `${actor.fullname} is now remain ${remain} days in the hospital`;
      //const player = PlayHelper.GetCurrentPlayer(this.players, this.status.player_id);
      //  actor.emitter.emit("cam_focus", actor.tilePos);
      this.CameraFocus(actor, 2000);
      this.context.notificationInfo(msg);
      setTimeout(() => {
        this.OnNextPlayerTurn();
      }, 2000);
    } else {
      console.log("now actor ID ", this.status.player_id);
      this.CameraFocusDefault(actor);
      if (actor.player_status === 0) {
        this.PlayerOps(actor);
      } else {
        //there were somthing wrong with this actor and please make it return to normal first.
        this.ProceedStatusToNormal(actor, (actor: Player, t: { x: number, y: number }) => {
          actor.tilePos = t;
          actor.changeStatus(0);
          this.PlayerOps(actor);
        })
      }
    }
  }

  /**
   * player
   * @param {Player} actor
   * @constructor
   */
  private CameraFocus(actor: Player, ms: number): void {
    let h = Object.assign(Helper.getTilePosCameraCentered(this.config, actor.tilePos), {time: ms});
    this.context.$emit("cam_focus", h);
  }

  private CameraFocusDefault(actor: Player): void {
    this.CameraFocus(actor, 1000);
  }

  /**
   * player is now up
   * @param {Player} actor
   * @param callbacks
   * @constructor
   */
  private ProceedStatusToNormal(actor: Player, callbacks): void {
    const status = actor.player_status;
    if (status === 1) {
      const from_hospital = Helper.findHospital(this.entities);
      EventsCore.AutoReturnFromMobLocation(this.config, actor, this.entities, this.paths, from_hospital, callbacks);
    } else if (status === 2) {
      const from_hospital = Helper.findHospital(this.entities);
      EventsCore.AutoReturnFromMobLocation(this.config, actor, this.entities, this.paths, from_hospital, callbacks);
    } else {
      console.error(`cannot proceed animation from this status ${status}`)
    }
  }

  private PlayerOps(actor: Player): void {
    setTimeout(() => {
      this.CameraFocusDefault(actor);
      if (actor.isAuto) {
        console.log("AI turn now..");
        this.DiceAuto(actor);
      } else {
        console.log("Its now Actor turn");
        this.context.$emit("player_turn", {
          player: actor,
          system: this.status,
        });
        this.dice_lock = false;
      }
    }, 2000);
  }

  public OnNextEvent(): void {
    let ____msg = "";
    let _data: FullStopEvent = this.status.current_event;
    let defer_next = false;
    if (_data.outstanding_events.length === 0) {
      console.log("done turn for player => ", _data.player.player_id);
      this.OnNextPlayerTurn();
      return;
    }
    const evtCode = _.head(_data.outstanding_events);
    //   _data.outstanding_events = _.pullAt(_data.outstanding_events, [1, 3]);
    if (_data.player.isAuto) {
      if (AIPackage.stopEvent(evtCode, _data.player, _data, this.players)) {
        defer_next = true;
      }
    } else {
      //   console.log("event done::", evtCode);
      if (evtCode === FUNC_ID.PROPERTY && _data.land) {
        //properties related events
        console.log("land done::", _data.land);
        if (_data.land.owner === _data.player.player_id || _data.land.owner === -1) {
          this.context.$emit("stop_event", _data);
          console.log("land done:: popup");
        } else {

          const rent_mark = _data.land.rent_schedule[_data.land.level];

          if (rent_mark > 0) {
            if (_data.player.finance.cash > rent_mark) {
              let owner = PlayHelper.GetCurrentPlayer(this.players, _data.land.owner);
              owner.finance.EarnCash(rent_mark);
              _data.player.finance.ReduceCash(rent_mark);
              this.context.$emit("transfer_cash");
              ____msg = `${_data.player.fullname} paid rent to ${owner.fullname}!`;
              _data.player.emitter.emit("message", ____msg);
            } else {
              ____msg = `${_data.player.fullname} is now low on wallet money !`;
              _data.player.emitter.emit("message", ____msg);
              //not too soon..
            }
          }
          console.log("rent related.");
          defer_next = true;
        }
      } else if (evtCode > 0) {
        //other stop events
        this.context.$emit("stop_event", _data);
        console.log("event more:", evtCode);
      } else {
        defer_next = true;
        console.log("dead end");
      }
    }
    this.status.current_event.outstanding_events = _.drop(_data.outstanding_events);
    if (defer_next) {
      this.OnNextEvent();
    }
  }

  /**
   *
   * @param data
   * @constructor
   */
  private OnPassEvent(data: PassStopEvent): void {
    console.log("received pass event");
    this.context.$emit("pass_event", data);
  }

  public OnPassReturn(data: PassStopEvent): void {
    console.log("reached pass event");
    const can_move_next = this.event_play.TakeEffective(data);
    const wait = 1300;
    setTimeout(() => {
      if (data.nextSum > 0) {
        if (can_move_next === 1) {
          this.eventMoves(data.nextSum, data.pathGap, data.player, this.status.history_id);
        } else if (can_move_next === 0) {
          this.TriggerStopEvent(data.pathGap, data.player);
        } else {
          this.OnNextPlayerTurn();
        }
      } else {
        this.TriggerStopEvent(data.pathGap, data.player);
      }
    }, wait);
  }

  private TriggerStopEvent(gap: GapPath, actor: Player): void {

    const LandList = Helper.scanEventOnLands(this.lands, gap.path_order);

    let list: Array<number> = _.map(LandList, (j: Land) => {
      return j.development_id;
    });

    if (list.length > 0) {

      const eventd: FullStopEvent = {
        outstanding_events: list,
        player: actor,
        land: LandList[0],
        pathTile: gap,
        focusTile: gap.tilepos,
      };

      actor.emitter.emit("stopEvent", eventd)
    } else {
      actor.emitter.emit("message", `There is no actions for ${actor.fullname}`);
      actor.emitter.emit("next")
    }
  }

  /**
   * triggered once after movings
   * @param {FullStopEvent} data
   * @constructor
   */
  private OnStopEvent(data: FullStopEvent): void {
    this.status.current_event = data;
    //console.log("what is now end dice end event:: ", this.status.current_event.outstanding_events);
    this.OnNextEvent();
    this.DepthRenderGamePlay();
  }

  private OnDialogNotice(data): void {
    this.context.notificationInfo(data.msg);
    this.OnNextPlayerTurn();
    //this.context.$emit("screen_notice", data);
  }

  private OnMessageFromPlayerEvent(message: string): void {
    this.context.notificationInfo(message);
  }

  /**
   * its triggered from the stop event
   * @param {GapPath} loc
   * @constructor
   */
  private OnItemCollected(loc: GapPath, item_code: number): void {
    if (this.event_play.TakeItem(loc)) {
      const player = PlayHelper.GetCurrentPlayer(this.players, this.status.player_id);
      player.CollectItem(item_code);
      console.log(player);
    }
  }

  private BindPlayerEvents(actor: Player): void {
    actor.addEvent("next", this.OnNextPlayerTurn.bind(this));
    actor.addEvent("stopEvent", this.OnStopEvent.bind(this));
    actor.addEvent("dialogNotice", this.OnDialogNotice.bind(this));
    actor.addEvent("message", this.OnMessageFromPlayerEvent.bind(this));
    actor.addEvent("collected_item", this.OnItemCollected.bind(this));
    actor.addEvent("levelup", this.LevelUp.bind(this));
    actor.addEvent("passEvent", this.OnPassEvent.bind(this));
  }

}

export class EventsCore {

  /**
   * when the animation of walking is finally finished and this event will be triggered.
   * @param {Array<number>} end_functions
   * @param {GapPath} last_step
   * @param {number} history_r_id
   * @constructor
   */
  static EndStepsEvent(actor: Player, end_functions: Array<Land>, last_step: GapPath, history_r_id: number): void {
    actor.tilePos = last_step.tilepos;
    const list: Array<number> = [];
    actor.FaceFront();
    if (last_step.stop_fun > 0) {
      list.push(last_step.stop_fun)
    }
    if (end_functions.length > 0) {
      for (let p = 0; p < end_functions.length; p++) {
        list.push(end_functions[p].development_id)
      }
    }

    if (list.length > 0) {

      const evtp: FullStopEvent = {
        outstanding_events: list,
        player: actor,
        land: end_functions[0],
        pathTile: last_step,
        focusTile: last_step.tilepos,
      };
      //stop events
      actor.emitter.emit("stopEvent", evtp);
    } else {
      //end turns
      actor.emitter.emit("message", `There is no actions for ${actor.fullname}`);
      actor.emitter.emit("next")
    }

  }

  /**
   *
   * @param {Player} actor
   * @param {number} immediate_func
   * @param {number} steps_outstanding
   * @param {number} history_r_id
   * @constructor
   */
  static ImmediateEvent(actor: Player, immediate_func: number, steps_outstanding: number, path: GapPath, carditem: RoadEventDescriptor): void {
    const o: PassStopEvent = {
      event: immediate_func,
      player: actor,
      pathGap: path,
      nextSum: steps_outstanding,
      card: carditem,
    };
    actor.emitter.emit("passEvent", o);
  }

  static MiddleTileEvent(final_step: boolean, player: Player, dir: number): void {
    //  console.log("step middle:", final_step, dir, player);
    player.SetFace(dir);
  }

  /**
   * update player is now on depth
   * @param {Player} pl
   * @constructor
   */
  static UpdatePlayerDepth(p: MapLogic, pl: Player): void {
    const tp = Helper.getTilePos(p.config, pl.getDisplayItem().position);
    if (p.UpdateDepthCheck(tp)) {
    }
    const st = Helper.calAdjustCharCameraCenter(p.config, pl.getDisplayItem().position);
    p.context.$emit("focus_moving", st);
  }

  static AutoReturnFromMobLocation(_c: Config, player: Player, entities: Array<Mob>, paths: Array<GapPath>, target: Mob, callback_event: any): void {
    const tween = new TimelineLite();

    let {distance, collection} = Helper.findClosestPointFromPathRoutes(target.tilepos, paths);
    let dest = collection[0].tilepos;

    let actual_rpg_1 = Helper.getTileRealPosCentered(_c, {x: dest.x, y: dest.y});
    const rn = Helper.adjustRealCentered(_c, actual_rpg_1);

    tween.to(player.getDisplayItem(), 1, {alpha: 1, ease: Linear.easeNone});
    tween.to(player.getDisplayItem(), distance * player.walking_speed, {
      x: rn.x, y: rn.y, ease: Linear.easeNone
    });

    tween.eventCallback("onComplete", callback_event, [player, dest]);
  }


  static AutoMoveToMobLocation(_c: Config, player: Player, entities: Array<Mob>, paths: Array<GapPath>, target: Mob, callback_event: any): void {
    //const text = this.res.ambulance;
    const lp_map = Helper.generateNArrayPathMap(_c, paths);
    const planner = createPlanner(lp_map);
    //Find path
    let raw_path = [];
    const tween = new TimelineLite();
    if (target instanceof Mob) {
      let {distance, collection} = Helper.findClosestPointFromPathRoutes(target.tilepos, paths);
      let dest = collection[0].tilepos;
      planner.search(player.tilePos.x, player.tilePos.y, dest.x, dest.y, raw_path);
      if (raw_path.length === 0) {
        console.log("solutions not found", lp_map);
        return
      }
      const speed = 0.3;
      let params_len = 2;
      let mobSets = raw_path.length / params_len;
      let tilePos = {x: raw_path[0], y: raw_path[1]};

      console.log("path findings:", player, collection, raw_path);

      for (let f: number = 0; f < mobSets; f++) {
        let start = f * params_len;
        let param_x = raw_path[start];
        let param_y = raw_path[start + 1];

        let length_x = Math.abs(param_x - tilePos.x);
        let length_y = Math.abs(param_y - tilePos.y);

        let total_len = length_x + length_y;

        let actual_rpg_1 = Helper.getTileRealPosCentered(_c, {x: param_x, y: param_y});
        const rn = Helper.adjustRealCentered(_c, actual_rpg_1);
        let tween_config = {x: rn.x, y: rn.y, ease: Linear.easeNone};
        // console.log("generated positions:", tween_config);
        tween.to(player.getDisplayItem(), total_len * speed, tween_config);
      }

      let rn_hospital = Helper.getTileRealPosCentered(_c, target.tilepos);
      //const rn_hospital = Helper.adjustRealCentered(_c, actual_rpg_1);
      // final path from the location to the hospital
      tween.to(player.getDisplayItem(), distance * speed, {
        x: rn_hospital.x, y: rn_hospital.y, ease: Linear.easeNone
      });
      tween.to(player.getDisplayItem(), 3, {alpha: 0, ease: Linear.easeNone});
      tween.eventCallback("onComplete", callback_event, [player, target.tilepos]);
    }
  }

}

export class AIPackage {
  /*static nextEvent(_data: FullStopEvent, player_list: Array<Player>): void {

    if (_data.outstanding_events.length === 0) {
      _data.player.emitter.emit("next");
      return;
    }

    const evtCode = _.head(_data.outstanding_events);
    AIPackage.stopEvent(evtCode, _data.player, _data, player_list);
  }*/

  static stopEvent(event_code: number, ai: Player, data: FullStopEvent, player_list: Array<Player>): boolean {
    let ____msg = "";
    let cash_50_enough = ai.finance.isCash50Enough();
    let cash_10_enough = ai.finance.isCash10Enough();

    if (!cash_10_enough) {
      const ____msg = `${ai.fullname} doesn't have enough money now and he decided to move forward!`;
      ai.emitter.emit("message", ____msg);
      //AIPackage.nextEvent(data, player_list);
      ai.emitter.emit("next");
      return false;
    }

    //action
    if (event_code === FUNC_ID.PROPERTY) {

      if (!cash_50_enough) {
        ____msg = `${ai.fullname} is now low on wallet!`;
        ai.emitter.emit("message", ____msg);
      }

      if (data.land && data.hasOwnProperty("land")) {
        const price_mark = data.land.price_schedule[data.land.level];
        const rent_mark = data.land.rent_schedule[data.land.level];
        const pre_owned = data.land.owner === ai.player_id || data.land.owner === -1;
        if (pre_owned) {

          const level = data.land.level;
          if (price_mark < ai.finance.cash) {

            ai.finance.ReduceCash(price_mark);
            if (data.land.owner === -1) {
              data.land.Acquire(ai);
            }

            if (level === 0) {
              ____msg = `${ai.fullname} spent ${price_mark} on the land acquisition!`;
            } else if (level === 1) {
              ____msg = `${ai.fullname} spent ${price_mark} on the development of land!`;
            } else {
              ____msg = `${ai.fullname} spent ${price_mark} on the upgrading the building!`;
            }
            ai.emitter.emit("message", ____msg);
            ai.emitter.emit("levelup", data.land);
          } else {
            if (data.land.owner === -1) {
              ____msg = `${ai.fullname} doesn't have enough money to acquire this land!`;
            } else if (data.land.owner === data.player.player_id) {
              ____msg = `${ai.fullname} doesn't have enough money to upgrade the building!`;
            } else {
              ____msg = `${ai.fullname} now its done.`;
            }
            ai.emitter.emit("message", ____msg);
          }
          ai.emitter.emit("next");
          //  AIPackage.nextEvent(data, player_list);
        } else {
          //does not own this place
          if (rent_mark > 0) {
            if (ai.finance.cash > rent_mark) {
              let owner = PlayHelper.GetCurrentPlayer(player_list, data.land.owner);
              //paid rent
              owner.finance.EarnCash(rent_mark);
              //reduce wallet money
              ai.finance.ReduceCash(rent_mark);
              //-------------------------------------
              ____msg = `${ai.fullname} paid ${rent_mark} rent to ${owner.fullname}!`;
              ai.emitter.emit("message", ____msg);
            } else {
              ____msg = `${ai.fullname} is now low on wallet and cannot afford the high rent`;
              ai.emitter.emit("message", ____msg);
              //not too soon..
            }
          } else {
            ____msg = `${ai.fullname} has nothing to do!`;
            ai.emitter.emit("message", ____msg);

          }
          ai.emitter.emit("next");
          //          AIPackage.nextEvent(data, player_list);
        }
        //-------------------------------------
      } else {
        console.log("unexpected error");
      }
      return false;
    } else if (event_code > 10000) {
      //card collection event
      //the event_code = item_code
      ____msg = `${ai.fullname} has picked up a card!`;
      ai.emitter.emit("message", ____msg);
      ai.emitter.emit("collected_item", data.pathTile, event_code);
      return true;
    } else {
      //      AIPackage.nextEvent(data, player_list, map);
      return true;
    }
  }
}
