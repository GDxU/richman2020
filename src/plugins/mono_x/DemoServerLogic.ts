export default class DemoServerLogic {
  constructor() {

  }

  static randomnumbers(lowest: number, highest: number, count: number, unique: boolean): Array<number> {
    let _loc1: Array<number> = [];
    let _loc5: Array<number> = [];
    let delta = highest - lowest;
    if (unique && count <= delta) {
      for (let k = lowest; k <= highest; k++) {
        _loc1.push(k);
      } // end of for
      for (let _loc3 = 1; _loc3 <= count; ++_loc3) {
        let _loc2 = Math.floor(Math.random() * _loc1.length);
        _loc5.push(_loc1[_loc2]);
        _loc1.splice(_loc2, 1);
      } // end of for
    }
    else {
      for (let _loc3 = 1; _loc3 <= count; _loc3++) {
        let item = lowest + Math.floor(Math.random() * delta);
        _loc5.push(item)
      }
    }
    return _loc5;
  }

  static RRRandom(minVal, maxVal, nTimes): Array<number> {
    let j = nTimes - 1;
    let cm = new Array(j);
    for (let ni = 0; ni <= j; ni++) {
      let gld = Math.random() * (maxVal + 1 - minVal);
      cm[ni] = minVal + gld;
      let lastn = ni - 1;
      for (let hu = 0; hu <= lastn; hu++) {
        if (cm[ni] == cm[hu]) {
          cm[ni] = "";
          ni--;
        }
      }
    }
    return cm;
  }

  static arrJ2gether(x1: Array<number>, x2: Array<number>): Array<number> {
    let t = x2.length;
    if (x1.length >= x2.length) {
      t = x1.length;
    }
    let _loc2: Array<number> = [];
    for (let l = 0; l < t; ++l) {
      _loc2.push(x1[l], x2[l]);
    }
    return _loc2;
  }


  static getName(horizontal, vertical) {
    return "c" + horizontal + "-" + vertical;
  }


  static generateMap(horizontal_count, vertical_count, generate) {
    let cell_id = 0;
    //starts from zero
    for (let i = 0; i < vertical_count; i++) {
      for (let j = 0; j < horizontal_count; j++) {
        const ID_field = DemoServerLogic.getName(j, i);
        // const chance = that.target_mines / that.total_balls;
        // const hit = Math.random () > chance;
        generate(cell_id, ID_field, j, i);
        cell_id++;
      }
    }
  }

}
