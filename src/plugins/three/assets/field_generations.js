import * as THREE from "three";

function RenderTrack (points) {
    //Convert the array of points into vertices
    for (let i = 0; i < points.length; i++) {
        const x = points[i][0];
        const y = (Math.random () - 0.5) * 500;
        const z = points[i][1];
        points[i] = new THREE.Vector3 (x, y, z);
    }

    let total_track_distance = 0;
    let CameraPositions = [];
    let PathPositions = [];
    //Create a path from the points

    // console.log ("CameraPositions 1", CameraPositions);

    const path = new THREE.CatmullRomCurve3 (points);

    //  console.log ("CameraPositions 2", path);

    path.closed = true;
    path.type = "catmullrom";
    path.tension = 0.4;
    let cameras_total = 10;
    // Define the precision of the finale tube, the amount of divisions
    let tubeDetail = 50;
    let camera_cinterval = Math.floor (tubeDetail / cameras_total);
    // Define the precision of the circles
    let circlesDetail = 9;
    // Define the radius of the finale tube
    let radius_min = 2;
    let radius_max = 6;
    // Get all the circles that will compose the tube
    let frames = path.computeFrenetFrames (tubeDetail, true);
    // Create an empty Geometry where we will put the particles
    let geometry = new THREE.Geometry ();
    // First loop through all the circles
    for (let i = 0; i < tubeDetail; i++) {
        // Get the normal values for each circle
        let normal = frames.normals[i];
        // Get the binormal values
        let binormal = frames.binormals[i];
        // Calculate the index of the circle (from 0 to 1)
        let index = i / tubeDetail;
        let radius = Math.cos (index * Math.PI / 180) * (radius_max - radius_min) + radius_min;
        // Get the coordinates of the point in the center of the circle
        let p = path.getPointAt (index);
        PathPositions.push (p);
        // Loop for the amount of particles we want along each circle
        for (let j = 0; j < circlesDetail; j++) {
            // Clone the position of the point in the center
            let position = p.clone ();
            // Calculate the angle for each particle along the circle (from 0 to Pi*2)
            let angle = (j / circlesDetail) * Math.PI * 2;
            // Calculate the sine of the angle
            let sin = Math.sin (angle);
            // Calculate the cosine from the angle
            let cos = -Math.cos (angle);
            // Calculate the normal of each point based on its angle
            let normalPoint = new THREE.Vector3 (0, 0, 0);
            normalPoint.x = (cos * normal.x + sin * binormal.x);
            normalPoint.y = (cos * normal.y + sin * binormal.y);
            normalPoint.z = (cos * normal.z + sin * binormal.z);
            // Multiple the normal by the radius
            normalPoint.multiplyScalar (radius);
            // We add the normal values for each point
            position.add (normalPoint);
            geometry.vertices.push (position);
        }

        if (i % camera_cinterval === 0) {
            let position = p.clone ();
            let angle = Math.random () * circlesDetail * Math.PI * 2;
            // Calculate the sine of the angle
            let sin = Math.sin (angle);
            // Calculate the cosine from the angle
            let cos = -Math.cos (angle);
            let normalPoint = new THREE.Vector3 (0, 0, 0);
            normalPoint.x = (cos * normal.x + sin * binormal.x);
            normalPoint.y = (cos * normal.y + sin * binormal.y);
            normalPoint.z = (cos * normal.z + sin * binormal.z);
            // Multiple the normal by the radius
            normalPoint.multiplyScalar (radius);
            position.add (normalPoint);
            CameraPositions.push (position);
        }

    }

    for (let i = 0; i < PathPositions.length; i++) {
        // let index = i / PathPositions.length;
        let p1 = PathPositions[i];
        if (i > 0) {
            let p2 = PathPositions[i - 1];
            //let p2 = path.getPointAt (index - 1);
            //    let ppx = new THREE.Vector3 (p2.x, p2.y, p2.z);
            //   let ppm = new THREE.Vector3 (p.x, p.y, p.z);
            total_track_distance += p1.distanceTo (p2);
            //  total_track_distance += 10;
            // ppx = null;
            // ppm = null;
            p2 = null;
        }
        //p = null;
    }

    //   console.log ("total_distance", total_track_distance);
    return {
        geometry,
        path,
        CameraPositions,
        total_track_distance,
    };
}

