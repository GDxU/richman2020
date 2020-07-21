// OLD VERSION DO NOT USE
// Older pens still rely on this.
const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

/**
 * MyMath.js
 * -----------
 * Handy math/trig reference.
 *
 * Author: Caleb Miller
 *         caleb@caleb-miller.com
 */
function MyMathFactory (Math) {
  const MyMath = {};

  // degree/radian conversion constants
  MyMath.toDeg = 180 / Math.PI;
  MyMath.toRad = Math.PI / 180;
  MyMath.halfPI = Math.PI / 2;
  MyMath.twoPI = Math.PI * 2;

  // Pythagorean Theorem distance calculation
  MyMath.dist = (width, height) => {
    return Math.sqrt (width * width + height * height);
  };

  // Pythagorean Theorem point distance calculation
  // Same as above, but takes coordinates instead of dimensions.
  MyMath.pointDist = (x1, y1, x2, y2) => {
    const distX = x2 - x1;
    const distY = y2 - y1;
    return Math.sqrt (distX * distX + distY * distY);
  };

  // Returns the angle (in radians) of a 2D vector
  MyMath.angle = (width, height) => (MyMath.halfPI + Math.atan2 (height, width));

  // Returns the angle (in radians) between two points
  // Same as above, but takes coordinates instead of dimensions.
  MyMath.pointAngle = (x1, y1, x2, y2) => (MyMath.halfPI + Math.atan2 (y2 - y1, x2 - x1));

  // Splits a speed vector into x and y components (angle needs to be in radians)
  MyMath.splitVector = (speed, angle) => ({
    x : Math.sin (angle) * speed,
    y : -Math.cos (angle) * speed
  });

  // Generates a random number between min (inclusive) and max (exclusive)
  MyMath.random = (min, max) => Math.random () * (max - min) + min;

  // Generates a random integer between and possibly including min and max values
  MyMath.randomInt = (min, max) => ((Math.random () * (max - min + 1)) | 0) + min;

  // Returns a random element from an array, or simply the set of provided arguments when called
  MyMath.randomChoice = function randomChoice (choices) {
    if (arguments.length === 1 && Array.isArray (choices)) {
      return choices[(Math.random () * choices.length) | 0];
    }
    return arguments[(Math.random () * arguments.length) | 0];
  };

  // Clamps a number between min and max values
  MyMath.clamp = function clamp (num, min, max) {
    return Math.min (Math.max (num, min), max);
  };

  return MyMath;
}

const MyMath = MyMathFactory (Math);


// New Features
// ------------------
// - Proper multitouch support!

// Breaking changes
// ------------------
// - No longer uses preventDefault() in touch handler.
// - <canvas> elements have `touchAction: auto` style applied.


// Inlined StageIntera.js dependency: Ticker.js

/**
 * Ticker.js
 * -----------
 * requestAnimationFrame helper. Provides elapsed time between frames and a lag compensation multiplier to callbacks.
 *
 * Author: Caleb Miller
 *         caleb@caleb-miller.com
 */

/**
 * Stage.js
 * -----------
 * Super simple "StageIntera" abstraction for canvas. Combined with Ticker.js, it helps simplify:
 *   - Preparing a canvas for drawing.
 *   - High resolution rendering.
 *   - Resizing the canvas.
 *   - Pointer events (mouse and touch).
 *   - Frame callbacks with useful timing data and calculated lag.
 *
 * This is no replacement for robust canvas drawing libraries; it's designed to be as lightweight as possible and defers
 * full rendering burden to user.
 *
 * Author: Caleb Miller
 *         caleb@caleb-miller.com
 */
let lastTimestamp = 0;
let started = false;
let listeners = [];

export class Ticker {
  constructor (stats) {
    this.stats = stats;
    // console.log (this);

  }

  addListener (callback) {
    if (typeof callback !== "function") {
      throw("Ticker.addListener() requires a function reference passed for a callback.");
    }
    listeners.push (callback);
    // start frame-loop lazily
    if (!started) {
      started = true;
      //console.log ("update stats and update now and all...");
      //  console.log (this);
      queueFrame (this.stats);
    }
  }
}


function frameHandler (timestamp, stats) {
  let frameTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  // make sure negative time isn't reported (first frame can be whacky)
  if (frameTime < 0) {
    frameTime = 17;
  }
  // - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
  else if (frameTime > 68) {
    frameTime = 68;
  }
  // fire custom listeners
  listeners.forEach (listener => listener.call (window, frameTime, frameTime / 16.6667));
  // always queue another frame
  // console.log ("update .");
  queueFrame (stats);
}

// queue up a new frame (calls frameHandler)
function queueFrame (stats) {
  if (window.requestAnimationFrame) {
    requestAnimationFrame ((t) => {
      frameHandler (t, stats);
      //console.log (stats);
      stats.update ();
    });
  } else {
    webkitRequestAnimationFrame ((t) => {
      frameHandler (t, stats);
      stats.update ();
    });
  }
}

// Track touch times to prevent redundant mouse events.
let lastTouchTimestamp = 0;
// track all stages instances
let stages = [];
// allow turning off high DPI support for perf reasons (enabled by default)
// Note: MUST be set before stages construction.
//       Each StageIntera tracks its own DPI (initialized at construction time), so you can effectively allow some Stages to render high-res graphics but not others.
let disableHighDPI = false;

export class Stage {

