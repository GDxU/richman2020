<template>
    <div>
        <div id="loading_x" v-show="!loaded"><span>Loading..</span></div>
        <div ref="tunnelkgt"></div>
    </div>
</template>
<style lang="scss" scoped>
    #loading_x {
        width: 100%;
        height: 100%;
        background-color: black;
        span {
            font-color: white;
            font-size: 33px;
        }
    }
</style>
<script>
    import * as THREE from "three";
    import Skeleton from "../../plugins/mixins/mixinbb/bbGameAnimationSkeleton";
    import BasicThreeImplementation from "../../plugins/three/three_basic";
    import { fighters } from "../../plugins/three/assets/fighters";
    import { Generator, Math3 } from "../../plugins/three/assets/field_generations";

    require ("../../plugins/three/renderers/shaders/ConvolutionShader");
    require ("../../plugins/three/renderers/shaders/CopyShader");
    require ("../../plugins/three/renderers/shaders/FilmShader");
    require ("../../plugins/three/renderers/postprocessing/EffectComposer");
    require ("../../plugins/three/renderers/postprocessing/ShaderPass");
    require ("../../plugins/three/renderers/postprocessing/MaskPass");
    require ("../../plugins/three/renderers/postprocessing/RenderPass");
    require ("../../plugins/three/renderers/postprocessing/BloomPass");
    require ("../../plugins/three/renderers/postprocessing/FilmPass");


    function getUntilVec3 () {
        const up = new THREE.Vector3 (0, 1, 0);
        const forward = new THREE.Vector3 (0, 0, 1);
        const til = new THREE.Vector3 (1, 0, 0);
        return {
            up, forward, til
        }
    }

    function LoadingAssets () {

    }

    export default {
        name : "kbtunnel",
        mixins : [BasicThreeImplementation, Skeleton],
        //  props : ["fighter_name", "track_series", "mode", "debug"],

        props : {
            // 基础的类型检查 (`null` 匹配任何类型)
            /* fighter_name : {
                 type : String,
                 required : false,
             },*/
            // 多个可能的类型
            track_series : {
                type : Array,
                required : true,
            },
            // 必填的字符串
            mode : {
                type : Number,
                default : 0,
                required : false,
            },
            // 带有默认值的数字
            debug : {
                type : Boolean,
                default : false,
            },
        },
        data () {
            return {
                gsx : {
                    //0 - auto fly
                    //1 - control fly by given delta
                    mode : 0,
                    game_state : 88,
                    moveSpeed : 0,
                    fly_y : 0,
                    distance_z : 9.0003,
                    distance_y : 9.0003,
                    vel_mag : 0,
                    current_track_position_linear : 0,
                    total_dis : 0,
                    oldpos : new THREE.Vector3 (0, 0, 0),
                    top_speed : 1.10,
                    cam_x : 0,
                    rot : 30,
                    normalized_sp : 0,
                },
                fighter_name : "",
                camlist : ["front_cam", "game_play_start_cam", "game_play_ultimate_cam", "preview_cam", "first_person", "top_view"],
                guide : null
            };
        },
        methods : {
            clearData () {
                this.gsx.mode = 1;
                this.gsx.moveSpeed = 0.001;
                this.changeCamera ("top_view");
            },
            pushFactor (a, seed) {
                this.gsx.moveSpeed = a / 5;
            },
            updateState (x) {
                this.gsx.game_state = x;
            },
            startJump (bool) {
                if (bool) {
                    this.gsx.mode = 1;
                } else {
                    this.gsx.mode = 2;
                }
                this.changeCamera ("game_play_start_cam");
            },
            ready () {
                this.easeStopSpeed (0.001);
            },
            kill () {
                //  this.gsx.mode = 0;
                this.easeStopSpeed (0.0001);
            },
            easeStopSpeed (target_speed) {
                this.$GSLite.to (this.gsx, 2, { moveSpeed : target_speed, ease : Power1.easeOut, delay : 0 });
            },
            speedPass () {
                let look_delta = 10;
                let x = this.gsx.moveSpeed * (this.gsx.normalized_sp - 0.7) / 0.3;

                if (x >= this.gsx.top_speed) {
                    x = this.gsx.top_speed;
                }

                if (this.gsx.mode === 1) {
                    this.gsx.current_track_position_linear += x;
                } else if (this.gsx.mode === 0) { // debug use only
                    this.gsx.current_track_position_linear += x;
                } else if (this.gsx.mode === 2) {
                    this.gsx.current_track_position_linear += x; // Speed
                } else if (this.gsx.mode === 3) {
                    this.gsx.current_track_position_linear += 1;
                } else {
                    this.gsx.current_track_position_linear += .5;
                }
                // this.gsx.current_track_position_linear = this.gsx.current_track_position_linear % this.gsx.total_dis;
                const craft_position_pec = this.gsx.current_track_position_linear / this.gsx.total_dis % 1;
                const camera_look_pec = (this.gsx.current_track_position_linear + 2) / this.gsx.total_dis % 1;
                const craft_predict_pec = (this.gsx.current_track_position_linear + look_delta) / this.gsx.total_dis % 1;

                let a = this.path.getPointAt (craft_position_pec);
                let b = this.path.getPointAt (craft_predict_pec);
                /*   let xa = new THREE.Vector3 (a.x, a.y, a.z);
                   let xb = new THREE.Vector3 (b.x, b.y, b.z);
                   console.log (xa, xb); */
                this.gsx.normalized_sp = a.distanceTo (b) / look_delta - 0.1170;
                // this.gsx.fly_y = Math.cos (this.percentage * Math.PI * 2 * 20) * 2;
                //  console.log ("del_dis_normalized", del_dis_normalized);
                // this.gsx.normalized_sp = del_dis_normalized;
                //  this.gsx.moveSpeed = this.gsx.moveSpeed * (0.9 * del_dis_normalized + 0.1);
                return {
                    camera_look_pec,
                    craft_predict_pec,
                    craft_position_pec,
                }
            },
            getFromRouteJ () {
                const that = this;
                const _fighte = that.$route.query.j;
                //  console.log (_fighte);
                if (_fighte !== "") {
                    if (fighters.hasOwnProperty (_fighte)) {
                        return _fighte;
                    }
                }
                return false;
            },
            init () {
                //const dotMap = await this.textureLoader.load ("https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/dotTexture.png");

                const { point_light, camera, scene, renderer, collada_loader } = this.generate_all_ex ();
                const { path, geometry, total_track_distance, CameraPositions } = Generator.RenderTrack (this.track_series);
                //   var lavalMaterial = this.getShaderMaterial ();
                //this.tube = new THREE.Mesh (this.geometry, lamber_materiax);
                // Material for the points
                const material_simple = new THREE.PointsMaterial ();
                /**/
                /*
                                const material_matp = new THREE.PointsMaterial ({
                                    size : 0.3,
                                    map : this.textures[0],
                                    vertexColors : THREE.VertexColors,
                                    sizeAttenuation : true,
                                    transparent : true,
                                    opacity : 0.7
                                });*/

                this.tube = new THREE.Points (geometry, material_simple);
                const { particleSystem } = Generator.StarGenerator ();
                scene.add (this.tube);
                scene.add (particleSystem);

                const renderModel = new THREE.RenderPass (scene, camera);
                renderModel.renderToScreen = true;
                //  const effectBloom = new THREE.BloomPass (0.7221);
                //effectBloom.renderToScreen = true;
                const effectFilm = new THREE.FilmPass (0.215, 0.95, 2048, false);
                //effectFilm.renderToScreen = true;
                const composer = new THREE.EffectComposer (renderer);
                composer.addPass (renderModel);
                //composer.addPass (effectBloom);
                //composer.addPass (effectFilm);
                this.light = point_light;
                this.path = path;
                this.geometry = geometry;
                this.composer = composer;
                this.scene = scene;
                this.camera = camera;
                this.camera_list = CameraPositions;
                this.renderer = renderer;
                this.gsx.total_dis = total_track_distance;
                if (!this.getFromRouteJ ()) {
                    this.fighter_name = "Tempest";
                } else {
                    this.fighter_name = this.getFromRouteJ ();
                }
                const fight = fighters[this.fighter_name];
                this.gsx.top_speed = fight.maxSpeed;
                // console.log (fight);
                collada_loader.load (fight.path, (x) => {
                    this.podskipper = this.loaded_file_adjustment (scene, x, fight.scale);
                    // this.guide = this.lineFromTo ();
                    this.loading_end ();
                });
                // console.log ("complete_loading 5");
            },

            initGUI (gui) {
                if (!this.debug) return;
                const that = this;
                // let gui = new Dat.dat.GUI ();
                let param = {
                    "distance_z (px)" : 8,
                    "distance_y (px)" : 8,
                    "rot" : 5,
                    "speed" : 0.00001,
                    "switch camera" : function () {
                        that.gsx.cam_x = (that.gsx.cam_x + 1) % that.camlist.length;
                        const a = that.camlist[that.gsx.cam_x];
                        that.changeCamera (a);
                    }
                };
                gui.add (param, "distance_z (px)", -10, 90, 0.1).onChange (function (val) {
                    that.gsx.distance_z = val;
                });
                gui.add (param, "distance_y (px)", -10, 50, 0.1).onChange (function (val) {
                    that.gsx.distance_y = val;
                });
                gui.add (param, "rot", 5, 90, 0.3).onChange (function (val) {
                    that.gsx.rot = val;
                });
                gui.add (param, "speed", 0, that.gsx.top_speed, 0.001).onChange (function (val) {
                    that.gsx.moveSpeed = val;
                });
                gui.add (param, "switch camera");
                gui.add (that.gsx, "normalized_sp", 0, 2.0, 0.00001).listen ();
            },

            // Rotate an object around an arbitrary axis in object space
            rotateAroundObjectAxis (object, axis, radians) {
                this.rotObjectMatrix = new THREE.Matrix4 ();
                this.rotObjectMatrix.makeRotationAxis (axis.normalize (), radians);

                // old code for Three.JS pre r54:
                // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
                // new code for Three.JS r55+:
                object.matrix.multiply (this.rotObjectMatrix);

                // old code for Three.js pre r49:
                // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
                // old code for Three.js r50-r58:
                // object.rotation.setEulerFromRotationMatrix(object.matrix);
                // new code for Three.js r59+:
                object.rotation.setFromRotationMatrix (object.matrix);
            },


            // Rotate an object around an arbitrary axis in world space
            rotateAroundWorldAxis (object, axis, radians) {
                this.rotWorldMatrix = new THREE.Matrix4 ();
                this.rotWorldMatrix.makeRotationAxis (axis.normalize (), radians);

                // old code for Three.JS pre r54:
                //  rotWorldMatrix.multiply(object.matrix);
                // new code for Three.JS r55+:
                this.rotWorldMatrix.multiply (object.matrix);                // pre-multiply

                object.matrix = this.rotWorldMatrix;

                // old code for Three.js pre r49:
                // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
                // old code for Three.js pre r59:
                // object.rotation.setEulerFromRotationMatrix(object.matrix);
                // code for r59+:
                object.rotation.setFromRotationMatrix (object.matrix);
            },

            // onProgress callback
            progress_collada (xhr) {
                console.log ((xhr.loaded / xhr.total * 100) + "% loaded");
            },
            // onError callback
            load_err_collada (err) {
                console.error ("An error happened");
            },
            addParticles () {
                // add particles here
            },
            change_color () {
                var ne = this.color_background;
                ne++;
                this.color_background = ne % 180;
                for (let i = 0, j = this.geometry.faces.length; i < j; i++) {
                    this.geometry.faces[i].color = new THREE.Color ("hsl(" + Math.floor ((Math.random () * 20) + this.color_background) + ", 60%, 60%)");
                }
            },
            changeCamera (camera_name) {
                //  const a = this.camlist[camera_name];
                const c = fighters[this.fighter_name];
                if (c[camera_name]) {
                    this.gsx.distance_y = c[camera_name].y;
                    this.gsx.distance_z = c[camera_name].z;
                }
            },

            getCameraPos () {
                let relativeCameraOffset = new THREE.Vector3 (0, this.gsx.distance_y, this.gsx.distance_z);
                let cameraOffset = relativeCameraOffset.applyMatrix4 (this.podskipper.matrixWorld);
                // const camera_pos = this.path.getPointAt (this.percentage % 1);
                // const camera_pos = cameraOffset;
                return {
                    cameraOffset,
                    relativeCameraOffset
                }
            },
            //https://codepen.io/Grilly86/pen/GBaCE
            calPos ({
                        craft_predict_pec,
                        craft_position_pec,
                        camera_look_pec,
                    }) {

                //摄像机的移动速度
                //摄像机的旋转速度
                // const turnSpeed = 10;
                //const offset = new THREE.Vector3 (0, this.gsx.fly_y, 0);
                // const rot = this.gsx.rot * Math.PI / 180;
                // const distance_bottom = this.gsx.distance_z * Math.cos (rot);
                // const height = this.gsx.distance_z * Math.sin (rot);
                // const up = new THREE.Vector3 (0, this.gsx.fly_y, 0);
                const temp_z = this.path.getPointAt (craft_position_pec);
                const temp_ghost = this.path.getPointAt (craft_predict_pec);
                let vehicle_pos = temp_z.clone ();
                //this.gsx.vel_mag = temp_ghost.clone ().sub (temp_z.clone ()).normalize ().magnitude ();
                let vehicle_rot = this.path.getPointAt (camera_look_pec);
                //    const camera_pos = this.path.getPointAt (this.percentage % 1);
                const { cameraOffset } = this.getCameraPos ();
                let camera_pos = this.gsx.oldpos.lerp (cameraOffset, 0.1);
                //  this.gsx.oldpos = temp_z.clone ();
                //this.gsx.oldpos = cameraOffset.clone ();
                const camera_look_at_pos = this.path.getPointAt (camera_look_pec);
                //  const x = vehicle_pos.x + d * Math.cos (rot);
                //  const z = vehicle_pos.z + d * Math.sin (rot);
                //  const y = vehicle_pos.y + height;
                // const delta_cam = new THREE.Vector3 (0, distance_bottom, height);
                if (this.gsx.mode === 1) {
                    switch (this.gsx.game_state) {
                        case 120:
                            //free camera
                            // this.changeCamera ("preview_cam");
                            this.gsx.moveSpeed = 0.9;
                            camera_pos = Math3.CalShortestDistanceCameraPos (this.camera_list, this.gsx.oldpos);
                            break;
                        default:
                            break
                    }
                }

                if (this.gsx.mode === 2) {
                    this.gsx.moveSpeed = 1.0;
                    camera_pos = Math3.CalShortestDistanceCameraPos (this.camera_list, this.gsx.oldpos);
                }

                // const smoothingTime = 13;
                // const deltaTime = 1.42;
                // let prediction = 1;
                // let vector_del = this.gsx.oldpos.sub (vehicle_pos);
                // const targetVel = vector_del.clone ().divide (deltaTime);
                // let dir = vector_del.normalize ();
                // const d = Math.min (1, deltaTime / smoothingTime);
//                 velocity = velocity * (1 - d) + (vehicle_pos.add (targetVelocity * prediction).sub (position) * d;
//
                /*
        positionVector=new Vector3(0,2,4);
        lookVector=new Vector3(0,0,1.5f);
        posFollow = new SmoothFollowerObj(0.5f,0.5f);
        lookFollow = new SmoothFollowerObj(0.1f,0.0f);
                 */

                //  const z = dir.cross (new THREE.Vector3 (0, 0, delta_cam.z));
                //  const y = dir.cross (new THREE.Vector3 (0, delta_cam.y, 0));

                //  if (this.guide != undefined) {
                //      const { k1, k2 } = this.guide;
                // let  = vehicle_pos.add (z).add (y);
                //    k1.vertices[0] = temp_z.clone ();
                //this.guide.k2.vertices[0] = vehicle_pos;
                //  k1.vertices[1] = campos.add (z).add (y);
                // this.guide.k2.vertices[1] = vehicle_pos;
                // const camera_look_at_pos = vehicle_pos;
                //}


                return {
                    camera_pos,
                    camera_look_at_pos,
                    vehicle_pos,
                    vehicle_rot,
                }
            },
            lineFromTo () {
                const pos_delta = new THREE.Vector3 (0, 0, 0);
                //  let lineGeometry = new THREE.BufferGeometry ();
                //  lineGeometry.addAttribute ("position", new THREE.Float32BufferAttribute (points, 3));
                //  画一条直线方便观
                const k1 = new THREE.Geometry ();
                k1.vertices.push (pos_delta);
                k1.vertices.push (pos_delta);

                const k2 = new THREE.Geometry ();
                k2.vertices.push (pos_delta);
                k2.vertices.push (pos_delta);

                let line2 = new THREE.Line (k1, new THREE.LineBasicMaterial ({
                    color : "yellow"
                }), THREE.LineSegments);

                let line3 = new THREE.Line (k2, new THREE.LineBasicMaterial ({
                    color : "purple"
                }), THREE.LineSegments);

                this.scene.add (line2);
                this.scene.add (line3);

                return {
                    k1, k2
                }
            },
            animate () {
                this.frame_action = requestAnimationFrame (this.animate);
                //  this.stats.begin ();
                //=================================================
                const l = this.speedPass ();
                const {
                    camera_pos,
                    camera_look_at_pos,
                    vehicle_pos,
                    vehicle_rot,
                } = this.calPos (l);

                this.camera.position.set (camera_pos.x, camera_pos.y, camera_pos.z);
                this.camera.lookAt (camera_look_at_pos);
                this.light.position.set (camera_pos.x, camera_pos.y, camera_pos.z);
                this.podskipper.position.set (vehicle_pos.x, vehicle_pos.y, vehicle_pos.z);
                this.podskipper.lookAt (vehicle_rot);
                this.renderer.clear ();
                this.composer.render (0.01);
                //  this.stats.end ();
                this.stats.update ();
            }
        }
    }
</script>
