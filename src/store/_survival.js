import { WEBSOCKSW } from "../plugins/EventBus";
import axios from "../plugins/axios";
import WsAppSurvival from "../plugins/ws_survival";

/*const sleep = (milliseconds) => {
  return new Promise (resolve => setTimeout (resolve, milliseconds))
}*/

function randomNumber (min, max) {
  return Math.random () * (max - min) + min;
}

const API_BLOCK_HISTORY = "https://app.bigbang.run/index.php/home22/nologin/kaijianglist";
const state = {
  login_loading : false,
  is_login : false,
  //bbgc game now
  profile : {
    cid : "",
    username : "",
    hash : "",
    id : "",
    uid : 0,
    sq : {},
    updatetime : new Date ()
  },
  game_status : -1,
  factor_point : 0.0,
  up_next : 0,
  waiting_time : 0,
  current_bet_amount : 0,
  current_bet_coin : "--",
  players : [],
  pots : [],
  profile_history : [],
  game_history : [],
  currentBetControls : [],
  profile_wallet : {},
  last_update_wallet_info : {
    gain : false,
    coin : "---"
  },
  update_pot_info : {
    gain : false,
    coin : "bbgc"
  },
  errorproperties : {}
};
let survival_socket = null;
const actions = {
  normal_ticket_prize_insert_coin ({ state, commit }, val) {
    if (state.bank_amount > val) {
      commit ("take_out_coin", val);
      return true;
    } else {
      return false;
    }
  },
  subGame ({ state, commit }, val) {
    const game_code = val.split ("_")[1];
    socket.Emit ("sub", game_code);
  },
  unsubGame ({ state, commit }, val) {
    const game_code = val.split ("_")[1];
    socket.Emit ("unsub", game_code);
  },
  wsInitSurvival (context, val) {
    if (WEBSOCKSW.active || !process.browser) return;
    WEBSOCKSW.active = true;
    //socket = new Ws (process.env.WS_URL);
    //socket = new Ws ("ws://161.117.84.89:2019/ws");
    if (!(survival_socket instanceof WsAppSurvival)) {
      survival_socket = new WsAppSurvival (context, val);
    }
  },
  blockhistory_init ({ commit }) {
    axios.post (API_BLOCK_HISTORY, {})
      .then (function (response) {
        //  that.$store.dispatch ("blockhistory_init", response.data.list);
        commit ("append_block_history_php", response.data.list)
      })
      .catch (function (error) {
        console.log ("post data got er", error);
      });
  },
  clear_players ({ commit, }) {
    commit ("clear_players")
  },
  metamask ({ commit, state }) {
    commit ("signInLoading", true);
    /* var web3js = window.web3;
     if (typeof web3js !== "undefined") {
         const publicAddress = state.web3.coinbase;
         // Look if user with current publicAddress is already present on backend
         fetch (`${process.env.BASE_URL}/users?publicAddress=${publicAddress}`)
             .then (response => response.json ())
             // If yes, retrieve it. If no, create it.
             .then (
                 users => (users.length ? users[0] : handleSignup (publicAddress))
             )
             // Popup MetaMask confirmation modal to sign message
             .then (handleSignMessage)
             // Send signature to backend on the /auth route
             .then (handleAuthenticate)
             .then ((token) => {
                     commit ("saveETH_token", token)
                 }
             )
             // Pass accessToken back to parent component (to save it in localStorage)
             .catch (err => {
                 window.alert (err);
                 // commit ("signInLoading", false);
             });
     }*/
  },
  updateTimerCountDown ({ commit, state }, val_seconds) {
    let n = 0;
    clearInterval (mem_clock_ex_a);
    mem_clock_ex_a = setInterval (function () {
      const c = val_seconds - n;
      commit ("update_time_second", c);
      //    console.log ("time..", that.countdownclock, time, n);
      if (c === 1) {
        clearInterval (mem_clock_ex_a);
      } else {
        n++;
      }
    }, 1000)
  },
  updateClearCountDown ({ commit, state }) {
    clearInterval (mem_clock_ex_a);
    commit ("update_time_second", 0);
  },
  updateExtrasBetControls ({ commit, state }, extras) {
    commit ("updateExtrasBetControls", extras);
  },
  save_tick ({ commit, state }, extras) {
    commit ("bb_tick", extras);
  },
  bbg_autobet ({ commit, state, getters }, ff) {
    // await sleep (randomNumber (1.5, 4.5));
    const bet_amount = randomNumber (100, 2500);
    setTimeout (() => {
      for (let [key, value] of Object.entries (state.profile_wallet)) {
        // console.log(key, value);
        if (key === ff) {
          commit ("autobet", { amount : bet_amount, coin : ff })
        }
      }
    }, randomNumber (1500, 4500));
  },
};
let mem_clock_ex_a = 0;

