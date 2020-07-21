import { Assets } from "./../../../static/mmonoploy/soinasemc";
import _ from "lodash";

function ___assetList (res) {
  const collections = res.spriteshtbuilding.textures;
  const grass = res.grassmap.texture;
  const landunused = res.landunused.texture;
  const landblocks = res.landblocks.texture;
  return [{
    name : "PATH-GRASS",
    k : "gs",
    t : grass
  }, {
    name : "PATH-BLK",
    k : "gap",
    t : landblocks
  }, {
    name : "LAND-SAND",
    k : "l",
    t : landunused
  }, {
    name : "ERASE-ALL",
    k : "e",
  }, {
    name : "ERASE-BUILDs",
    k : "q",
  }, {
    name : "BASIC-LV1a", h : 0.75,
    k : "lv1a",
    t : collections["buildings/font138_0_"]
  }, {
    name : "BASIC-LV1b", h : 0.75,
    k : "lv1b",
    t : collections["buildings/font143_9_"]
  }, {
    name : "BASIC-LV1c", h : 0.75,
    k : "lv1c",
    t : collections["buildings/font156_02_"]
  }, {
    name : "BLU-LV1d", h : 0.75,
    k : "lv1d",
    t : collections["buildings/house01_"]
  }, {
    name : "BLU-LV2a", h : 0.75,
    k : "lv2a",
    t : collections["buildings/font188_445_"]
  }, {
    name : "GREEN-LV2b", h : 0.6,
    k : "lv2b", t : collections["buildings/font187_0_"]
  }, {
    name : "RED-BLOCK-DOUBLE-lv2c", h : 0.75,
    k : "lv2c",
    t : collections["buildings/house04_"]
  }, {
    name : "BLK-LV2d", h : 0.75,
    k : "lv2d", t : collections["buildings/font157_9_"]
  }, {
    name : "HOUSE-LV3a", h : 0.75,
    k : "lv3a", t : collections["buildings/font188_4221_"]
  }, {
    name : "GREEN-LV3b", h : 0.6,
    k : "lv3b", t : collections["buildings/font188_4w1_"]
  }, {
    name : "BLK-LV3c", h : 0.75,
    k : "lv3c",
    t : collections["buildings/font156_01_"]
  }, {
    name : "BLK-LV3d", h : 0.75,
    k : "lv3d", t : collections["buildings/font156_03_"]
  }, {
    name : "BLK-LV4a", h : 0.75,
    k : "lv4a", t : collections["buildings/themon_02_"]
  }, {
    name : "BLK-LV5a", h : 0.75,
    k : "lv5a", t : collections["buildings/themon_03_"]
  }, {
    name : "BLK-LV6a", h : 0.80,
    k : "lv6a",
    t : collections["buildings/fontt_391_"]
  }, {
    name : "BLK-LV7a", h : 0.80,
    k : "lv7a",
    t : collections["buildings/fontt391_"]
  }, {
    name : "minishop-a", h : 0.75,
    k : "ms1",
    t : collections["buildings/font152_2_"]
  }, {
    name : "minishop-b",
    k : "ms2",
    h : 0.75,
    t : collections["buildings/font140_8_"]
  }, {
    name : "hospital",
    k : "hs",
    h : 0.65,
    t : collections["buildings/hospital_"]
  }, {
    name : "jail",
    k : "ja",
    h : 0.65,
    t : collections["buildings/font192_1_"]
  },
  ];
}

function ____animation_char (res) {
  let list_res_items = [];
  _.each (res, function (item, i) {

    let start = i.indexOf ("char_");
    let isImg = i.indexOf ("_image") > -1;
    let isChar = start > -1;

    if (isChar && !isImg) {
      let short = i.substring (5, 8);
      //  console.log (item, short);
      list_res_items.push ({
        name : i,
        k : short,
        t : item.textures
      })
    }
  });
  //console.log (list_res_items);
  return list_res_items
}

function ___path_item (res) {
  //let list_res = [];
  const roadblock = res.roadblock.texture;
  const ambulance_ani = res.ambulance.textures;
  const card_ani = res.card.textures;
  return [{
    name : "BLOCK",
    k : "rb",
    t : roadblock
  }, {
    name : "CARD",
    k : "cr",
    t : card_ani
  }, {
    name : "AMBULANCE",
    k : "am",
    t : ambulance_ani
  }];
}

export default {
  methods : {
    assetList (res) {
      return ___assetList (res);
    },
    assetCharactors (res) {
      return ____animation_char (res);
    },
    assetPathItems (res) {
      return ___path_item (res)
    }
  },
  data () {
    return {
      loaded_asset_list : Assets
    }
  },
};