function StarGenerator () {

    /*背景星星*/
    const particles = 20000;  //星星数量
    /*buffer做星星*/
    let bufferGeometry = new THREE.BufferGeometry ();

    let positions = new Float32Array (particles * 3);
    let colors = new Float32Array (particles * 3);

    let color = new THREE.Color ();

    const gap = 1000; // 定义星星的最近出现位置

    for (let i = 0; i < positions.length; i += 3) {

        // positions

        /*-2gap < x < 2gap */
        let x = (Math.random () * gap * 2) * (Math.random () < .5 ? -1 : 1);
        let y = (Math.random () * gap * 2) * (Math.random () < .5 ? -1 : 1);
        let z = (Math.random () * gap * 2) * (Math.random () < .5 ? -1 : 1);

        /*找出x,y,z中绝对值最大的一个数*/
        let biggest = Math.abs (x) > Math.abs (y) ? Math.abs (x) > Math.abs (z) ? 'x' : 'z' :
            Math.abs (y) > Math.abs (z) ? 'y' : 'z';

        let pos = { x, y, z };

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if (Math.abs (pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

        x = pos['x'];
        y = pos['y'];
        z = pos['z'];

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // colors

        /*70%星星有颜色*/
        let hasColor = Math.random () > 0.3;
        let vx, vy, vz;

        if (hasColor) {
            vx = (Math.random () + 1) / 2;
            vy = (Math.random () + 1) / 2;
            vz = (Math.random () + 1) / 2;
        } else {
            vx = 1;
            vy = 1;
            vz = 1;
        }

        /*let vx = ( Math.abs(x) / n*2 ) ;
        var vy = ( Math.abs(y) / n*2 ) ;
        var vz = ( Math.abs(z) / n*2 ) ;*/

        color.setRGB (vx, vy, vz);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    bufferGeometry.addAttribute ('position', new THREE.BufferAttribute (positions, 3));
    bufferGeometry.addAttribute ('color', new THREE.BufferAttribute (colors, 3));
    bufferGeometry.computeBoundingSphere ();

    /*星星的material*/
    let material = new THREE.PointsMaterial ({ size : 6, vertexColors : THREE.VertexColors });
    const particleSystem = new THREE.Points (bufferGeometry, material);

    return {
        particleSystem
    }
}

/**
 * return vec3 position
 * @param array_positions
 * @param flying_object_vector3_pos vector3
 * @returns {*}
 */
function CalShortestDistanceCameraPos (array_positions, flying_object_vec3_pos) {
    let distances = [];
    for (let h = 0; h < array_positions.length; h++) {
        const p = array_positions[h];
        const x = p.distanceTo (flying_object_vec3_pos);
        distances.push (x);
    }
    const k = distances.min ();
    //console.log ("k", k);
    const b = distances.indexOf (k);
    return array_positions[b].clone ();
    //  distances = [];
    //  return f;
}


Array.prototype.min = function () {
    return Math.min.apply ({}, this)
};

function runAsync1 () {
    var p = new Promise (function (resolve, reject) {
        setTimeout (function () {
            console.log ('执行完成1')
            resolve ('icessun1');
        }, 2000);
    });

    return p; // 返回p实例对象
}

function runAsync2 () {
    var p = new Promise (function (resolve, reject) {
        setTimeout (function () {
            console.log ('执行完成2')
            resolve ('icessun2');
        }, 2000);
    });

    return p; // 返回p实例对象
}

function runAsync3 (path) {
    return new Promise (function (resolve, reject) {
        TextureLoader ().load (path,
            function (map) {
                resolve (map);
            }
        )
    });
}

function TextureLoader () {
    // Instantiate a texture loader.
    const loader = new THREE.TextureLoader ();
    // Allow CORS for loading images from Amazon S3.
    loader.crossOrigin = '';
    return loader;
}

export const Math3 = {
    CalShortestDistanceCameraPos,
};
export const Generator = {
    RenderTrack,
    StarGenerator,
};
export const Loader = function (finish) {

    Promise
        .all ([runAsync1 (), runAsync2 (), runAsync3 ()])
        .then (function (results) {
            console.log (results);
            finish ({})
        });

};