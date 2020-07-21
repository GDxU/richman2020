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
import { Graphics, Loader, Container } from "pixi.js";
var LoaderScreen = (function (_super) {
    __extends(LoaderScreen, _super);
    function LoaderScreen($STORE) {
        var _this = this;
        var _a = $STORE.state.pixiUtil.Renderer, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        _this = _super.call(this) || this;
        _this.loader = new Loader();
        _this.done = function () {
        };
        _this.bar = new Graphics().beginFill(0xff0000).drawRect(0, -2.5, 200, 5);
        _this.bar.x = canvasWidth / 2 - 100;
        _this.bar.y = canvasHeight / 2;
        _this.bar.scale.x = 0;
        _this.progress = 0;
        _this.ease = 0;
        _this.unsubscribe = $STORE.subscribe(function () {
            _this.ease += (_this.progress - _this.ease) * 0.03;
            _this.bar.scale.x = _this.ease;
            var _a = $STORE.state.pixiUtil.Renderer, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
            _this.bar.x = canvasWidth / 2 - 100;
            _this.bar.y = canvasHeight / 2;
        });
        _this.addChild(_this.bar);
        return _this;
    }
    LoaderScreen.prototype.start = function (assets) {
        if (assets === void 0) { assets = []; }
        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];
            this.loader.add(asset.name, asset.url);
        }
        this.loader.load();
        this.loader.onProgress.add(this.onUpdate.bind(this));
        this.loader.onComplete.add(this.onComplete.bind(this));
    };
    LoaderScreen.prototype.onUpdate = function (ldr) {
        this.progress = ldr.progress / 100;
    };
    LoaderScreen.prototype.onComplete = function (a, b) {
        this.done(a, b);
        this.unsubscribe();
        console.log("loading resize unsubscribe.");
    };
    LoaderScreen.prototype.onLoaded = function (callback) {
        if (callback === void 0) { callback = function () {
        }; }
        this.done = callback;
    };
    return LoaderScreen;
}(Container));
export default LoaderScreen;
