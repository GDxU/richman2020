var DemoServerLogic = (function () {
    function DemoServerLogic() {
    }
    DemoServerLogic.randomnumbers = function (lowest, highest, count, unique) {
        var _loc1 = [];
        var _loc5 = [];
        var delta = highest - lowest;
        if (unique && count <= delta) {
            for (var k = lowest; k <= highest; k++) {
                _loc1.push(k);
            }
            for (var _loc3 = 1; _loc3 <= count; ++_loc3) {
                var _loc2 = Math.floor(Math.random() * _loc1.length);
                _loc5.push(_loc1[_loc2]);
                _loc1.splice(_loc2, 1);
            }
        }
        else {
            for (var _loc3 = 1; _loc3 <= count; _loc3++) {
                var item = lowest + Math.floor(Math.random() * delta);
                _loc5.push(item);
            }
        }
        return _loc5;
    };
    DemoServerLogic.RRRandom = function (minVal, maxVal, nTimes) {
        var j = nTimes - 1;
        var cm = new Array(j);
        for (var ni = 0; ni <= j; ni++) {
            var gld = Math.random() * (maxVal + 1 - minVal);
            cm[ni] = minVal + gld;
            var lastn = ni - 1;
            for (var hu = 0; hu <= lastn; hu++) {
                if (cm[ni] == cm[hu]) {
                    cm[ni] = "";
                    ni--;
                }
            }
        }
        return cm;
    };
    DemoServerLogic.arrJ2gether = function (x1, x2) {
        var t = x2.length;
        if (x1.length >= x2.length) {
            t = x1.length;
        }
        var _loc2 = [];
        for (var l = 0; l < t; ++l) {
            _loc2.push(x1[l], x2[l]);
        }
        return _loc2;
    };
    DemoServerLogic.getName = function (horizontal, vertical) {
        return "c" + horizontal + "-" + vertical;
    };
    DemoServerLogic.generateMap = function (horizontal_count, vertical_count, generate) {
        var cell_id = 0;
        for (var i = 0; i < vertical_count; i++) {
            for (var j = 0; j < horizontal_count; j++) {
                var ID_field = DemoServerLogic.getName(j, i);
                generate(cell_id, ID_field, j, i);
                cell_id++;
            }
        }
    };
    return DemoServerLogic;
}());
export default DemoServerLogic;