  constructor (canvas, document, window, ticker) {
    //    console.log ("work 5");
    // canvas and associated context references
    this.canvas = canvas;
    this.ctx = canvas.getContext ("2d");
    // const one = canvas.getContext ("2d");
    //  one.drawImage()
    // Prevent gestures on stages (scrolling, zooming, etc)
    this.canvas.style.touchAction = "none";
    // physics speed multiplier: allows slowing down or speeding up simulation (must be manually implemented in physics layer)
    this.speed = 1;
    // devicePixelRatio alias (should only be used for rendering, physics shouldn"t care)
    // avoids rendering unnecessary pixels that browser might handle natively via CanvasRenderingContext2D.backingStorePixelRatio
    this.dpr = disableHighDPI ? 1 : ((window.devicePixelRatio || 1) / (this.ctx.backingStorePixelRatio || 1));
    // canvas size in DIPs and natural pixels
    this.width = canvas.width;
    this.height = canvas.height;
    this.naturalWidth = this.width * this.dpr;
    this.naturalHeight = this.height * this.dpr;
    // size canvas to match natural size
    if (this.width !== this.naturalWidth) {
      this.canvas.width = this.naturalWidth;
      this.canvas.height = this.naturalHeight;
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
    }
    //   console.log ("work 6");
    stages.push (this);
    this._ticker = ticker;
    // event listeners (note that 'ticker' is also an option, for frame events)
    this._listeners = {
      // canvas resizing
      resize : [],
      // pointer events
      pointerstart : [],
      pointermove : [],
      pointerend : [],
      lastPointerPos : { x : 0, y : 0 }
    };
    //    console.log ("work 7");
    document.addEventListener ("mousedown", stage_mouseHandler);
    document.addEventListener ("mousemove", stage_mouseHandler);
    document.addEventListener ("mouseup", stage_mouseHandler);
    document.addEventListener ("touchstart", stage_touchHandler);
    document.addEventListener ("touchmove", stage_touchHandler);
    document.addEventListener ("touchend", stage_touchHandler);
    //   console.log ("work 8");
  }

  LoadImage (path) {
    const that = this;
    const image_t = new Image ();
    image_t.src = path;
    const w = 691;
    const h = 723;

    image_t.addEventListener ("load", function () {
      //that.ctx.globalCompositeOperation = "source-in";
      //draw background image
      that.ctx.drawImage (image_t, 0, 0);
      //draw a box over the top
      that.ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
      that.ctx.fillRect (0, 0, w, h);
    }, false);

  }

  resize (w, h) {
    this.width = w;
    this.height = h;
    this.naturalWidth = w * this.dpr;
    this.naturalHeight = h * this.dpr;
    this.canvas.width = this.naturalWidth;
    this.canvas.height = this.naturalHeight;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.dispatchEvent ("resize");
  }


  windowToCanvas (canvas, x, y) {
    const bbox = canvas.getBoundingClientRect ();
    return {
      x : (x - bbox.left) * (canvas.width / bbox.width),
      y : (y - bbox.top) * (canvas.height / bbox.height)
    };
  }


  pointerEvent (type, x, y) {
    // build event object to dispatch
    const evt = {
      type : type,
      x : x,
      y : y
    };
    // whether pointer event was dispatched over canvas element
    evt.onCanvas = (x >= 0 && x <= this.width && y >= 0 && y <= this.height);
    // dispatch
    this.dispatchEvent ("pointer" + type, evt);
  }


  // whether point event
  dispatchEvent (event, val) {
    const listeners = this._listeners[event];
    if (listeners) {
      listeners.forEach (listener => listener.call (this, val));
    } else {
//            throw('Invalid Event');
      console.error ("invalid even dispatched");
    }
  }


  addEventListener (event, handler) {
    try {
      if (event === "ticker") {
        if (this._ticker instanceof Ticker) {
          this._ticker.addListener (handler);
        }
      } else {
        this._listeners[event].push (handler);
      }
    } catch (e) {
      // throw('Invalid Event')
      console.error ("invalid even was added.", e)
    }
  }

}

function stage_mouseHandler (evt) {
  // Prevent mouse events from firing immediately after touch events
  if (Date.now () - lastTouchTimestamp < 500) {
    return;
  }

  let type = "start";
  if (evt.type === "mousemove") {
    type = "move";
  } else if (evt.type === "mouseup") {
    type = "end";
  }

  stages.forEach (x => {
    const pos = x.windowToCanvas (x.canvas, evt.clientX, evt.clientY);
    x.pointerEvent (type, pos.x / x.dpr, pos.y / x.dpr);
  });
}
;

function stage_touchHandler (evt) {
  // Time is now set
  lastTouchTimestamp = Date.now ();
  // Set generic event type
  let type = "start";
  if (evt.type === "touchmove") {
    type = "move";
  } else if (evt.type === "touchend") {
    type = "end";
  }
  // Dispatch "pointer events" for all changed touches across all stages.
  stages.forEach (x => {
    // Safari doesn't treat a TouchList as an iteratable, hence Array.from()
    for (let touch of Array.from (evt.changedTouches)) {
      let pos;
      if (type !== "end") {
        pos = x.windowToCanvas (x.canvas, touch.clientX, touch.clientY);
        x._listeners.lastPointerPos = pos;
        // before touch start event, fire a move event to better emulate cursor events
        if (type === "start") x.pointerEvent ("move", pos.x / x.dpr, pos.y / x.dpr);
      } else {
        // on touch end, fill in position information based on last known touch location
        pos = x._listeners.lastPointerPos;
      }
      x.pointerEvent (type, pos.x / x.dpr, pos.y / x.dpr);
    }
  });
}


/**
 * Shell can be constructed with options:
 *
 * size:      Size of the burst.
 * starCount: Number of stars to create. This is optional, and will be set to a reasonable quantity for size if omitted.
 * starLife:
 * starLifeVariation:
 * color:
 * glitterColor:
 * glitter: One of: 'light', 'medium', 'heavy', 'streamer', 'willow'
 * pistil:
 * pistilColor:
 * streamers:
 * crossette:
 * floral:
 * crackle:
 */

class Shell {
  constructor (options) {
    Object.assign (this, options);
    this.starLifeVariation = options.starLifeVariation || 0.125;
    this.color = options.color || randomColor ();
    this.glitterColor = options.glitterColor || this.color;

    // Set default starCount if needed, will be based on shell size and scale exponentially, like a sphere's surface area.
    if (!this.starCount) {
      const density = options.starDensity || 1;
      const scaledSize = this.size / 50 * density;
      this.starCount = scaledSize * scaledSize;
    }
  }

