import {RoadEventDescriptor} from "./Common";

export const PRICE_LV_TYPE_A = [
  100,
  200,
  300,
  400,
  500
];
export const RENT_LV_TYPE_A = [
  0,
  0,
  50,
  100,
  150,
  300
];
export const PRICE_LV_TYPE_B = [
  150,
  300,
  600,
  1000,
  4000,
  10000,
];
export const RENT_LV_TYPE_B = [
  0,
  0,
  150,
  300,
  600,
  1000,
  4000,
  10000,
];

export const FULL_EXTENDS_DIRECTIONS = [
  {x: -1, y: 0},
  {x: -1, y: -1},
  {x: 0, y: -1},
  {x: 1, y: -1},
  {x: 1, y: 0},
  {x: 1, y: 1},
  {x: 0, y: 1},
  {x: -1, y: 1},
];


export const FULL_CROSS_DIRECTIONS = [
  {x: -1, y: 0},
  {x: 0, y: -1},
  {x: 1, y: 0},
  {x: 0, y: 1},
];
/*
export const Cards: Array<RoadEventDescriptor> = [
  {
    name: "bomb",
    code: 11012
  }
];
*/
export const OnRoadEvents: Array<RoadEventDescriptor> = [
  {
    name: "Wallet Dividends",
    code: 1100,
    luck: 3,
    description: "Free roll to dice again and no stop is required!",
  },
  {
    name: "Wealth God",
    code: 1101,
    luck: 5,
    description: "Free to upgrade and free for rent!",
  },
  {
    name: "Dice",
    code: 1102,
    luck: 0,
    description: "You now have a new dice to play together!",
  },
  {
    name: "Dice Again",
    code: 1103,
    luck: 2,
    description: "Free roll to dice again after this turn!",
  },
  {
    name: "Dice Again Immediately",
    code: 1104,
    luck: 0,
    description: "Free roll to dice again and no stop is required!",
  },
  {
    name: "Full Round Complete",
    code: 1105,
    luck: 5,
    description: "Immediate transit to start point and receive the rewards!",
  },
  {
    name: "Ghost",
    code: 1010,
    luck: -1,
    description: "You will receive double rent to anywhere you visit!",
  },
  {
    name: "Reverse X1",
    code: 1011,
    luck: 0,
    description: "The next play will be a reverse!",
  },
  {
    name: "Bomb!",
    code: 1012,
    luck: -1,
    description: "You are fulled injured and now you have to receive medical attentions!",
  },
  {
    name: "Road Block!",
    code: 1013,
    luck: -1,
    description: "You have just blocked by the road and you are about to spent a night in here.!",
  },
  {
    name: "Asteroids!",
    code: 1016,
    luck: -2,
    description: "The apocalypse is now present to the earth and there are three blocks will be removed! All ownerships will be remained",
  },
  {
    name: "Earth Quick LV6",
    code: 1017,
    luck: -6,
    description: "The apocalypse is now present to the earth and there are 6 blocks will be removed! All ownerships will be remained",
  },
  {
    name: "911 Strike",
    code: 1018,
    luck: -5,
    description: "The apocalypse is now present from the ISS! One of the tall buildings is on the target and its stroke down.",
  },
  {
    name: "Building on fired!",
    code: 1019,
    luck: -3,
    description: "A serious burn down of a building and its now demolished! All ownerships will be remained. If you have got building insurance. The company will reimburse you 1/2 of the total cost",
  },
  {
    name: "Wallet Hack Dump Rom",
    code: 1020,
    luck: -5,
    description: "A specific user wallet got hack with a hired programmer and 10% of the wallet coins transferred to your wallet!",
  },
  {
    name: "Wallet Hack Normal",
    code: 1021,
    luck: -5,
    description: "A specific user wallet got hack with a hired programmer and 50% of the wallet coins transferred to your wallet!",
  },
  {
    name: "Wallet Hack Perfect",
    code: 1022,
    luck: -5,
    description: "A specific user wallet got hack with a self-owned programmer and 80% of the wallet coins transferred to your wallet!",
  },
  {
    name: "Wallet Hack caught by FBI",
    code: 1023,
    luck: -5,
    description: "You get caught from leaving the trace IP on the victim's server and you got tracked down by the FBI! Send to attention for 5 days",
  },
];
