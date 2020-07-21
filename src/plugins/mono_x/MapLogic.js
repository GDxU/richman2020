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
import { Application, settings, utils, } from "pixi.js";
import * as dat from "three/examples/js/libs/dat.gui.min.js";
var MapLogic = (function (_super) {
    __extends(MapLogic, _super);
    function MapLogic(initWidth, initHeight, el) {
        var _this = _super.call(this, {
            view: el,
            width: initWidth,
            height: initHeight,
            autoStart: false,
            backgroundColor: 0x000000,
        }) || this;
        _this.STATE_ON = 1;
        _this.STATE_PICK = 2;
        _this.gui = new dat.GUI();
        _this.gui.useLocalStorage = false;
        settings.PRECISION_FRAGMENT = 2;
        _this.initWidth = initWidth;
        _this.initHeight = initHeight;
        _this.animating = true;
        _this.rendering = true;
        _this.events = new utils.EventEmitter();
        _this.animateTimer = 0;
        _this.bg = null;
        _this.pond = null;
        _this.total_step_count = 0;
        _this.buildings = [];
        _this.people = [];
        _this.steps = [];
        _this.gui.add(_this, "rendering")
            .name("&bull; Rendering")
            .onChange(function (value) {
            if (!value) {
            }
            else {
            }
        });
        _this.gui.add(_this, "animating").name("&bull; Animating");
        return _this;
    }
    MapLogic.prototype.AddItem = function (item) {
    };
    MapLogic.prototype.RemoveBanner = function (item) {
    };
    MapLogic.prototype.loadMap = function (resouces) {
        var texture_dis = resouces.map_test.texture;
        texture_dis.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    };
    MapLogic.prototype.focus = function (character) {
    };
    MapLogic.prototype.dice = function (x) {
        switch (x) {
            case this.STATE_ON:
                break;
            case this.STATE_PICK:
                break;
        }
    };
    return MapLogic;
}(Application));
export default MapLogic;