  bindElements (canvas, cast_snd) {
    this.mainStage = canvas;
    this.event = cast_snd;
    return this;
  }

  launch (position, launchHeight) {
    const { width, height } = this.mainStage;
    // Distance from sides of screen to keep shells.
    const hpad = 60;
    // Distance from top of screen to keep shell bursts.
    const vpad = 50;
    // Minimum burst height, as a percentage of stage height
    const minHeightPercent = 0.45;
    // Minimum burst height in px
    const minHeight = height - height * minHeightPercent;
    const launchX = position * (width - hpad * 2) + hpad;
    const launchY = height;
    const burstY = minHeight - (launchHeight * (minHeight - vpad));
    const launchDistance = launchY - burstY;
    // Using a custom power curve to approximate Vi needed to reach launchDistance under gravity and air drag.
    // Magic numbers came from testing.
    const launchVelocity = Math.pow (launchDistance * 0.04, 0.64);


    const launchSpeed = {
      dx : launchVelocity * (this.horsetail ? 1.2 : 1),
      // Hang time is derived linearly from Vi; exact number came from testing
      dy : launchVelocity * (this.horsetail ? 100 : 400)
    };

    const comet = this.comet = Star.add (
      launchX, launchY,
      typeof this.color === "string" && this.color !== "random" ? this.color : COLOR.White,
      Math.PI, launchSpeed.dx, launchSpeed.dy
    );
    this.event.$emit ("LAUNCH", launchSpeed);

    // making comet "heavy" limits air drag
    comet.heavy = true;
    // comet spark trail
    comet.spinRadius = 0.78;
    comet.sparkFreq = 16;
    if (this.glitter === "willow" || this.fallingLeaves) {
      comet.sparkFreq = 10;
      comet.sparkSpeed = 0.5;
      comet.sparkLife = 500;
      comet.sparkLifeVariation = 3;
    }
    if (this.color === INVISIBLE) {
      comet.sparkColor = COLOR.Gold;
    }
    comet.onDeath = (comet) => {
      this.event.$emit ("BURST", comet);
      this.burst (comet.x, comet.y);
    }
    // comet.onDeath = () => this.burst(launchX, burstY);
  }

  burst (x, y) {
    // Set burst speed so overall burst grows to set size. This specific formula was derived from testing, and is affected by simulated air drag.
    const speed = this.size / 96;

    let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
    let sparkLifeVariation = 0.25;

    if (this.crossette) onDeath = crossetteEffect;
    if (this.floral) onDeath = floralEffect;
    if (this.crackle) onDeath = crackleEffect;
    if (this.fallingLeaves) onDeath = fallingLeavesEffect;

    if (this.glitter === "light") {
      sparkFreq = 200;
      sparkSpeed = 0.25;
      sparkLife = 600;
    }
    else if (this.glitter === "medium") {
      sparkFreq = 100;
      sparkSpeed = 0.36;
      sparkLife = 1400;
    }
    else if (this.glitter === "heavy") {
      sparkFreq = 42;
      sparkSpeed = 0.62;
      sparkLife = 2800;
    }
    else if (this.glitter === "streamer") {
      sparkFreq = 20;
      sparkSpeed = 0.75;
      sparkLife = 800;
    }
    else if (this.glitter === "willow") {
      sparkFreq = 72;
      sparkSpeed = 0.28;
      sparkLife = 1000;
      sparkLifeVariation = 3.4;
    }

    const starFactory = angle => {
      const star = Star.add (
        x,
        y,
        color || randomColor (),
        angle,
        // apply near cubic falloff to speed (places more particles towards outside)
        Math.pow (Math.random (), 0.45) * speed,
        // add minor variation to star life
        this.starLife + Math.random () * this.starLife * this.starLifeVariation,
        this.horsetail && this.comet && this.comet.speedX,
        this.horsetail && this.comet && this.comet.speedY
      );

      star.onDeath = onDeath;

      if (this.glitter) {
        star.sparkFreq = sparkFreq;
        star.sparkSpeed = sparkSpeed;
        star.sparkLife = sparkLife;
        star.sparkLifeVariation = sparkLifeVariation;
        star.sparkColor = this.glitterColor;
        star.sparkTimer = Math.random () * star.sparkFreq;
      }
    };


    if (typeof this.color === "string") {
      if (this.color === "random") {
        color = null; // falsey value creates random color in starFactory
      } else {
        color = this.color;
      }

      // Rings have positional randomness, but are rotated randomly
      if (this.ring) {
        const ringStartAngle = Math.random () * Math.PI;
        const ringSquash = Math.pow (Math.random (), 0.45) * 0.992 + 0.008;

        createParticleArc (0, PI_2, this.starCount, 0, angle => {
          // Create a ring, squashed horizontally
          const initSpeedX = Math.sin (angle) * speed * ringSquash;
          const initSpeedY = Math.cos (angle) * speed;
          // Rotate ring
          const newSpeed = MyMath.pointDist (0, 0, initSpeedX, initSpeedY);
          const newAngle = MyMath.pointAngle (0, 0, initSpeedX, initSpeedY) + ringStartAngle;
          const star = Star.add (
            x,
            y,
            color,
            newAngle,
            // apply near cubic falloff to speed (places more particles towards outside)
            newSpeed,//speed,
            // add minor variation to star life
            this.starLife + Math.random () * this.starLife * this.starLifeVariation
          );

          if (this.glitter) {
            star.sparkFreq = sparkFreq;
            star.sparkSpeed = sparkSpeed;
            star.sparkLife = sparkLife;
            star.sparkLifeVariation = sparkLifeVariation;
            star.sparkColor = this.glitterColor;
            star.sparkTimer = Math.random () * star.sparkFreq;
          }
        });
      }
      // "Normal burst
      else {
        createParticleArc (0, PI_2, this.starCount, 1, starFactory);
      }
    }
    else if (Array.isArray (this.color)) {
      let start, start2, arc;
      if (Math.random () < 0.5) {
        start = Math.random () * Math.PI;
        start2 = start + Math.PI;
        arc = Math.PI;
      } else {
        start = 0;
        start2 = 0;
        arc = PI_2;
      }
      color = this.color[0];
      createParticleArc (start, arc, this.starCount / 2, 1, starFactory);
      color = this.color[1];
      createParticleArc (start2, arc, this.starCount / 2, 1, starFactory)
    }

    if (this.pistil) {
      const innerShell = new Shell ({
        size : this.size * 0.5,
        starLife : this.starLife * 0.7,
        starLifeVariation : this.starLifeVariation,
        starDensity : 1.65,
        color : this.pistilColor,
        glitter : "light",
        glitterColor : this.pistilColor === COLOR.Gold ? COLOR.Gold : COLOR.White
      });
      innerShell.bindElements (this.mainStage, this.event);
      innerShell.burst (x, y);
    }

    if (this.streamers) {
      const innerShell = new Shell ({
        size : this.size,
        starLife : this.starLife * 0.8,
        starLifeVariation : this.starLifeVariation,
        starCount : Math.max (6, this.size / 45) | 0,
        color : COLOR.White,
        glitter : "streamer"
      });

      innerShell.bindElements (this.mainStage, this.event);
      innerShell.burst (x, y);
    }

    // Queue burst flash render
    BurstFlash.add (x, y, this.size / 8);
  }
}


