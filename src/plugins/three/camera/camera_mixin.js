import { EventBus } from "../../EventBus";
import { TimelineLite } from "gsap";
import * as THREE from "three";

export default {
    data () {
        return {
            camera_param : {
                focus : {},
                distance : { distance_y : 0, distance_z : 0 },
                orbit_control : {},
            },
            camera : null,
        }
    },
    computed : {
        camera_pos () {
            let relativeCameraOffset = new THREE.Vector3 (0, this.camera_param.distance.distance_y, this.camera_param.distance.distance_z);
            if (this.camera_param.focus == undefined) return new THREE.Vector3 (0, 0, 0);
            return relativeCameraOffset.applyMatrix4 (this.camera_param.focus.matrixWorld);
        }
    },
    methods : {
        setupCamera () {
            const camera = new THREE.PerspectiveCamera (65, this.width / this.height, 0.01, 1000);
            camera.position.z = 400;
            this.camera = camera;
        },
        orbit_camera () {
            this.camera_param.orbit_control = new THREE.OrbitControls (this.camera, this.renderer.domElement);
            // 如果使用animate方法时，将此函数删除
            //controls.addEventListener( 'change', render );
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            this.camera_param.orbit_control .enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            //controls.dampingFactor = 0.25;
            //是否可以缩放
            this.camera_param.orbit_control .enableZoom = true;
            //是否自动旋转
            this.camera_param.orbit_control .autoRotate = true;
            //设置相机距离原点的最远距离
            this.camera_param.orbit_control .minDistance = 200;
            //设置相机距离原点的最远距离
            this.camera_param.orbit_control .maxDistance = 600;
            //是否开启右键拖拽
            this.camera_param.orbit_control .enablePan = true;
        },
        resize_windows_camera () {
            if (this.camera == undefined) return;
            if (window === undefined) return;
            const a = window.innerWidth;
            const b = window.innerHeight;
            this.camera.aspect = a / b;
            this.camera.updateProjectionMatrix ();
        },
        camera_fps () {
            if (this.camera == undefined) return;

            /*   const {
                   camera_pos,
                   camera_look_at_pos,
                   vehicle_pos,
                   vehicle_rot,
               } = this.calPos (l);*/
            this.camera.position.set (this.camera_pos.x, this.camera_pos.y, this.camera_pos.z);
            /// this.camera.lookAt (camera_look_at_pos);
        }
    },


}