<template>
  <div class="sprite_fi32">
    <!-- SVG Spritesheet -->
    <div style="height: 0; width: 0; position: absolute; visibility: hidden;">
      <svg xmlns="http://www.w3.org/2000/svg">
        <symbol id="icon-play" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </symbol>
        <symbol id="icon-pause" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </symbol>
        <symbol id="icon-close" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </symbol>
        <symbol id="icon-settings" viewBox="0 0 24 24">
          <path
            d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </symbol>
        <symbol id="icon-shutter-fast" viewBox="0 0 24 24">
          <path
            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </symbol>
        <symbol id="icon-shutter-slow" viewBox="0 0 24 24">
          <path
            d="M1 5h2v14H1zm4 0h2v14H5zm17 0H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11z"/>
        </symbol>
      </svg>
    </div>

    <!-- App -->
    <div class="firework_canvas_container">
      <div ref="loading-init" v-if="isLoading">Loading...</div>
      <div id="stage-container" ref="_stageCcontainer" v-if="!isLoading">
        <div id="canvas-container" ref="_canvasContainer">
          <canvas ref="_trail"></canvas>
          <canvas ref="_mainCanvas"></canvas>
          <canvas ref="_backdrop"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CanvasRenderProcess,
    Stage,
    Ticker,
    colorSky,
    BurstFlash,
    store,
    COLOR,
    ShellRandom
  } from "../../plugins/three/assets/mymath";

  import * as Stats from "three/examples/js/libs/stats.min.js";
  import * as dat from "three/examples/js/libs/dat.gui.min.js";

  const MAX_WIDTH = 7680;
  const MAX_HEIGHT = 4320;

  // Selectors
  // -----------
  const canInteract = () => store.state.tap_launch;

  export default {
    name : "bg_firework_v3",
    data () {
      return {
        stages : [],
        // Render app UI / keep in sync with state
        appNodes : {
          stageContainer : '_stageCcontainer',
          canvasContainer : '_canvasContainer',
          canvasTrail : "_trail",
          canvasMain : "_mainCanvas",
          canvasBackground : "_backdrop",
          controls : 'controls',
          menu : 'menu',
          pauseBtn : 'pause-btn',
          //pauseBtnSVG : 'pause-btn use',
          shutterBtn : 'shutter-btn',
          // shutterBtnSVG : 'shutter-btn use',
          shellType : 'shell-type',
          shellSize : 'shell-size',
          autoLaunch : 'auto-launch',
          autoLaunchLabel : 'auto-launch-label',
          finaleMode : 'finale-mode',
          finaleModeLabel : 'finale-mode-label',
          hideControls : 'hide-controls',
          hideControlsLabel : 'hide-controls-label'
        },
        speedBarOpacity : 0,
        autoLaunchTime : 1,
        activePointerCount : 0,
        isUpdatingSpeed : false,
        isFirstSeq : true,
        finaleCount : 32,
        currentFinaleCount : 0,
        simSpeed : 1,
        interval_time : 1000,
        isLoading : true,
        useKeyboard : false,
        isNowAuto : false,
      }
    },
    methods :
      {
        Pause () {
          store.setState ({ paused : true });
        },
        Resume () {
          store.setState ({ paused : false });
        },
        LongExposure () {
          store.setState ({ longExposure : true });
        },
        UnLongExposure () {
          store.setState ({ longExposure : false });
        },
        CanTapLaunch (bool) {
          store.setState ({ tap_launch : bool });
        },
        SetIntervalTimer (seconds) {
          this.interval_time = seconds;
        },
        AutoMaker () {
          this.isNowAuto = true;
          this.randomLaunches ()
        },
        StopAuto () {
          this.isNowAuto = false;
        },
        // Launches a shell from a user pointer event, based on state.config
        launchShellFromConfig (event) {
          const mainStage = this.stages[1];
          const shell = ShellRandom.New (mainStage, this);
          const w = mainStage.width;
          const h = mainStage.height;
          shell.launch (
            event ? event.x / w : ShellRandom.getRandomShellPositionH (),
            event ? 1 - event.y / h : ShellRandom.getRandomShellPositionV ()
          );
        },
        randomLaunches () {
          const that = this;
          if (that.isNowAuto) {
            let w = Math.random () * 1000 * 2 + that.interval_time;
            const mainStage = that.stages[1];
            const shell = ShellRandom.New (mainStage, that);
            shell.launch (
              ShellRandom.getRandomShellPositionH (),
              ShellRandom.getRandomShellPositionV ()
            );
            setTimeout (function () {
              that.randomLaunches ()
            }, w)
          }
        },
        updateSpeedFromEvent (event) {
          const mainStage = this.stages[1];
          if (this.isUpdatingSpeed || event.y >= mainStage.height - 44) {
            // On phones it's hard to hit the edge pixels in order to set speed at 0 or 1, so some padding is provided to make that easier.
            const edge = 16;
            const newSpeed = (event.x - edge) / (mainStage.width - edge * 2);
            this.simSpeed = Math.min (Math.max (newSpeed, 0), 1);
            // show speed bar after an update
            this.speedBarOpacity = 1;
            // If we updated the speed, return true
            return true;
          }
          // Return false if the speed wasn't updated
          return false;
        },


        togglePause (toggle) {
          if (!this.useKeyboard) return;
          if (typeof toggle === 'boolean') {
            store.setState ({ paused : toggle });
          } else {
            store.setState ({ paused : !store.state.paused });
          }
        },

        toggleLongExposure (toggle) {
          if (!this.useKeyboard) return;
          if (typeof toggle === 'boolean') {
            store.setState ({ longExposure : toggle });
          } else {
            store.setState ({ longExposure : !store.state.longExposure });
          }
        },

        toggleMenu (toggle) {
          if (!this.useKeyboard) return;
          if (typeof toggle === 'boolean') {
            store.setState ({ menuOpen : toggle });
          } else {
            store.setState ({ menuOpen : !store.state.menuOpen });
          }
        },

        updateConfig (nextConfig) {
          nextConfig = nextConfig || this.getConfigFromDOM ();
          store.setState ({
            config : Object.assign ({}, store.state.config, nextConfig)
          });
        },

        update (frameTime, lag) {
          // if (!canInteract ()) return;
          //   const mainStage = this.stages[1];
          //     const { width, height } = mainStage;
          const timeStep = frameTime * this.simSpeed;
          const speed = this.simSpeed * lag;
          this.updateGlobals (timeStep, lag);
          CanvasRenderProcess.speedStar (speed, timeStep);
          this.render (speed);

        },

        handlePointerStart (event) {
          this.activePointerCount++;
          const btnSize = 44;
          const mainStage = this.stages[1];

          if (event.y < btnSize) {
            if (event.x < btnSize) {
              this.togglePause ();
              return;
            }

            if (event.x > mainStage.width / 2 - btnSize / 2 && event.x < mainStage.width / 2 + btnSize / 2) {
              this.toggleLongExposure ();
              return;
            }
            if (event.x > mainStage.width - btnSize) {
              this.toggleMenu ();
              return;
            }
          }

          if (!canInteract ()) return;

          if (this.updateSpeedFromEvent (event)) {
            this.isUpdatingSpeed = true;
          }
          else if (event.onCanvas) {
            this.launchShellFromConfig (event);
          }
        },

        handlePointerEnd (event) {
          this.activePointerCount--;
          this.isUpdatingSpeed = false;
        },

        handlePointerMove (event) {
          if (!canInteract ()) return;

          if (this.isUpdatingSpeed) {
            this.updateSpeedFromEvent (event);
          }
        },

        handleKeydown (event) {
          // P
          if (event.keyCode === 80) {
            this.togglePause ();
          }
          // O
          else if (event.keyCode === 79) {
            this.toggleMenu ();
          }
          // Esc
          else if (event.keyCode === 27) {
            this.toggleMenu (false);
          }
        },


        // Extracted function to keep `update()` optimized
        updateGlobals (timeStep, lag) {
          // Always try to fade out speed bar
          if (!this.isUpdatingSpeed) {
            this.speedBarOpacity -= lag / 30; // half a second
            if (this.speedBarOpacity < 0) {
              this.speedBarOpacity = 0;
            }
          }

          // auto launch shells
          if (store.state.config.autoLaunch) {
            this.autoLaunchTime -= timeStep;
            if (this.autoLaunchTime <= 0) {
              this.autoLaunchTime = CanvasRenderProcess.startSequence (this.isFirstSeq, this.stages[1], this);
            }
          }
        },

        handleResize () {
          const w = window.innerWidth;
          const h = window.innerHeight;
          // Try to adopt screen size, heeding maximum sizes specified
          const containerW = Math.min (w, MAX_WIDTH);
          // On small screens, use full device height
          const containerH = w <= 420 ? h : Math.min (h, MAX_HEIGHT);
          this.appNodes.stageContainer.style.width = containerW + "px";
          this.appNodes.stageContainer.style.height = containerH + "px";
          this.stages.forEach (stage => stage.resize (containerW, containerH));
        },

        render (speed) {
          const mainStage = this.stages[1];
          const trailsStage = this.stages[0];
         // const backdrop = this.stages[2];
          const { dpr, width, height } = mainStage;
          const trailsCtx = trailsStage.ctx;
          const mainCtx = mainStage.ctx;
          const backdropCtx = mainStage.ctx;
          colorSky (speed, this.appNodes);
          trailsCtx.scale (dpr, dpr);
          mainCtx.scale (dpr, dpr);
        //  backdropCtx.scale (dpr, dpr);
          trailsCtx.globalCompositeOperation = "source-over";
          trailsCtx.fillStyle = `rgba(0, 0, 0, ${store.state.longExposure ? 0.0025 : 0.1 * speed})`;
          trailsCtx.fillRect (0, 0, width, height);
          // Remaining drawing on trails canvas will use 'lighten' blend mode
          trailsCtx.globalCompositeOperation = "lighten";
          mainCtx.clearRect (0, 0, width, height);
          // Draw queued burst flashes
          while (BurstFlash.active.length) {
            const bf = BurstFlash.active.pop ();
            const burstGradient = trailsCtx.createRadialGradient (bf.x, bf.y, 0, bf.x, bf.y, bf.radius);
            burstGradient.addColorStop (0.05, "white");
            burstGradient.addColorStop (0.25, "rgba(255, 160, 20, 0.2)");
            burstGradient.addColorStop (1, "rgba(255, 160, 20, 0)");
            trailsCtx.fillStyle = burstGradient;
            trailsCtx.fillRect (bf.x - bf.radius, bf.y - bf.radius, bf.radius * 2, bf.radius * 2);
            BurstFlash.returnInstance (bf);
          }
          // Draw stars
          CanvasRenderProcess.star (trailsCtx, mainCtx);
          // Draw sparks
          CanvasRenderProcess.spark (trailsCtx);
          // Render speed bar if visible
          if (this.speedBarOpacity) {
            const speedBarHeight = 6;
            mainCtx.globalAlpha = this.speedBarOpacity;
            mainCtx.fillStyle = COLOR.Blue;
            mainCtx.fillRect (0, height - speedBarHeight, width * this.simSpeed, speedBarHeight);
            mainCtx.globalAlpha = 1;
          }
          //CanvasRenderProcess.castleUp (backdrop);
          backdropCtx.globalCompositeOperation ="screen";
          trailsCtx.resetTransform ();
          mainCtx.resetTransform ();
          //backdropCtx.resetTransform ();
        },
        getConfigFromDOM () {
          return {
            shell : this.appNodes.shellType.value,
            size : this.appNodes.shellSize.value,
            autoLaunch : this.appNodes.autoLaunch.checked,
            finale : this.appNodes.finaleMode.checked,
            hideControls : this.appNodes.hideControls.checked
          };
        },
        renderApp (state) {
          //  this.appNodes.pauseBtnSVG.setAttribute ('href', `#icon-${state.paused ? 'play' : 'pause'}`);
          //  this.appNodes.shutterBtnSVG.setAttribute ('href', `#icon-shutter-${state.longExposure ? 'fast' : 'slow'}`);
          //  this.appNodes.controls.classList.toggle ('hide', state.menuOpen || state.config.hideControls);
          //  this.appNodes.canvasContainer.classList.toggle ('blur', state.menuOpen);
          //  this.appNodes.menu.classList.toggle ('hide', !state.menuOpen);
          //  this.appNodes.finaleModeLabel.style.opacity = state.config.autoLaunch ? 1 : 0.32;
          //  this.appNodes.shellType.value = state.config.shell;
          //  this.appNodes.shellSize.value = state.config.size;
          //  this.appNodes.autoLaunch.checked = state.config.autoLaunch;
          //  this.appNodes.finaleMode.checked = state.config.finale;
          //  this.appNodes.hideControls.checked = state.config.hideControls;

        },
        initialization () {
          const reflist = this.$refs;
          //  console.log ("work 1", document);
          // Convert appNodes selectors to dom nodes
          //   const listAppNode = {};
          Object.keys (this.appNodes).forEach (key => {
            if (reflist.hasOwnProperty (this.appNodes[key])) {
              this.appNodes[key] = reflist[this.appNodes[key]]
            }
          });

          //  this.appNodes = listAppNode;
          //  console.log ("work 2", reflist);
          //  Remove loading state
          //  document.getElementById ('loading-init').remove ();
          //  console.log ("work 3", this.appNodes);
          //  ShellRandom.generateShellOptionHtml (this.appNodes.shellType);
          //  ShellRandom.generateSizeOptionHtml (this.appNodes.shellSize);
          //  console.log ("work 4", listAppNode);

          this.renderApp (store.state);
          // First render is called in init()
          //  this.renderApp (state);
          store.subscribe (this.renderApp);

          //console.log ("work 41", listAppNode);
          /*  const updateConfigNoEvent = () => this.updateConfig ();
            this.appNodes.shellType.addEventListener ('input', updateConfigNoEvent);
            this.appNodes.shellSize.addEventListener ('input', updateConfigNoEvent);
            this.appNodes.autoLaunchLabel.addEventListener ('click', () => setTimeout (this.updateConfig, 0));
            this.appNodes.finaleModeLabel.addEventListener ('click', () => setTimeout (this.updateConfig, 0));
            this.appNodes.hideControlsLabel.addEventListener ('click', () => setTimeout (this.updateConfig, 0)); */

          const ticker_x = new Ticker (this.stats);
          const trailsStage = new Stage (this.appNodes.canvasTrail, window, document, ticker_x);
          const mainStage = new Stage (this.appNodes.canvasMain, window, document, ticker_x);
         // const backdrop = new Stage (this.appNodes.canvasBackground, window, document, ticker_x);
          //   console.log ("work trailsStage", trailsStage);

          this.stages = [
            trailsStage,
            mainStage,
            //     backdrop
          ];

          // Fill trails canvas with black to start.
          trailsStage.ctx.fillStyle = "#000";
          trailsStage.ctx.fillRect (0, 0, trailsStage.width, trailsStage.height);
          mainStage.addEventListener ("pointerstart", this.handlePointerStart);
          mainStage.addEventListener ("pointerend", this.handlePointerEnd);
          // mainStage.addEventListener ("touchend", this.handlePointerStart);
          mainStage.addEventListener ("pointermove", this.handlePointerMove);
          window.addEventListener ("keydown", this.handleKeydown);
          // Try to go fullscreen upon a touch
          // window.addEventListener ("touchend", (event) => !IS_DESKTOP && requestFullscreen ());
          // console.log ("work 44", listAppNode);


          // Compute initial dimensions
          this.handleResize ();
          //  console.log ("work 45", this.stages);

          window.addEventListener ("resize", this.handleResize);
          mainStage.addEventListener ("ticker", this.update);
          // Dynamic globals
          // init ();
          //   console.log ("work 46", listAppNode);

          // appNodes.stageContainer.classList.remove ("remove");
        }

      }
    ,
    mounted () {
      if (!document) return;
      if (!window) return;
      this.isLoading = false;
      this.stats = new Stats ();
      this.$nextTick (() => {

        // if (this.debug) {
        const { _canvasContainer } = this.$refs;
        _canvasContainer.appendChild (this.stats.domElement);
        // }

        this.initialization ();

      });
    }
  }