const IS_MOBILE = window.innerWidth <= 640;
const IS_DESKTOP = window.innerWidth > 800;
const IS_HEADER = IS_DESKTOP && window.innerHeight < 300;
// 8K - can restrict this if needed

const GRAVITY = 0.9; // Acceleration in px/s


export const COLOR = {
  Red : "#ff0043",
  Green : "#14fc56",
  Blue : "#1e7fff",
  Purple : "#e60aff",
  Gold : "#ffae00",
  White : "#ffffff"
};

// Special invisible color (not rendered, and therefore not in COLOR map)
const INVISIBLE = "_INVISIBLE_";

// Interactive state management
export const store = {
  _listeners : new Set (),
  _dispatch () {
    this._listeners.forEach (listener => listener (this.state))
  },

  state : {
    paused : false,
    longExposure : false,
    menuOpen : false,
    tap_launch : false,
    config : {
      shell : "Random",
      size : IS_DESKTOP && !IS_HEADER ? "3" : "1",
      autoLaunch : true,
      finale : false,
      hideControls : IS_HEADER
    }
  },

  setState (nextState) {
    this.state = Object.assign ({}, this.state, nextState);
    this._dispatch ();
    this.persist ();
  },

  subscribe (listener) {
    this._listeners.add (listener);
    return () => this._listeners.remove (listener);
  },

  // Load / persist select state to localStorage
  load () {
    if (localStorage.getItem ("schemaVersion") === "1") {
      this.state.config.size = JSON.parse (localStorage.getItem ("configSize"));
      this.state.config.hideControls = JSON.parse (localStorage.getItem ("hideControls"));
    }
  },

  persist () {
    localStorage.setItem ("schemaVersion", "1");
    localStorage.setItem ("configSize", JSON.stringify (this.state.config.size));
    localStorage.setItem ("hideControls", JSON.stringify (this.state.config.hideControls));
  }
};
const shellNameSelector = () => store.state.config.shell;
// Converts shell size to number.
const shellSizeSelector = () => +store.state.config.size;
const finaleSelector = () => store.state.config.finale;

if (!IS_HEADER) {
  store.load ();
}


// Constant derivations
const COLOR_NAMES = Object.keys (COLOR);
const COLOR_CODES = COLOR_NAMES.map (colorName => COLOR[colorName]);
// Invisible stars need an indentifier, even through they won"t be rendered - physics still apply.
const COLOR_CODES_W_INVIS = [... COLOR_CODES, INVISIBLE];
// Tuples is a map keys by color codes (hex) with values of { r, g, b } tuples (still just objects).
const COLOR_TUPLES = {};
COLOR_CODES.forEach (hex => {
  COLOR_TUPLES[hex] = {
    r : parseInt (hex.substr (1, 2), 16),
    g : parseInt (hex.substr (3, 2), 16),
    b : parseInt (hex.substr (5, 2), 16),
  };
});

// Get a random color.
function randomColorSimple () {
  return COLOR_CODES[Math.random () * COLOR_CODES.length | 0];
}

// Get a random color, with some customization options available.
let lastColor;

function randomColor (options) {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple ();

  // limit the amount of white chosen randomly
  if (limitWhite && color === COLOR.White && Math.random () < 0.6) {
    color = randomColorSimple ();
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple ();
    }
  }
  else if (notColor) {
    while (color === notColor) {
      color = randomColorSimple ();
    }
  }

  lastColor = color;
  return color;
}

// Helper used to semi-randomly spread particles over an arc
// Values are flexible - `start` and `arcLength` can be negative, and `randomness` is simply a multiplier for random addition.
function createParticleArc (start, arcLength, count, randomness, particleFactory) {
  const angleDelta = arcLength / count;
  // Sometimes there is an extra particle at the end, too close to the start. Subtracting half the angleDelta ensures that is skipped.
  // Would be nice to fix this a better way.
  const end = start + arcLength - (angleDelta * 0.5);

  if (end > start) {
    // Optimization: `angle=angle+angleDelta` vs. angle+=angleDelta
    // V8 deoptimises with let compound assignment
    for (let angle = start; angle < end; angle = angle + angleDelta) {
      particleFactory (angle + Math.random () * angleDelta * randomness);
    }
  }
  else {
    for (let angle = start; angle > end; angle = angle + angleDelta) {
      particleFactory (angle + Math.random () * angleDelta * randomness);
    }
  }
}


