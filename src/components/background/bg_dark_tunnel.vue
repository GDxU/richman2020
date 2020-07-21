<template>
    <div>
        <div id="kgtunnel-content"></div>
    </div>
</template>
<script>
    import * as THREE from "three";
    //import ColladaLoader from "three/examples/js/loaders/ColladaLoader"
    import ColladaLoader from "../../plugins/three/importmodels/collada"
    import Skeleton from "../../plugins/mixins/mixinbb/bbGameAnimationSkeleton"

    function GeneratePaths () {
        //Create a path from the points
        // Array of points
        /**
         *
         *
         330    100
         250    140
         300    90
         * @type {*[]}
         */
        let points = [
            [68.5, 185.5],
            [1, 262.5],
            [270.9, 281.9],
            [345.5, 212.8],
            [330, 100],
            [250, 140],
            [300, 90],
            [178, 155.7],
            [240.3, 72.3],
            [153.4, 0.6],
            [140.4, -60],
            [100.1, -95],
            [77.1, -68],
            [52.6, 53.3],
            [68.5, 185.5],
        ];
        let out_points = [];
        // Convert the array of points into vertices
        for (let i = 0; i < points.length; i++) {
            //   const updown = Math.cos (y * Math.PI / 180) * 30;
            const x = points[i][0], y = 0, z = points[i][1];
            out_points.push (new THREE.Vector3 (x, y, z));
        }

        // Create a path from the points
        return new THREE.CatmullRomCurve3 (out_points);
    }


    function Tubize (path_line) {
        // Create the tube geometry from the path
        const geometry = new THREE.TubeGeometry (path_line, 600, 8, 32, true);
        // Set a different color on each face
        for (let i = 0, j = geometry.faces.length; i < j; i++) {
            geometry.faces[i].color = new THREE.Color ("hsl(" + Math.floor ((Math.random () * 20) + 200) + ", 60%, 60%)");
        }
        return geometry;
    }

    function DotizeGeometry (path_line) {
        // Define the precision of the finale tube, the amount of divisions
        const tubeDetail = 500;
        // Define the precision of the circles
        const circlesDetail = 10;
        // Define the radius of the finale tube
        const radius = 5;
        // Get all the circles that will compose the tube
        console.log (path_line);
        const frames = path_line.computeFrenetFrames (tubeDetail, true);
        return get_d_geo (tubeDetail, circlesDetail, frames, radius);
    }

    function get_d_geo (tubeDetail, circlesDetail, frames, r) {
        // Create an empty Geometry where we will put the particles
        const geometry = new THREE.Geometry ();
        // First loop through all the circles
        for (let i = 0; i < tubeDetail; i++) {
            // Get the normal values for each circle
            const normal = frames.normals[i];
            // Get the binormal values
            const binormal = frames.binormals[i];
            // Calculate the index of the circle (from 0 to 1)
            const index = i / tubeDetail;
            // Get the coordinates of the point in the center of the circle
            const p = path.getPointAt (index);
            // Loop for the amount of particles we want along each circle
            for (let j = 0; j < circlesDetail; j++) {
                // Clone the position of the point in the center
                const position = p.clone ();
                // Calculate the angle for each particle along the circle (from 0 to Pi*2)
                const angle = (j / circlesDetail) * Math.PI * 2;
                // Calculate the sine of the angle
                const sin = Math.sin (angle);
                // Calculate the cosine from the angle
                const cos = -Math.cos (angle);
                // Calculate the normal of each point based on its angle
                const normalPoint = new THREE.Vector3 (0, 0, 0);
                normalPoint.x = (cos * normal.x + sin * binormal.x);
                normalPoint.y = (cos * normal.y + sin * binormal.y);
                normalPoint.z = (cos * normal.z + sin * binormal.z);
                // Multiple the normal by the radius
                normalPoint.multiplyScalar (r);
                // We add the normal values for each point
                position.add (normalPoint);
                geometry.vertices.push (position);
            }
        }
        return geometry;

    }

    export default {
        name : "bg_kgbtunnel",
        mixins : ["Skeleton"],
        data () {
            return {
                scene : null,
                path : null,
                camera : null,
                renderer : null,
                geometry : null,
                light : null,
                frame_action : null,
                tube : null,
                podskipper : null,
                clock : null,
                uniforms : {},
                percentage : 0,
                color_background : 0,
                height : 300,
                width : 500,
                timer_01 : null,
                rotObjectMatrix : null,
                rotWorldMatrix : null,
                game_run_time : {
                    //0 - auto fly
                    //1 - control fly by given delta
                    mode : 0,
                    movedelta : 0,
                }
            };
        },
        created () {
        },
        mounted () {
            this.$nextTick (() => {
                this.init ();
                if (window === undefined) return;
                window.addEventListener ("resize", this.resizeWindow, false);
                this.resizeWindow ();
            })
        },
        destroyed () {
            this.renderer = null;
            this.camera = null;
            this.tube = null;
            this.clock = null;
            this.geometry = null;
            this.scene = null;
            this.uniforms = null;
            this.podskipper = null;
            if (window === undefined) return;
            window.cancelAnimationFrame (this.frame_action)
        },
        methods : {
            clearData () {
                this.game_run_time.mode = 1;
                this.game_run_time.movedelta = 0;
            },
            pushFactor (a, b) {
                this.game_run_time.movedelta = a;
            },
            startJump () {
                this.game_run_time.mode = 1;
            },
            kill () {
                this.game_run_time.mode = 0;
                this.game_run_time.movedelta = 0;
            },

            /**
             * do not change this part.
             * @param collada
             */
            loadCollada (collada) {
                this.podskipper = collada.scene;
                //  this.podskipper.scale()

                //renderPhone ();
                this.podskipper.scale.x = 0.8;
                this.podskipper.scale.y = 0.8;
                this.podskipper.scale.z = -0.8;
                /*

                                let material = new THREE.MeshBasicMaterial ({
                                    color : 0x00ff00, wireframe : true
                                });
                */

                //      let cube = new THREE.Mesh (this.podskipper, material);

                this.scene.add (this.podskipper);
                const content = document.getElementById ("kgtunnel-content");
                content.appendChild (this.renderer.domElement);
                this.animate ();
            },
            init () {
                this.clock = new THREE.Clock ();
                this.scene = new THREE.Scene ();
                this.camera = new THREE.PerspectiveCamera (65, this.width / this.height, 0.01, 1000);
                this.camera.position.z = 400;

                /////////////////////////////////////////
                // BOX Geometry
                /////////////////////////////////////////

                const ambient = new THREE.AmbientLight (0xffffff, 0.75);
                this.scene.add (ambient);

                // Create a WebGL renderer
                this.renderer = new THREE.WebGLRenderer ({ antialias : true });
                this.renderer.setSize (this.width, this.height);

                //let axisHelper = new THREE.AxisHelper (800);
                //this.scene.add (axisHelper);
                this.path = GeneratePaths ();
                // this.geometry = Tubize (this.path);
                /*    this.timer_01 = setInterval (() => {
                        this.change_color ();
                    }, 5000);*/
                console.log ("gen path", this.path);
                //Basic material
                //  const lamber_materiax = this.getNormalMeshLambertMaterial ();
                //    const lava_mat = this.getShaderMaterial ();
                // Create a point light in our scene
                this.light = new THREE.PointLight (0xffffff, 1, 100);
                this.scene.add (this.light);
                this.percentage = 0;

//                this.geometry = new THREE.BoxGeometry (50, 10, 50);
                //   let size = 0.65;
                //   let lavalMaterial = this.getShaderMaterial ();

                //this.tube = new THREE.Mesh (this.geometry, lamber_materiax);


                // Material for the points
                const material = new THREE.PointsMaterial ();

                this.tube = new THREE.Mesh (DotizeGeometry (this.path), material);
                this.scene.add (this.tube);
                /////////////////////////////////////////
                // Object Loader
                /////////////////////////////////////////
                const loader = new ColladaLoader ();
                loader.options.convertUpAxis = true;
                //loader.load ("https://s3-us-west-2.amazonaws.com/s.cdpn.io/392/iphone6.dae", this.loadCollada);
                //  loader.load ("/models/landcraft/edp.dae", this.loadCollada);
                // loader.load ("/models/explane/model.dae", this.loadCollada);
                //  loader.load ("/models/starpack/ship9.dae", this.loadCollada, this.progress_collada, this.load_err_collada);
                // loader.load ("/models/starpack/ship5.dae", this.loadCollada);
                // loader.load ("/models/starpack/ship9.dae", this.loadCollada);
                loader.load ("/models/starpack/tie3.dae", this.loadCollada);
            },


            getUniformsLoaded () {
                const textureLoader = new THREE.TextureLoader ();
                return {
                    fogDensity : { value : 0.45 },
                    fogColor : { value : new THREE.Vector3 (0, 0, 0) },
                    time : { value : 1.0 },
                    uvScale : { value : new THREE.Vector2 (3.0, 1.0) },
                    texture1 : { value : textureLoader.load ("/textures/cloud.png") },
                    texture2 : { value : textureLoader.load ("/textures/lavatile.jpg") }
                }
            },
            getNormalMeshLambertMaterial () {
                return new THREE.MeshLambertMaterial ({
                    side : THREE.BackSide,
                    vertexColors : THREE.FaceColors // We need to tell ThreeJs that the colors are coming from the faces
                });
            },
            getShaderMaterial () {
                this.uniforms = this.getUniformsLoaded ();
                this.uniforms.texture1.value.wrapS = this.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
                this.uniforms.texture2.value.wrapS = this.uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

                return new THREE.ShaderMaterial ({

                    side : THREE.BackSide,

                    uniforms : this.uniforms,
                    //  vertexShader : document.getElementById ("vertexShader").textContent,
                    vertexShader : `uniform vec2 uvScale;
			varying vec2 vUv;
			void main()
			{
				vUv = uvScale * uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
			}`,
                    //fragmentShader : document.getElementById ("fragmentShader").textContent
                    fragmentShader : `uniform float time;
			uniform float fogDensity;
			uniform vec3 fogColor;
			uniform sampler2D texture1;
			uniform sampler2D texture2;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = - 1.0 + 2.0 * vUv;
				vec4 noise = texture2D( texture1, vUv );
				vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
				vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;
				T1.x += noise.x * 2.0;
				T1.y += noise.y * 2.0;
				T2.x -= noise.y * 0.2;
				T2.y += noise.z * 0.2;
				float p = texture2D( texture1, T1 * 2.0 ).a;
				vec4 color = texture2D( texture2, T2 * 2.0 );
				vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );
				if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
				if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
				if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }
				gl_FragColor = temp;
				float depth = gl_FragCoord.z / gl_FragCoord.w;
				const float LOG2 = 1.442695;
				float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
				fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
				gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
			}`
                });
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
            resizeWindow () {
                if (window === undefined) return;
                const a = window.innerWidth;
                const b = window.innerHeight;
                this.camera.aspect = a / b;
                this.camera.updateProjectionMatrix ();
                this.renderer.setSize (a, b);
            },

            change_color () {
                let ne = this.color_background;
                ne++;
                this.color_background = ne % 180;
                for (let i = 0, j = this.geometry.faces.length; i < j; i++) {
                    this.geometry.faces[i].color = new THREE.Color ("hsl(" + Math.floor ((Math.random () * 20) + this.color_background) + ", 60%, 60%)");
                }
            },
            animate () {
                this.frame_action = requestAnimationFrame (this.animate);
                //=================================================
                // let delta = 5 * this.clock.getDelta ();
                //this.uniforms.time.value += 0.2 * delta;

                if (this.game_run_time.mode === 1) {
                    const x = this.game_run_time.movedelta * 0.0001;
                    this.percentage += x;
                } else if (this.game_run_time.mode === 0) {
                    this.percentage += 0.00025; // Speed
                } else {
                    this.percentage += 0;
                }

                const
                    p1 = this.path.getPointAt (this.percentage % 1),
                    craft = this.path.getPointAt ((this.percentage + 0.005) % 1),
                    p2 = this.path.getPointAt ((this.percentage + 0.004) % 1),
                    p3 = this.path.getPointAt ((this.percentage + 0.008) % 1)
                ;
                this.camera.position.set (p1.x, p1.y, p1.z);
                this.camera.lookAt (p2);
                this.light.position.set (p2.x, p2.y, p2.z);
                this.podskipper.position.set (craft.x, craft.y, craft.z);
                this.podskipper.lookAt (p3);
                //  Render the scene
                //  renderer.render(scene, camera);
                //  this.change_color ();
                // let xAxis = new THREE.Vector3 (1, 0, 0);
                // this.rotateAroundWorldAxis (this.podskipper, xAxis, Math.PI / 180);
                this.renderer.render (this.scene, this.camera);
            }
        }
    }
</script><!--
<script id="fragmentShader" type="x-shader/x-fragment">
			uniform float time;
			uniform float fogDensity;
			uniform vec3 fogColor;
			uniform sampler2D texture1;
			uniform sampler2D texture2;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = - 1.0 + 2.0 * vUv;
				vec4 noise = texture2D( texture1, vUv );
				vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
				vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;
				T1.x += noise.x * 2.0;
				T1.y += noise.y * 2.0;
				T2.x -= noise.y * 0.2;
				T2.y += noise.z * 0.2;
				float p = texture2D( texture1, T1 * 2.0 ).a;
				vec4 color = texture2D( texture2, T2 * 2.0 );
				vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );
				if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
				if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
				if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }
				gl_FragColor = temp;
				float depth = gl_FragCoord.z / gl_FragCoord.w;
				const float LOG2 = 1.442695;
				float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
				fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
				gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
			}


</script>

<script id="vertexShader" type="x-shader/x-vertex">
			uniform vec2 uvScale;
			varying vec2 vUv;
			void main()
			{
				vUv = uvScale * uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
			}


</script>-->
