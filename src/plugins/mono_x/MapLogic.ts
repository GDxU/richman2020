import Character from "./Character";
//import * as filters from "pixi-filters";
/*import {
  Application,
  settings,
  Container,
  Rectangle,
  Sprite,
  TilingSprite,
  utils,
  filters as externalFilters
} from "pixi.js";*/

import {
  Application,
  settings,
  utils,
} from "pixi.js";
//window.PIXI = PIXI;

//global.PIXI = PIXI;
//import "pixi-projection";
//import  "../pixi_setup"
//export { PIXI.projection} from "pixi-projection"
//import {TimelineLite, Back, Power2, Power1, GSDevTools} from "gsap"
//import * as Stats from "three/examples/js/libs/stats.min.js";
import * as dat from "three/examples/js/libs/dat.gui.min.js";
//import mapData from "../../static/mmonoploy/map_cola.json"
import BuildingLocation from "./BuildingLocation";
import DisplayObject = PIXI.DisplayObject;

export default class MapLogic extends Application {
  public STATE_ON: number = 1;
  public STATE_PICK: number = 2;
  initWidth: number;
  initHeight: number;
  animating: boolean;
  rendering: boolean;
  animateTimer: number;

  events: utils.EventEmitter;
  bg: any;
  gui: dat.GUI;
  pond: any;

  total_step_count: number;
  buildings: Array<BuildingLocation>;
  people: Array<Character>;
  steps: Array<object>;

  constructor(initWidth: number, initHeight: number, el: any) {
    // Get the initial demensions for the application
    super({
      view: el,
      width: initWidth,
      height: initHeight,
      autoStart: false,
      backgroundColor: 0x000000,
    });

    this.gui = new dat.GUI();
    this.gui.useLocalStorage = false;
    settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

    this.initWidth = initWidth;
    this.initHeight = initHeight;
    this.animating = true;
    this.rendering = true;
    this.events = new utils.EventEmitter();
    this.animateTimer = 0;
    this.bg = null;
    this.pond = null;

    this.total_step_count = 0;
    this.buildings = [];
    this.people = [];
    this.steps = [];

    /*
        this.filterArea = new Rectangle();
        this.padding = 100;
        this.bounds = new Rectangle(
          -this.padding,
          -this.padding,
          initWidth + this.padding * 2,
          initHeight + this.padding * 2
        );*/

    //const app = this;
    this.gui.add(this, "rendering")
      .name("&bull; Rendering")
      .onChange((value) => {
        if (!value) {
          // app.stop();
        }
        else {
          // app.start();
        }
      });
    this.gui.add(this, "animating").name("&bull; Animating");
    //  const camera = new PIXI.projection.Camera3d();
    //camera.setPlanes(400, 10, 10000, true);
    //   camera.position.set(initWidth / 2, initHeight / 2);
    // camera.position3d.copy(player.position3d);
    // player.scale3d.set(0.5);
    // camera.scale3d.set(0.5);
  }

  AddItem(item: DisplayObject) {
    // this.stage.addChild(item);
  }

  RemoveBanner(item: DisplayObject) {
    // this.stage.removeChild(item);
  }

  loadMap(resouces) {
    const texture_dis = resouces.map_test.texture;
    // const texture_dis = PIXI.Texture.from (filter_map_displacement);
    texture_dis.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    //const map_now_gogo = new PIXI.Sprite(texture_dis);
    //this.stage.addChild(map_now_gogo);

    /* function loadJsonMapData() {
       mapData.map_waypoints.forEach(function (item, index, array) {
         item
       })
     }*/

    /*function renderTiles() {
      const rect = new PIXI.Rectangle(0, 0, this.square, this.square);
      for (let i = 0, sn = 0; i < this.size.height; i++) {
        for (let j = 0; j < this.size.width; j++) {
          sn = this.data[i * this.size.width + j];
          if (!sn) continue;
          sn--;
          rect.x = (sn % this.tilesets.columns) * this.square;
          rect.y = (~~(sn / this.tilesets.columns)) * this.square;
          // 分块读取
          const tile = new PIXI.Sprite(new PIXI.Texture(this.tilesheet, rect))
          tile.position.set(j * this.square, i * this.square);
          tile.anchor.set(.5);
          this.addChild(tile)
        }
      }
    }*/
  }

  focus(character: Character) {
    //let player = character;
    //const line  = new TimelineLite();
    /* line
       .to (falpha, 2.2, { alpha : 1 })
       .to (fblur, 1.9, { blur : 0 });*/

  }

  dice(x: number) {
    switch (x) {
      case this.STATE_ON:
        break;

      case this.STATE_PICK:
        break;


    }
  }


}