// Various star effects.
// These are designed to be attached to a star's `onDeath` event.
// Crossette breaks star into four same-color pieces which branch in a cross-like shape.
function crossetteEffect (star) {
  const startAngle = Math.random () * PI_HALF;
  createParticleArc (startAngle, PI_2, 4, 0.5, (angle) => {
    Star.add (
      star.x,
      star.y,
      star.color,
      angle,
      Math.random () * 0.6 + 0.75,
      600
    );
  });
}

// Flower is like a mini shell
function floralEffect (star) {
  const startAngle = Math.random () * PI_HALF;
  createParticleArc (startAngle, PI_2, 24, 1, (angle) => {
    Star.add (
      star.x,
      star.y,
      star.color,
      angle,
      // apply near cubic falloff to speed (places more particles towards outside)
      Math.pow (Math.random (), 0.45) * 2.4,
      1000 + Math.random () * 300,
      star.speedX,
      star.speedY
    );
  });
  // Queue burst flash render
  BurstFlash.add (star.x, star.y, 24);
}

// Floral burst with willow stars
function fallingLeavesEffect (star) {
  const startAngle = Math.random () * PI_HALF;
  createParticleArc (startAngle, PI_2, 12, 1, (angle) => {
    const newStar = Star.add (
      star.x,
      star.y,
      INVISIBLE,
      angle,
      // apply near cubic falloff to speed (places more particles towards outside)
      Math.pow (Math.random (), 0.45) * 2.4,
      2400 + Math.random () * 600,
      star.speedX,
      star.speedY
    );

    newStar.sparkColor = COLOR.Gold;
    newStar.sparkFreq = 72;
    newStar.sparkSpeed = 0.28;
    newStar.sparkLife = 750;
    newStar.sparkLifeVariation = 3.2;
  });
  // Queue burst flash render
  BurstFlash.add (star.x, star.y, 24);
}

// Crackle pops into a small cloud of golden sparks.
function crackleEffect (star) {
  createParticleArc (0, PI_2, 10, 1.8, (angle) => {
    Spark.add (
      star.x,
      star.y,
      COLOR.Gold,
      angle,
      // apply near cubic falloff to speed (places more particles towards outside)
      Math.pow (Math.random (), 0.45) * 2.4,
      300 + Math.random () * 200
    );
  });
}

// Actions
// ---------


function whiteOrGold () {
  return Math.random () < 0.5 ? COLOR.Gold : COLOR.White;
}


// Fullscreen helpers, using Fscreen for prefixes
function requestFullscreen () {
  if (fullscreenEnabled () && !isFullscreen ()) {
    fscreen.requestFullscreen (document.documentElement);
  }
}

function fullscreenEnabled () {
  return fscreen.fullscreenEnabled;
}

function isFullscreen () {
  return !!fscreen.fullscreenElement;
}


// Shell helpers
function makePistilColor (shellColor) {
  return (shellColor === COLOR.White || shellColor === COLOR.Gold) ? randomColor ({ notColor : shellColor }) : whiteOrGold ();
}

// Unique shell types
const crysanthemumShell = (size = 1) => {
  const glitter = Math.random () < 0.25;
  const singleColor = Math.random () < 0.68;
  const color = singleColor ? randomColor ({ limitWhite : true }) : [randomColor (), randomColor ({ notSame : true })];
  const pistil = singleColor && Math.random () < 0.42;
  const pistilColor = makePistilColor (color);
  const streamers = !pistil && color !== COLOR.White && Math.random () < 0.42;
  return {
    size : 300 + size * 100,
    starLife : 900 + size * 200,
    starDensity : glitter ? 1.1 : 1.5,
    color,
    glitter : glitter ? "light" : "",
    glitterColor : whiteOrGold (),
    pistil,
    pistilColor,
    streamers
  };
};


const palmShell = (size = 1) => ({
  size : 250 + size * 75,
  starDensity : 0.6,
  starLife : 1800 + size * 200,
  glitter : "heavy"
});

const ringShell = (size = 1) => {
  const color = randomColor ();
  const pistil = Math.random () < 0.75;
  return {
    ring : true,
    color,
    size : 300 + size * 100,
    starLife : 900 + size * 200,
    starCount : 2.2 * PI_2 * (size + 1),
    pistil,
    pistilColor : makePistilColor (color),
    glitter : !pistil ? "light" : "",
    glitterColor : color === COLOR.Gold ? COLOR.Gold : COLOR.White
  };
};

const crossetteShell = (size = 1) => {
  const color = randomColor ({ limitWhite : true });
  return {
    size : 300 + size * 100,
    starLife : 900 + size * 200,
    starLifeVariation : 0.22,
    color,
    crossette : true,
    pistil : Math.random () < 0.5,
    pistilColor : makePistilColor (color)
  };
};

const floralShell = (size = 1) => ({
  size : 300 + size * 120,
  starDensity : 0.38,
  starLife : 500 + size * 50,
  starLifeVariation : 0.5,
  color : Math.random () < 0.65 ? "random" : (Math.random () < 0.15 ? randomColor () : [randomColor (), randomColor ({ notSame : true })]),
  floral : true
});

const fallingLeavesShell = (size = 1) => ({
  color : INVISIBLE,
  size : 300 + size * 120,
  starDensity : 0.38,
  starLife : 500 + size * 50,
  starLifeVariation : 0.5,
  glitter : "medium",
  glitterColor : COLOR.Gold,
  fallingLeaves : true
});

const willowShell = (size = 1) => ({
  size : 300 + size * 100,
  starDensity : 0.7,
  starLife : 3000 + size * 300,
  glitter : "willow",
  glitterColor : COLOR.Gold,
  color : INVISIBLE
});

const crackleShell = (size = 1) => {
  // favor gold
  const color = Math.random () < 0.75 ? COLOR.Gold : randomColor ();
  return {
    size : 380 + size * 75,
    starDensity : 1,
    starLife : 600 + size * 100,
    starLifeVariation : 0.32,
    glitter : "light",
    glitterColor : COLOR.Gold,
    color,
    crackle : true,
    pistil : Math.random () < 0.65,
    pistilColor : makePistilColor (color)
  };
};

