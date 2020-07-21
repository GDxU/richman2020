import {utils} from "pixi.js"

export default class ClipBase extends utils.EventEmitter {
  resource: Array<any>;

  constructor(resource) {
    super();
    this.resource = resource;
  }

}
