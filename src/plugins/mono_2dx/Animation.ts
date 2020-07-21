import {Container, Texture,} from "pixi.js";
import {Config} from "./Common";
import "@pixi/sprite-animated";
import _ from "lodash"
export default class Animation {
  forward: PIXI.AnimatedSprite;
  back: PIXI.AnimatedSprite;
  right: PIXI.AnimatedSprite;
  left: PIXI.AnimatedSprite;
  current_animation: PIXI.AnimatedSprite;

  constructor(res: Config, char_short_name: string, con: Container) {
    this.forward = this.load_rpgm_sprite(res, char_short_name, "f");
    this.back = this.load_rpgm_sprite(res, char_short_name, "b");
    this.right = this.load_rpgm_sprite(res, char_short_name, "r");
    this.left = this.load_rpgm_sprite(res, char_short_name, "l");
    con.addChild(this.left);
    con.addChild(this.right);
    con.addChild(this.back);
    con.addChild(this.forward);
    this.hide(this.left);
    this.hide(this.right);
    this.hide(this.back);
    this.hide(this.forward);
    this.active(this.forward);
  }

  private active(m: PIXI.AnimatedSprite): void {
    m.visible = true;
    this.current_animation = m;
  }

  private hide(m: PIXI.AnimatedSprite): void {
    m.visible = false
  }

  /*
    private off(m: PIXI.AnimatedSprite): void {
      m.stop();
      m.visible = false;
    }*/

  /**
   * 1: RIGHT
   * 2: UP
   * 3: DOWN
   * 4: LEFT
   * @param {number} h
   */
  public setDir(h: number): void {
    switch (h) {
      case 1:
        this.active(this.right);


        this.hide(this.left);
        this.hide(this.back);
        this.hide(this.forward);

        this.current_animation = this.right;
        break;

      case 2:
        this.active(this.back);


        this.hide(this.left);
        this.hide(this.right);
        this.hide(this.forward);
        this.current_animation = this.back;
        break;

      case 3:
        this.active(this.forward);


        this.hide(this.left);
        this.hide(this.right);
        this.hide(this.back);
        this.current_animation = this.forward;
        break;

      case 4:
        this.active(this.left);


        this.hide(this.right);
        this.hide(this.back);
        this.hide(this.forward);
        this.current_animation = this.left;
        break;
    }

  }

  public stopWalking(): void {
    this.current_animation.stop();
  }


  getCurrentSprite() {
    return this.current_animation;
  }

  load_rpgm_sprite(res: Config, char_short_name: string, prefix: string) {
    let f = [prefix + "1", prefix + "2", prefix + "3",];
    let textureArray: Array<Texture> = [];
    for (let i = 0; i < f.length; i++) {
      let k = res.animationChars.findIndex((o) => {
        return o.k === char_short_name;
      });
      if (k === -1) {
        console.log("cannot find this char name: ", char_short_name);
      }

      let texture = res.animationChars[k].t[f[i]];
      textureArray.push(texture);
    }
    // console.log(char_short_name);
    let m = new PIXI.AnimatedSprite(textureArray);
    m.visible = true;
    m.loop = true;
    m.animationSpeed = 0.052;
    m.play();
    return m;
  }
}

export class FullSheetAnimation {
  animations: PIXI.AnimatedSprite;

  constructor(textureObjects: any) {
    const list = _.map(textureObjects, function (j) {
      return j;
    });
    this.animations = new PIXI.AnimatedSprite(list);
    this.animations.visible = true;
    this.animations.loop = true;
    this.animations.animationSpeed = 0.112;
    this.animations.play();
  }
  setSpeedFast():FullSheetAnimation{
    this.animations.animationSpeed = 0.3;
    return this;
  }
/*
  appendFrom(container: Container): void {
    container.addChild(this.animations);
  }*/
}