const horsetailShell = (size = 1) => {
  const color = randomColor ();
  return {
    horsetail : true,
    color,
    size : 250 + size * 38,
    starDensity : 0.85 + size * 0.1,
    starLife : 2500 + size * 300,
    glitter : "medium",
    glitterColor : Math.random () < 0.5 ? whiteOrGold () : color
  };
};

// Populate dropdowns
// shell type


function randomShellName () {
  return Math.random () < 0.6 ? "Crysanthemum" : shellNames[(Math.random () * (shellNames.length - 1) + 1) | 0];
}

function randomShell (size) {
  return shellTypes[randomShellName ()] (size);
}

function shellFromConfig (size) {
  return shellTypes[shellNameSelector ()] (size);
}


// Get a random shell, not including processing intensive varients
// Note this is only random when "Random" shell is selected in config.
// Also, this does not create the shell, only returns the factory function.
const fastShellBlacklist = ["Falling Leaves", "Floral", "Willow"];

function randomFastShell () {
  const isRandom = shellNameSelector () === "Random";
  let shellName = isRandom ? randomShellName () : shellNameSelector ();
  if (isRandom) {
    while (fastShellBlacklist.includes (shellName)) {
      shellName = randomShellName ();
    }
  }
  return shellTypes[shellName];
}


const shellTypes = {
  "Random" : randomShell,
  "Crackle" : crackleShell,
  "Crossette" : crossetteShell,
  "Crysanthemum" : crysanthemumShell,
  "Falling Leaves" : fallingLeavesShell,
  "Floral" : floralShell,
  "Horse Tail" : horsetailShell,
  "Palm" : palmShell,
  "Ring" : ringShell,
  "Willow" : willowShell
};


let shellNames = [];
shellNames = Object.keys (shellTypes);


export const BurstFlash = {
  active : [],
  _pool : [],
  _new () {
    return {}
  },
  add (x, y, radius) {
    const instance = this._pool.pop () || this._new ();

    instance.x = x;
    instance.y = y;
    instance.radius = radius;

    this.active.push (instance);
    return instance;
  },
  returnInstance (instance) {
    this._pool.push (instance);
  }
};


// Helper to generate objects for storing active particles.
// Particles are stored in arrays keyed by color (code, not name) for improved rendering performance.
function createParticleCollection () {
  const collection = {};
  COLOR_CODES_W_INVIS.forEach (color => {
    collection[color] = [];
  });
  return collection;
}

const Star = {
  // Visual properties
  drawWidth : 3,
  airDrag : 0.98,
  airDragHeavy : 0.992,

  // Star particles will be keyed by color
  active : createParticleCollection (),
  _pool : [],

  _new () {
    return {};
  },

  add (x, y, color, angle, speed, life, speedOffX, speedOffY) {
    const instance = this._pool.pop () || this._new ();

    instance.heavy = false;
    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin (angle) * speed + (speedOffX || 0);
    instance.speedY = Math.cos (angle) * speed + (speedOffY || 0);
    instance.life = life;
    instance.spinAngle = Math.random () * PI_2;
    instance.spinSpeed = 0.8;
    instance.spinRadius = 0;
    instance.sparkFreq = 0; // ms between spark emissions
    instance.sparkSpeed = 1;
    instance.sparkTimer = 0;
    instance.sparkColor = color;
    instance.sparkLife = 750;
    instance.sparkLifeVariation = 0.25;

    this.active[color].push (instance);
    return instance;
  },

  // Public method for cleaning up and returning an instance back to the pool.
  returnInstance (instance) {
    // Call onDeath handler if available (and pass it current star instance)
    instance.onDeath && instance.onDeath (instance);
    // Clean up
    instance.onDeath = null;
    // Add back to the pool.
    this._pool.push (instance);
  }
};


const Spark = {
  // Visual properties
  drawWidth : 0.75,
  airDrag : 0.9,

  // Star particles will be keyed by color
  active : createParticleCollection (),
  _pool : [],

  _new () {
    return {};
  },

  add (x, y, color, angle, speed, life) {
    const instance = this._pool.pop () || this._new ();

    instance.x = x;
    instance.y = y;
    instance.prevX = x;
    instance.prevY = y;
    instance.color = color;
    instance.speedX = Math.sin (angle) * speed;
    instance.speedY = Math.cos (angle) * speed;
    instance.life = life;

    this.active[color].push (instance);
    return instance;
  },

  // Public method for cleaning up and returning an instance back to the pool.
  returnInstance (instance) {
    // Add back to the pool.
    this._pool.push (instance);
  }
};


// Draw colored overlay based on combined brightness of stars (light up the sky!)
// Note: this is applied to the canvas container's background-color, so it's behind the particles
const currentSkyColor = { r : 0, g : 0, b : 0 };
const targetSkyColor = { r : 0, g : 0, b : 0 };

