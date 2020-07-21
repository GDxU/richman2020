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
import { utils } from "pixi.js";
var ClipBase = (function (_super) {
    __extends(ClipBase, _super);
    function ClipBase(resource) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        return _this;
    }
    return ClipBase;
}(utils.EventEmitter));
export default ClipBase;
