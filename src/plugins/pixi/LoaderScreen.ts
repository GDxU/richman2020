import {Graphics, Loader, Container} from "pixi.js";
//import ScaledContainer from "./ScaledContainer";

/**
 * Loading Screen
 *
 * @exports LoaderScreen
 * @extends ScaledContainer
 */

export default class LoaderScreen extends Container {
  bar: Graphics;
  progress: number;
  ease: number;
  unsubscribe: any;
  loader: Loader;
  done: any;


  constructor($STORE) {
    const {canvasWidth, canvasHeight} = $STORE.state.pixiUtil.Renderer;
    super();
    // console.log(canvasWidth, canvasHeight);
    this.loader = new Loader();
    this.done = () => {
    };

    // set up a bar
    this.bar = new Graphics().beginFill(0xff0000).drawRect(0, -2.5, 200, 5);
    this.bar.x = canvasWidth / 2 - 100;
    this.bar.y = canvasHeight / 2;
    this.bar.scale.x = 0;
    this.progress = 0;
    this.ease = 0;

    // animate it
    this.unsubscribe = $STORE.subscribe(() => {
      this.ease += (this.progress - this.ease) * 0.03;
      this.bar.scale.x = this.ease;
      const {canvasWidth, canvasHeight} = $STORE.state.pixiUtil.Renderer;
      this.bar.x = canvasWidth / 2 - 100;
      this.bar.y = canvasHeight / 2;
    });

    this.addChild(this.bar);
  }

  start(assets: Array<{ name: string, url: string }> = []) {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      //console.log(asset);
      // Loader.shared.add(asset.name, asset.url, {crossOrigin: true});
      // Loader.shared.add(asset.name, asset.url);
      this.loader.add(asset.name, asset.url);
    }
    // this.loader.add(assets);
    this.loader.load();
    this.loader.onProgress.add(this.onUpdate.bind(this));
    this.loader.onComplete.add(this.onComplete.bind(this));
  }


  onUpdate(ldr) {
    this.progress = ldr.progress / 100;
    // window.console.log (this.progress);
  }

  onComplete(a, b) {
    this.done(a, b);
    this.unsubscribe();
    console.log("loading resize unsubscribe.");
    //window.console.log ("done");
  }

  onLoaded(callback = () => {
  }) {
    this.done = callback;
  }
}