export function colorSky (speed, appNodes) {
  if (!appNodes) return;
  // The maximum r, g, or b value that will be used (255 would represent no maximum)
  const maxSkySaturation = 30;
  // How many stars are required in total to reach maximum sky brightness
  const maxStarCount = 500;
  let totalStarCount = 0;
  // Initialize sky as black
  targetSkyColor.r = 0;
  targetSkyColor.g = 0;
  targetSkyColor.b = 0;
  // Add each known color to sky, multiplied by particle count of that color. This will put RGB values wildly out of bounds, but we'll scale them back later.
  // Also add up total star count.
  COLOR_CODES.forEach (color => {
    const tuple = COLOR_TUPLES[color];
    const count = Star.active[color].length;
    totalStarCount += count;
    targetSkyColor.r += tuple.r * count;
    targetSkyColor.g += tuple.g * count;
    targetSkyColor.b += tuple.b * count;
  });

  // Clamp intensity at 1.0, and map to a custom non-linear curve. This allows few stars to perceivably light up the sky, while more stars continue to increase the brightness but at a lesser rate. This is more inline with humans' non-linear brightness perception.
  const intensity = Math.pow (Math.min (1, totalStarCount / maxStarCount), 0.3);
  // Figure out which color component has the highest value, so we can scale them without affecting the ratios.
  // Prevent 0 from being used, so we don't divide by zero in the next step.
  const maxColorComponent = Math.max (1, targetSkyColor.r, targetSkyColor.g, targetSkyColor.b);
  // Scale all color components to a max of `maxSkySaturation`, and apply intensity.
  targetSkyColor.r = targetSkyColor.r / maxColorComponent * maxSkySaturation * intensity;
  targetSkyColor.g = targetSkyColor.g / maxColorComponent * maxSkySaturation * intensity;
  targetSkyColor.b = targetSkyColor.b / maxColorComponent * maxSkySaturation * intensity;

  // Animate changes to color to smooth out transitions.
  const colorChange = 10;
  currentSkyColor.r += (targetSkyColor.r - currentSkyColor.r) / colorChange * speed;
  currentSkyColor.g += (targetSkyColor.g - currentSkyColor.g) / colorChange * speed;
  currentSkyColor.b += (targetSkyColor.b - currentSkyColor.b) / colorChange * speed;

  appNodes.canvasContainer.style.backgroundColor = `rgb(${currentSkyColor.r | 0}, ${currentSkyColor.g | 0}, ${currentSkyColor.b | 0})`;
}


//
// Sequences
// -----------

function getRandomShellSize () {
  const baseSize = shellSizeSelector ();
  const maxVariance = Math.min (2.5, baseSize);
  const variance = Math.random () * maxVariance;
  const size = baseSize - variance;
  const height = maxVariance === 0 ? Math.random () : 1 - (variance / maxVariance);
  const centerOffset = Math.random () * (1 - height * 0.65) * 0.5;
  const x = Math.random () < 0.5 ? 0.5 - centerOffset : 0.5 + centerOffset;
  return {
    size,
    x : fitShellPositionInBoundsH (x),
    height : fitShellPositionInBoundsV (height)
  };
}


function fitShellPositionInBoundsH (position) {
  const edge = 0.18;
  return (1 - edge * 2) * position + edge;
}

function fitShellPositionInBoundsV (position) {
  return position * 0.75;
}

function getRandomShellPositionH () {
  return fitShellPositionInBoundsH (Math.random ());
}

function getRandomShellPositionV () {
  return fitShellPositionInBoundsV (Math.random ());
}

export const ShellRandom = {
  getRandomShellPositionH,
  getRandomShellPositionV,
  New : function (canvas_stage, event_x) {
    const shell = new Shell (shellFromConfig (shellSizeSelector ()));
    shell.bindElements (canvas_stage, event_x);
    return shell;
  },
  generateShellOptionHtml (appNodesShellType) {
    // Populate dropdowns
    // shell type

    let options = "";
    shellNames.forEach (opt => options += `<option value="${opt}">${opt}</option>`);
    appNodesShellType.innerHTML = options;
  },
  generateSizeOptionHtml (appNodesHtml) {
    // shell size
    let options = "";
    ['3"', '5"', '6"', '8"', '12"'].forEach ((opt, i) => options += `<option value="${i}">${opt}</option>`);
    appNodesHtml.innerHTML = options;
  }
};

function seqRandomShell (stage, event) {
  const size = getRandomShellSize ();
  const shell = new Shell (shellFromConfig (size.size));
  shell.bindElements (stage, event);
  shell.launch (size.x, size.height);

  let extraDelay = shell.starLife;
  if (shell.fallingLeaves) {
    extraDelay = 4000;
  }

  return 900 + Math.random () * 600 + extraDelay;
}

function seqTwoRandom () {
  const size1 = getRandomShellSize ();
  const size2 = getRandomShellSize ();
  const shell1 = new Shell (shellFromConfig (size1.size));
  const shell2 = new Shell (shellFromConfig (size2.size));
  const leftOffset = Math.random () * 0.2 - 0.1;
  const rightOffset = Math.random () * 0.2 - 0.1;
  shell1.launch (0.3 + leftOffset, size1.height);
  shell2.launch (0.7 + rightOffset, size2.height);

  let extraDelay = Math.max (shell1.starLife, shell2.starLife);
  if (shell1.fallingLeaves || shell2.fallingLeaves) {
    extraDelay = 4000;
  }

  return 900 + Math.random () * 600 + extraDelay;
}

function seqTriple () {
  const shellType = randomFastShell ();
  const baseSize = shellSizeSelector ();
  const smallSize = Math.max (0, baseSize - 1.25);

  const offset = Math.random () * 0.08 - 0.04;
  const shell1 = new Shell (shellType (baseSize));
  shell1.launch (0.5 + offset, 0.7);

  const leftDelay = 1000 + Math.random () * 400;
  const rightDelay = 1000 + Math.random () * 400;

  setTimeout (() => {
    const offset = Math.random () * 0.08 - 0.04;
    const shell2 = new Shell (shellType (smallSize));
    shell2.launch (0.2 + offset, 0.1);
  }, leftDelay);

  setTimeout (() => {
    const offset = Math.random () * 0.08 - 0.04;
    const shell3 = new Shell (shellType (smallSize));
    shell3.launch (0.8 + offset, 0.1);
  }, rightDelay);

  return 4000;
}

