import "@pixi/sprite-animated";
import _ from "lodash";
var Animation = (function () {
    function Animation(res, char_short_name, con) {
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
    Animation.prototype.active = function (m) {
        m.visible = true;
        this.current_animation = m;
    };
    Animation.prototype.hide = function (m) {
        m.visible = false;
    };
    Animation.prototype.setDir = function (h) {
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
    };
    Animation.prototype.stopWalking = function () {
        this.current_animation.stop();
    };
    Animation.prototype.getCurrentSprite = function () {
        return this.current_animation;
    };
    Animation.prototype.load_rpgm_sprite = function (res, char_short_name, prefix) {
        var f = [prefix + "1", prefix + "2", prefix + "3",];
        var textureArray = [];
        for (var i = 0; i < f.length; i++) {
            var k = res.animationChars.findIndex(function (o) {
                return o.k === char_short_name;
            });
            if (k === -1) {
                console.log("cannot find this char name: ", char_short_name);
            }
            var texture = res.animationChars[k].t[f[i]];
            textureArray.push(texture);
        }
        var m = new PIXI.AnimatedSprite(textureArray);
        m.visible = true;
        m.loop = true;
        m.animationSpeed = 0.052;
        m.play();
        return m;
    };
    return Animation;
}());
export default Animation;
var FullSheetAnimation = (function () {
    function FullSheetAnimation(textureObjects) {
        var list = _.map(textureObjects, function (j) {
            return j;
        });
        this.animations = new PIXI.AnimatedSprite(list);
        this.animations.visible = true;
        this.animations.loop = true;
        this.animations.animationSpeed = 0.112;
        this.animations.play();
    }
    FullSheetAnimation.prototype.setSpeedFast = function () {
        this.animations.animationSpeed = 0.3;
        return this;
    };
    return FullSheetAnimation;
}());
export { FullSheetAnimation };
