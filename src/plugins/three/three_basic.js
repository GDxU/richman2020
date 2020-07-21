import * as THREE from 'three';

import * as Stats from "three/examples/js/libs/stats.min.js";
import * as dat from "three/examples/js/libs/dat.gui.min.js";

/*
require ('../../plugins/three/renderers/shaders/ConvolutionShader');
require ('../../plugins/three/renderers/shaders/CopyShader');
require ('../../plugins/three/renderers/shaders/FilmShader');
require ('../../plugins/three/renderers/postprocessing/EffectComposer');
require ('../../plugins/three/renderers/postprocessing/ShaderPass');
require ('../../plugins/three/renderers/postprocessing/MaskPass');
require ('../../plugins/three/renderers/postprocessing/RenderPass');
require ('../../plugins/three/renderers/postprocessing/BloomPass');
require ('../../plugins/three/renderers/postprocessing/FilmPass');

*/

import ColladaLoader from '../../plugins/three/importmodels/collada'
import { TimelineLite } from "gsap";
/*

function parseBool (val) {
    return val === true || val === "true"
}
*/

export default {
    props : ["object_axis"],
    mounted () {
        // this.debug = parseBool (this.debug);
        // console.log ("update now in mounted...");
        if (window === undefined) return;

        this.$GSLite = new TimelineLite ();
        this.stats = new Stats ();
        const loader = new THREE.TextureLoader ();
        if (this.mode != undefined) {
            this.gsx.mode = this.mode;
        }
        loader.crossOrigin = "";
        this.$nextTick (() => {
            //   console.log ("update now in mounted... 2222");
            loader.load ("/textures/glow.png", (glowMap) => {
                this.textures.push (glowMap);
               // console.log (glowMap);
                window.addEventListener ("resize", this.resizeWindow, false);
                this.resizeWindow ();
                this.init ();
            });
        });
    },

    destroyed () {
        this.textures = [];
        this.renderer = null;
        this.camera = null;
        this.tube = null;
        this.geometry = null;
        this.scene = null;
        this.uniforms = null;
        this.podskipper = null;
        this.stats = null;
        //   if (this.gui != undefined)
        //     this.gui.remove ();
        if (window === undefined) return;
        window.cancelAnimationFrame (this.frame_action)
    },

    data () {
        return {
            textures : [],
            scene : null,
            path : null,
            camera : null,
            renderer : null,
            geometry : null,
            light : null,
            frame_action : null,
            tube : null,
            podskipper : null,
            uniforms : {},
            camera_list : [],
            color_background : 0,
            height : 300,
            width : 500,
            timer_01 : null,
            rotObjectMatrix : null,
            rotWorldMatrix : null,
            loaded : false,
            stats : null,
            gui : null,
            // debug : false,
        };
    },
    methods : {
        init () {
            /*  this.timer_01 = setInterval (() => {
                    this.change_color ();
                }, 5000);*/
            // Basic material
            // const lamber_materiax = this.getNormalMeshLambertMaterial ();
            // const lava_mat = this.getShaderMaterial ();
        },
        generate_all_ex () {

            const scene = new THREE.Scene ();

            const camera = new THREE.PerspectiveCamera (65, this.width / this.height, 0.01, 1000);
            camera.position.z = 400;

            const ambient = new THREE.AmbientLight (0xffffff, 0.75);
            scene.add (ambient);

            const point_light = new THREE.PointLight (0xffffff, 0.79, 100);
            scene.add (point_light);

            // Create a WebGL renderer

            const renderer = new THREE.WebGLRenderer ({ antialias : true });
            renderer.setSize (this.width, this.height);

            const axisHelper = new THREE.AxesHelper (800);

            const collada_loader = new ColladaLoader ();
            collada_loader.options.convertUpAxis = true;

            // console.log ("complete_loading 22222");
            return {
                scene,
                camera,
                renderer,
                //other optional items
                point_light,
                ambient,
                axisHelper,
                collada_loader,
            };

        },
        resizeWindow () {
            if (window === undefined) return;
            const a = window.innerWidth;
            const b = window.innerHeight;
            if (this.camera != undefined) {
                this.camera.aspect = a / b;
                this.camera.updateProjectionMatrix ();
            }
            if (this.renderer != undefined) this.renderer.setSize (a, b);
            if (this.composer != undefined) this.composer.reset ();
        },
        /**
         * do not change this part.
         * @param collada model ex
         */
        loaded_file_adjustment (scene3, loaded_data3, { x, y, z }) {
            const target_object = loaded_data3.scene;
            target_object.scale.x = x;
            target_object.scale.y = y;
            target_object.scale.z = z;
            scene3.add (target_object);
            if (this.debug) {
                const axisHelper = new THREE.AxesHelper (800);
                target_object.add (axisHelper);
            }
            return target_object;
        },
        initGUI (gui) {

        },
        loadGUIDebug () {
            if (!this.debug) return;
            const GUI = new dat.GUI ({
                load : JSON,
                preset : "Flow"
            });
            this.initGUI (GUI);
            this.gui = GUI;
        },
        loading_end () {
            this.loadGUIDebug ();
            const { tunnelkgt } = this.$refs;
            //   const content = document.getElementById ("kgtunnel-content");
            tunnelkgt.appendChild (this.renderer.domElement);
            if (this.debug) {
                tunnelkgt.appendChild (this.stats.domElement);
            }
            this.animate ();
            this.loaded = true;
        },
    },

};