function seqSmallBarrage () {
  seqSmallBarrage.lastCalled = Date.now ();
  const barrageCount = IS_DESKTOP ? 11 : 5;
  const shellSize = Math.max (0, shellSizeSelector () - 2);
  const useCrysanthemum = Math.random () < 0.7;

  // (cos(x*5π+0.5π)+1)/2 is a custom wave bounded by 0 and 1 used to set varying launch heights
  function launchShell (x) {
    const isRandom = shellNameSelector () === "Random";
    let shellType = isRandom ? (useCrysanthemum ? crysanthemumShell : randomFastShell ()) : shellTypes[shellNameSelector ()];
    const shell = new Shell (shellType (shellSize));
    const height = (Math.cos (x * 5 * Math.PI + PI_HALF) + 1) / 2;
    shell.launch (x, height * 0.75);
  }

  let count = 0;
  let delay = 0;
  while (count < barrageCount) {
    if (count === 0) {
      launchShell (0.5)
      count += 1;
    }
    else {
      const offset = (count + 1) / barrageCount / 2;
      setTimeout (() => {
        launchShell (0.5 + offset);
        launchShell (0.5 - offset);
      }, delay);
      count += 2;
    }
    delay += 200;
  }

  return 3400 + barrageCount * 120;
}

seqSmallBarrage.cooldown = 15000;
seqSmallBarrage.lastCalled = Date.now ();


const sequences = [
  seqRandomShell,
  seqTwoRandom,
  seqTriple,
  seqSmallBarrage
];


export const CanvasRenderProcess = {

  // Draw sparks
  spark : function (trailsCtx) {

    trailsCtx.lineWidth = Spark.drawWidth;
    trailsCtx.lineCap = "butt";

    COLOR_CODES.forEach (color => {
      const sparks = Spark.active[color];
      trailsCtx.strokeStyle = color;
      trailsCtx.beginPath ();
      sparks.forEach (spark => {
        trailsCtx.moveTo (spark.x, spark.y);
        trailsCtx.lineTo (spark.prevX, spark.prevY);
      });
      trailsCtx.stroke ();
    });
  },

  star : function (trailsCtx, mainCtx) {
    trailsCtx.lineWidth = Star.drawWidth;
    trailsCtx.lineCap = "round";
    mainCtx.strokeStyle = "#fff";
    mainCtx.lineWidth = 1;
    mainCtx.beginPath ();
    COLOR_CODES.forEach (color => {
      const stars = Star.active[color];
      trailsCtx.strokeStyle = color;
      trailsCtx.beginPath ();
      stars.forEach (star => {
        trailsCtx.moveTo (star.x, star.y);
        trailsCtx.lineTo (star.prevX, star.prevY);
        mainCtx.moveTo (star.x, star.y);
        mainCtx.lineTo (star.x - star.speedX * 1.6, star.y - star.speedY * 1.6);
      });
      trailsCtx.stroke ();
    });
    mainCtx.stroke ();
  },
  castleUp (stage_now) {
    const path = "mfireworkcity/imgs/castle.disney.png";
    stage_now.LoadImage (path);
  },
  speedStar (speed, timeStep) {

    const starDrag = 1 - (1 - Star.airDrag) * speed;
    const starDragHeavy = 1 - (1 - Star.airDragHeavy) * speed;
    const sparkDrag = 1 - (1 - Spark.airDrag) * speed;
    const gAcc = timeStep / 1000 * GRAVITY;


    COLOR_CODES_W_INVIS.forEach (color => {
      // Stars
      Star.active[color].forEach ((star, i, stars) => {
        star.life -= timeStep;
        if (star.life <= 0) {
          stars.splice (i, 1);
          Star.returnInstance (star);
        } else {
          star.prevX = star.x;
          star.prevY = star.y;
          star.x += star.speedX * speed;
          star.y += star.speedY * speed;
          // Apply air drag if star isn't "heavy". The heavy property is used for the shell comets.
          if (!star.heavy) {
            star.speedX *= starDrag;
            star.speedY *= starDrag;
          }
          else {
            star.speedX *= starDragHeavy;
            star.speedY *= starDragHeavy;
          }
          star.speedY += gAcc;

          if (star.spinRadius) {
            star.spinAngle += star.spinSpeed * speed;
            star.x += Math.sin (star.spinAngle) * star.spinRadius * speed;
            star.y += Math.cos (star.spinAngle) * star.spinRadius * speed;
          }

          if (star.sparkFreq) {
            star.sparkTimer -= timeStep;
            while (star.sparkTimer < 0) {
              star.sparkTimer += star.sparkFreq;
              Spark.add (
                star.x,
                star.y,
                star.sparkColor,
                Math.random () * PI_2,
                Math.random () * star.sparkSpeed,
                star.sparkLife * 0.8 + Math.random () * star.sparkLifeVariation * star.sparkLife
              );
            }
          }
        }
      });

      // Sparks
      Spark.active[color].forEach ((spark, i, sparks) => {
        spark.life -= timeStep;
        if (spark.life <= 0) {
          sparks.splice (i, 1);
          Spark.returnInstance (spark);
        } else {
          spark.prevX = spark.x;
          spark.prevY = spark.y;
          spark.x += spark.speedX * speed;
          spark.y += spark.speedY * speed;
          spark.speedX *= sparkDrag;
          spark.speedY *= sparkDrag;
          spark.speedY += gAcc;
        }
      });
    });

  },

  startSequence (isFirstSeq, stage, event) {
    if (isFirstSeq) {
      isFirstSeq = false;
      const shell = new Shell (crysanthemumShell (shellSizeSelector ()));
      shell.bindElements (stage, event);
      shell.launch (Math.random (), 0.5);
      return Math.random () * 5000 + 2400;
    }

    if (finaleSelector ()) {
      seqRandomShell (stage, event);
      if (currentFinaleCount < finaleCount) {
        currentFinaleCount++;
        return 170;
      }
      else {
        currentFinaleCount = 0;
        return 6000;
      }
    }

    const rand = Math.random ();

    if (rand < 0.2 && Date.now () - seqSmallBarrage.lastCalled > seqSmallBarrage.cooldown) {
      return seqSmallBarrage ();
    }

    if (rand < 0.6) {
      return seqRandomShell (stage, event);
    }
    else if (rand < 0.8) {
      return seqTwoRandom ();
    }
    else if (rand < 1) {
      return seqTriple ();
    }
  }
};
