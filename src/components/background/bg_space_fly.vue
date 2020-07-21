<template>
    <div id="galaxy"></div>
</template>

<script>
    import * as THREE from "three";

    export default {
        name : "bg_space_fly",
        data () {
            return {
                frame_action : null,
                scene : null,
                camera : null,
                controls : null,
                shadowLight : null,
                backLight : null,
                light : null,
                renderer : null,
                frequency : 5,
                freqCount : 0,
                container : null,
                smokeRecycle : [],
                pt : null,
                radians : null,
                rocket1 : null,
                tangent : null,
                HEIGHT : null,
                WIDTH : null,
                windowHalfX : null,
                windowHalfY : null,
                up : new THREE.Vector3 (0, 1, 0),
                axis : new THREE.Vector3 (),
                worldCoords : null,
                t : 0,
            }
        },
        detroyed () {
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
        mounted () {
            this.nextTick (() => {
                this.init ();
                if (window === undefined) return;
                window.addEventListener ('resize', this.resizeWindow, false);
                this.resizeWindow ();
            })
        },
        methods : {
            init () {

            },
            rocket () {

            },
            makeCylinder (radiusTop, radiusBottom, height, radiusSegments, heightSegments, mat) {
                var geom = new THREE.CylinderGeometry (radiusTop, radiusBottom, height, radiusSegments, heightSegments);
                return new THREE.Mesh (geom, mat);
            }

        }
    }
</script>

<style scoped>

</style>