</script>

<style scoped lang="scss">
  $small-bp: 640px;
  $large-bp: 800px;

  $ui-opacity: 0.5;
  $ui-color: rgba(#fff, $ui-opacity);
  $font: 'EMX', arial, sans-serif;
  $letter-spacing: 0.06em;

  @mixin background_color_canvas_firework() {
    background-color: #000;
    overflow: hidden;
    color: $ui-color;
    font-family: $font;
    line-height: 1.25;
    letter-spacing: $letter-spacing;
  }

  .firework_canvas_container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    @include background_color_canvas_firework;
  }

  // Utils
  // -------

  .hide {
    opacity: 0;
    visibility: hidden;
  }

  .remove {
    display: none;
  }

  .blur {
    filter: blur(12px);
  }

  #loading-init {
    width: 100%;
    align-self: center;
    text-align: center;
    font-size: 2em;
  }

  #stage-container {
    // Keep menu blur contained
    overflow: hidden;
    // Let border width add to size
    box-sizing: initial;
    border: 1px solid #222;
    // Allow border to be hidden when fullscreen
    margin: -1px;
  }

  #canvas-container {
    width: 100%;
    height: 100%;
    transition: filter 0.3s;

    canvas {
      position: absolute;
      // Use lighten blend mode so the sky can be shown lighting up behind the canvases.
      mix-blend-mode: lighten;
    }
  }

  #controls {
    position: absolute;
    top: 0;
    width: 100%;
    padding-bottom: 50px;
    display: flex;
    justify-content: space-between;
    transition: opacity 0.3s, visibility 0.3s;

    @media (min-width: $large-bp) {
      visibility: visible;

      &.hide:hover {
        opacity: 1;
      }
    }
  }

  #menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.42);
    transition: opacity 0.3s, visibility 0.3s;

    &__header {
      padding: 20px 0 44px;
      font-size: 2em;
      text-transform: uppercase;
    }

    form {
      width: 240px;
      padding: 0 20px;
      overflow: auto;
    }

    .form-option {
      margin: 20px 0;

      label {
        text-transform: uppercase;
      }

      &--select {
        label {
          display: block;
          margin-bottom: 6px;
        }

        select {
          display: block;
          width: 100%;
          height: 30px;
          font-size: 1rem;
          font-family: $font;
          color: $ui-color;
          letter-spacing: $letter-spacing;
          background-color: transparent;
          border: 1px solid $ui-color;

          option {
            background-color: black;
          }
        }
      }

      &--checkbox {
        label {
          display: flex;
          align-items: center;
          transition: opacity 0.3s;
          user-select: none;
        }

        input {
          display: block;
          width: 20px;
          height: 20px;
          margin-right: 8px;
          opacity: $ui-opacity;
        }
      }

      @media (max-width: $large-bp) {
        select, input {
          outline: none;
        }
      }
    }
  }

  #close-menu-btn {
    position: absolute;
    top: 0;
    right: 0;
  }

  .btn {
    $size: 44px;
    opacity: 0.16;
    width: $size;
    height: $size;
    display: flex;
    user-select: none;
    cursor: default;
    transition: opacity 0.3s;

    &--bright {
      opacity: 0.5;
    }

    @media (min-width: $large-bp) {
      &:hover {
        opacity: 0.32;
      }

      &--bright:hover {
        opacity: 0.75;
      }
    }

    svg {
      display: block;
      margin: auto;
    }
  }
</style>
