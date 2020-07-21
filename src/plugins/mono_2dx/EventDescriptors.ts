import _ from "lodash";
import MapLogic, {EventsCore} from "./MapLogic";
import {GapPath, Helper} from "./MapMaker";
import {PlayHelper, RoadEventDescriptor, PassStopEvent, PathItem, Player} from "./Common";
import {OnRoadEvents} from "./DataSample";
/*
export class Board extends MapLogic {
  constructor(a: any, b: Container, c: Container, d: Config, context: Vue) {
    super(a, b, c, d, context);
  }
}*/

export default class EventDescriptors {
  _logic: MapLogic;
  _roadItems: Array<PathItem> = [];

  constructor(logic: MapLogic) {
    this._logic = logic;
  }

  private FindEventIndex(code: number): number {
    return _.findIndex(OnRoadEvents, (k: RoadEventDescriptor) => {
      return k.code === code
    });
  }

  /*

    private GetRandomEvent(): RoadEventDescriptor {
      const k = Math.random() * OnRoadEvents.length;
      return OnRoadEvents[Math.floor(k)];
    }
  */

  public GetEventCard(j: number): RoadEventDescriptor {
    const k = this.FindEventIndex(j);
    return OnRoadEvents[k];
  }

  public HasEvent(code: number): boolean {
    return this.FindEventIndex(code) > -1;
  }

  private getLocationForRoadEvent(): GapPath {
    const road = this._logic.paths;
    const random_rd: Array<GapPath> = _.filter(road, (g: GapPath) => {
      const e = g.path_order !== 0 && g.pass_fun === 0 && g.stop_fun === 0;
      if (e) {
        return true;
      } else {
        return false;
      }
    });
    const k = Math.random() * random_rd.length;
    const path_decided = random_rd[Math.floor(k)];
    return path_decided;
  }

  public SpawnRoadEvents(): void {
    //  const t = this.GetRandomEvent();
    //  Cards
    this._roadItems = [];
    for (let o = 0; o < 3; o++) {
      const ec = new PathItem(this._logic.config);
      ec.InitRoadBlock(this.getLocationForRoadEvent().SpawnPassEvent(1013));
      ec.appendFrom(this._logic.zoo_keeper);
      this._roadItems.push(ec);
    }
    for (let p = 0; p < 7; p++) {
      const card = new PathItem(this._logic.config);
      card.InitCard(this.getLocationForRoadEvent().SpawnEndEvent(11012));
      card.appendFrom(this._logic.zoo_keeper);
      this._roadItems.push(card);
    }
  }

  public EventJailTime(): void {
    this._logic.dice_lock = true;
    const player = PlayHelper.GetCurrentPlayer(this._logic.players, this._logic.status.player_id);
    const target_mob = Helper.findJail(this._logic.entities);
    if (target_mob === undefined) {
      console.error("the jail is not found.")
    } else {
      EventsCore.AutoMoveToMobLocation(this._logic.config, player, this._logic.entities, this._logic.paths, target_mob, EventDescriptors.ToJail)
    }
  }

  public EventAmbulance(): void {
    this._logic.dice_lock = true;
    const player = PlayHelper.GetCurrentPlayer(this._logic.players, this._logic.status.player_id);
    const target_mob = Helper.findHospital(this._logic.entities);
    if (target_mob === undefined) {
      console.error("the hospital is not found.")
    } else {
      EventsCore.AutoMoveToMobLocation(this._logic.config, player, this._logic.entities, this._logic.paths, target_mob, EventDescriptors.ToHospital)
    }
  }

  public EncounterRoadEvent(code: number): void {
    const has = this.HasEvent(code);
    if (!has) {
      return;
    }
    switch (code) {
      case 1013:
        break;
    }
  }

  static ToHospital(actor: Player, tilepos: { x: number, y: number }): void {
    actor.tilePos = tilepos;
    console.log("hospital event is now end");
    const frozen_ops = 3;
    actor.startFrozen(frozen_ops);
    actor.changeStatus(2);
    const ____msg = `${actor.fullname} is found injured and went ICU for ${frozen_ops} days!`;
    actor.emitter.emit("dialogNotice", {msg: ____msg});
    // actor.emitter.emit("next");
  }

  static ToJail(actor: Player, tile_pos: { x: number, y: number }): void {
    actor.tilePos = tile_pos;
    const frozen_ops = 5;
    actor.startFrozen(frozen_ops);
    actor.changeStatus(3);
    const ____msg = `${actor.fullname} is arrested and went administrative detention for ${frozen_ops} days!`;
    actor.emitter.emit("dialogNotice", {msg: ____msg})
  }

  /**
   * the removed road item
   * @param {GapPath} gap
   * @param {number} item_index
   * @constructor
   */
  private RemoveRoadItem(gap: GapPath, item_index: number): void {
    //remove the items instantly
    this._roadItems[item_index].removeFrom(this._logic.zoo_keeper);
    gap.RemoveRoadEvents();
    this._roadItems.splice(item_index, 1);
  }

  /**
   *
   * @param {PassStopEvent} n
   * @param {Array<PathItem>} list listed item is now up
   * @returns {number}
   * 0: stop there
   * 1: continue forward
   * -1: reverse forward
   * @constructor
   */
  public TakeEffective(n: PassStopEvent): number {

    let cIndex = _.findIndex(this._roadItems, (c: PathItem) => {
      return c.isMatchTile(n.pathGap.tilepos.x, n.pathGap.tilepos.y);
    });

    n.player.tilePos = n.pathGap.tilepos;

    if (cIndex === -1) {
      return 1;
    }

    switch (n.event) {
      case 1013:
        //block event
        this.RemoveRoadItem(n.pathGap, cIndex);
        return 0;
      case 1014:
        n.nextSum;
        break;
    }

    return 1;
  }

  /**
   * the item is being taken
   * @param {number} code now is up
   * @returns {boolean}
   * @constructor
   */
  public TakeItem(loc: GapPath): boolean {
    let cIndex = _.findIndex(this._roadItems, (c: PathItem) => {
      return loc.isMatchTile(c.tilepos.x, c.tilepos.y);
    });
    if (cIndex === -1) {
      return false;
    }
    console.log("item is taken now");
    this.RemoveRoadItem(loc, cIndex);
    return true;
  }

}
