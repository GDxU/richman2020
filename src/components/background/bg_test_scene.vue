<template>
    <div>
        <div id="threejs-content"></div>
    </div>
</template>

<script>
    import * as THREE from "three";

    export default {
        name : "bg_test_scene",
        data () {
            return {
                scene : null,
                camera : null,
                renderer : null,
                geometry : null,
                material : null,
                mesh : null,
                height : 300,
                width : 500
            };
        },
        created () {
        },
        mounted () {
            this.init ();
            this.animate ();
        },
        destroyed () {
            this.camera = null;
            this.renderer = null;
            this.mesh = null;
            this.material = null;
            this.geometry = null;
            this.scene = null;
        },
        methods : {
            init () {
                this.scene = new THREE.Scene ();
                this.camera = new THREE.PerspectiveCamera (70, this.width / this.height, 0.01, 1000);
                this.camera.position.z = 100;
                this.geometry = new THREE.BoxGeometry (50, 10, 50);
                this.material = new THREE.MeshNormalMaterial ();
                this.mesh = new THREE.Mesh (this.geometry, this.material);
                this.scene.add (this.mesh);
                this.renderer = new THREE.WebGLRenderer ({ antialias : true });
                this.renderer.setSize (this.width, this.height);

                const content = document.getElementById ('threejs-content');
                content.appendChild (this.renderer.domElement)
                //   document.body.appendChild(this.renderer.domElement);
            },
            addParticles () {
                // add particles here
            },
            animate () {
                requestAnimationFrame (this.animate)
                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.y += 0.02;
                this.mesh.rotation.z += 0.01;
                this.renderer.render (this.scene, this.camera)
            }
        }
    };
</script>