const getters = {
  IsSurvivalLogin (state) {
    return state.is_login;
  },
  getuserid (state) {
    return state.user_id
  },
  getWalletCoin (state) {
    return function (coin_name) {
      /**
       * coin, amount, locked
       * {c, b, l}
       */
      return state.profile_wallet.find (coin_payload => String (coin_payload.c).toLowerCase () === String (coin_name).toLowerCase ())
    }
  }


};

const mutations = {
  add_free_coin (state) {
    state.bank_amount += 10;
  },
  take_out_coin (state, number) {
    state.bank_amount -= number;
  },
  increment (state) {
    state.counter++;
  },

  /**
   * all big bang related functions
   * @param state
   * @param json
   */
  init_sock (state, json) {


    // console.log (state.profile_wallet);
    WsAppSurvival.UpdateWallet (state, json.wallet);
    state.profile.username = json.username;
    state.profile.hash = json.h;
    state.profile.cid = json.wid;
    state.game_history = [];
    state.profile.updatetime = new Date ();


    /* json.wallet.forEach (function (jItem, index, array) {
         let found = false;
         state.profile_wallet.forEach (function (sItem, index, array) {
             if (String (sItem.c).toLowerCase () === String (jItem.c).toLowerCase () && String (jItem.c).trim () !== "") {
                 found = true;
                 sItem.c = String (jItem.c).toLowerCase ();
                 sItem.b = jItem.b;
             }
         });
         if (!found && String (jItem.c).trim () !== "") {
             state.profile_wallet.push (jItem)
         }
     });*/


    /**

     UserId: "XPqlmHdODbhVeONySXNxrzpHJjfMLrNhUTQpqnUUIxoyTCYznrVAxNIDUOydOhcx"
     UserLoginName: "Spiritsolstice Stalker"
     Wallets: [{Currency: "btc", Balance: 0}, {Currency: "ltc", Balance: 0}, {Currency: "xrp", Balance: 0},…]
     bh: {wins: 0, loss: 0, totalbets: 0, rate: 0}
     gp: {GameIds: [], WebAccessToken: "", WebAccessExpiration: 0}
     sq: {c1: 0, c2: 0, c3: 0, c4: 0, c5: 0}


     {     s,total,locked,folks}
     */
  },
  pot_update (state, o) {
    let found = false;
    const post = o.p[0];
    if (state.pots.length > 0) {
      state.pots.forEach (function (item, index, array) {
        if (String (item.s).toLowerCase () === String (post.s).toLowerCase ()) {
          const previous = state.pots[index].locked;
          const isgain = parseFloat (post.locked) > parseFloat (previous);
          state.pots[index].s = post.s;
          state.pots[index].total = post.total;
          state.pots[index].locked = post.locked;
          state.pots[index].folks = post.folks;
          state.update_pot_info.coin = post.s;
          state.update_pot_info.gain = isgain;
          //stop looping
          found = true;
        }
      });
      if (!found) {
        state.pots.push (post);
      }
    } else {
      state.pots.push (post);
    }
  },
  /**
   *
   * @param state
   * @param post_list
   */
  pot_ls_update (state, post_list) {
    post_list.forEach (function (jItem, index, array) {
      let found = false;
      state.pots.forEach (function (uItem, index, array) {
        if (String (uItem.s).toLowerCase () === String (jItem.s).toLowerCase ()) {
          found = true;
          Object.assign (uItem, jItem)
          /*
                  uItem.total = jItem.total;
                  uItem.locked = jItem.locked;
                  uItem.folks = jItem.folks;
          */
        }
      });
      //if (!found && String (jItem.s).trim () !== "") {
      //     state.pots.push (jItem)
      //  }
    });
  },
  append_block_history_php (state, json_data) {
    if (!state) {
      return
    }
    /**
     * beishu: 1.653
     dot: "1.6534207950796145"
     hash: "0x216e14a724969a0c4ca3d6b55ac9d762e8e4aa0f126ba252516aa4c9000285de"
     id: "342833"
     */
    json_data.forEach ((json_data, i, list) => {

      const temp_e = {
        i : json_data.id,
        d : json_data.beishu,
        h : json_data.hash,
      };
      //  console.log(state.game_history);
      state.game_history.push (temp_e);
    });

  },
  append_block_history (state, json_data) {
    if (!state) {
      return
    }
    //console.log(state.game_history);
    const game_history_len = state.game_history.length;
    const temp_e = {
      i : json_data.period,
      d : json_data.xf,
      h : json_data.hash,
    };

    if (game_history_len > 0) {
      state.game_history.unshift (temp_e);
      if (game_history_len > 60) {
        state.game_history.pop ();
      }
    } else {
      state.game_history.push (temp_e);
    }
  },
  //https://stackoverflow.com/questions/50767191/vuex-update-an-entire-array
  player_update (state, o) {
    let found = false;
    if (state.players.length > 0) {
      state.players.forEach (function (item, index, array) {
        if (item.i === o.i) {
          //                    state.players[index].c = o.c;
          //user name
          /*       state.players[index].j = o.j;
                 state.players[index].e = o.e;
                 state.players[index].b = o.b;
                 state.players[index].s = o.s;
                 state.players[index].t = o.t;*/
          Object.assign (state.players[index], o);
          found = true;
        }
      });
      if (!found) {
        state.players.push (o);
      }
    } else {
      state.players.push (o);
    }
  },
  snapshot_load_ec (state, o) {
    state.players = o.r;
    state.pots = o.p;
    state.game_status = o.s;
    //state.game_history = o.h;
    state.up_next = o.n;
  },
  bb_tick (state, tick_save) {
    state.factor_point = tick_save;
  },
  bb_status (state, o) {
    state.game_status = o.s;
    state.up_next = o.n;
  },
  bb_extra (state, extra) {
    state.currentBetControls = extra;
  },
  user_wallet_renew (state, payload_wallets) {
    WsAppSurvival.UpdateWallet (state, payload_wallets)
  },
  update_time_second (state, seconds) {
    state.waiting_time = seconds;
  },
  updateExtrasBetControls (state, extras) {
    state.currentBetControls = extras;
  },
  clear_players (state) {
    state.players = [];
  },
  login_result (state, json) {
    if (json.code === 1) {
      state.is_login = true;
      //sync wallet amount, wallet will display as list
      WsAppSurvival.UpdateWallet (state, json.data.wallet);
    } else {
      state.is_login = false
    }
  },
  bb_profile_update (state, json) {
    state.profile.cid = json.wid;
    state.profile.username = json.username;
    state.profile.hash = json.h;
    state.profile.updatetime = json.t;
    state.profile.uid = json.uid;
    state.profile.id = json.i;
    //sync wallet amount, wallet will display as list
  },
  autobet (state, a) {
    state.current_bet_amount = a.amount;
    state.current_bet_coin = a.coin;
  }
};


export default {
  namespaced : true,
  state,
  getters,
  actions,
  mutations
}



