const config = {
  app_name : "DiceBot",
  // recaptcha_sitekey: "6LefHRcTAAAAAGwCE3EB_5A_L3Ay3wVZUCISid-D",
  mp_browser_uri : "https://www.moneypot.com",
  // app_id: 926, //DiceBot
  // redirect_uri: "https://seuntjie.com/",
  // be_uri: "//seuntjie.com",
  app_id : 2668,
  redirect_uri : "https://dice.seuntjie.com/", //Local
  be_uri : "//dice.seuntjie.com",
  force_https_redirect : true,
  house_edge : 0.02,
  total_outcome : 100,
  chat_buffer_size : 99,
  // - The amount of bets to show on screen in each tab
  bet_buffer_size : 50,
  debug : false,
  errorproperties : {}
};
let socket = null;
let web3 = null; // Will hold the web3 instance
let randomString = function (length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt (Math.floor (Math.random () * possible.length));
  }
  return text;
};

function getRandomInt (max) {
  return Math.floor (Math.random () * Math.floor (max));
}

/**
 * the calculations of the dice roll probabilities and the outcome
 * @param target
 * @param dir
 * @returns {{r: number, t: *, p: number}}
 */
function getWinPro (target, dir) {
  const z = 1.0 - config.house_edge;
  var winpro = target / config.total_outcome;
  if (dir === 1) {
    winpro = 1 - winpro;
  }
  if (dir === 2) {
    winpro = 1 / config.total_outcome;
  }
  const rate = z / winpro;
  return {
    r : rate,
    t : target,
    p : winpro
  }
}

function getWinProRF (target) {
  const z = 1.0 - config.house_edge;
  const winpro = 1 - target / 25;
  const rate = z / winpro;
  // console.log ("result_target_change", winpro);
  return {
    r : rate,
    t : target,
    p : winpro
  }
}


function handleAuthenticate ({ publicAddress, signature }) {
  fetch (`${process.env.BASE_URL}/auth`, {
    body : JSON.stringify ({ publicAddress, signature }),
    headers : {
      "Content-Type" : "application/json"
    },
    method : "POST"
  }).then (response => response.json ());
}

function handleSignMessage ({ publicAddress, nonce }) {
  return new Promise ((resolve, reject) =>
    web3.personal.sign (
      web3.fromUtf8 (`I am signing my one-time nonce: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) return reject (err);
        return resolve ({ publicAddress, signature });
      }
    )
  );
};

function handleSignup (publicAddress) {
  fetch (`${process.env.BASE_URL}/users`, {
    body : JSON.stringify ({ publicAddress }),
    headers : {
      "Content-Type" : "application/json"
    },
    method : "POST"
  }).then (response => response.json ());
}

