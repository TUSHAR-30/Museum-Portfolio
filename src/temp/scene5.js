// src/scene.js

import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// --------------------
// Scene
// --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// --------------------
// Camera
// --------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 10);

// --------------------
// Renderer
// --------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// --------------------
// Resize
// --------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


let mixer;
const clock = new THREE.Clock();

// Renderingeachframe
function animate() {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta)
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Variables
let gate;

// --------------------
// Lights
// --------------------
const rgbeLoader = new RGBELoader();

rgbeLoader.load('resources/images/image1.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture; // lighting + reflections
    // scene.background = texture;  // visible background
});


const modelLoader = new GLTFLoader();
// Museum
modelLoader.load('/resources/models/Museum.glb', (gltf) => {
    if (!gltf.scene) {
        console.error("GLTF loaded but scene is undefined", gltf);
        return;
    }
    const museum = gltf.scene;
    scene.add(museum);
    museum.traverse(child => {
        if (child.isMesh) {
            child.material.side = THREE.DoubleSide
        }
        if (child.isMesh && child.name == "Window1Glass") {
            child.visible = false
        }
        if (child.isMesh && child.name == "Gate") {
            gate = child;
            function doorAnimation() {
                const OPEN_ANGLE = 1.57
                const CLOSED_ANGLE = 0

                const doorTimeline = gsap.timeline({ repeat: 0 })

                doorTimeline
                    .to(child.rotation, {
                        y: OPEN_ANGLE,
                        duration: 2,
                        ease: "power2.inOut"
                    })
                    .to({}, { duration: 2 }) // pause
                    .to(child.rotation, {
                        y: CLOSED_ANGLE,
                        duration: 2,
                        ease: "power2.inOut"
                    })
            }

            doorAnimation()
            // exportableDoorAnimation()
        }
    })
});

modelLoader.load('/resources/models/bird_flying_animation.glb', (gltf) => {
    const bird = gltf.scene;
    bird.position.set(35, -8, -52)
    scene.add(bird)

    mixer = new THREE.AnimationMixer(bird)
    const clip = gltf.animations[0]
    const action = mixer.clipAction(clip)
    action.play()

    // 🟢 GSAP TIMELINE
    const tl = gsap.timeline();

    // 1️⃣ Go straight (Z direction)
    tl.to(bird.position, {
        z: 0,
        duration: 2,
        ease: "power2.inOut",
        delay:5
    });
    

    tl.to({}, { duration: 2 });

    // // 3️⃣ Rotate + move in X (PARALLEL)
    // tl.to(bird.rotation, {
    //     y: -Math.PI,
    //     duration: 2,
    //     ease: "power2.inOut"
    // }, "<") // start at same time
        tl.to(bird.position, {
            x: -45,
            z: 30,
            duration: 2,
            ease: "power2.inOut"
        });


    // // 4️⃣ Move only in Z after previous animation
    tl.to(bird.position, {
        z: -140,
        duration: 3,
        ease: "power2.inOut"
    });


    tl.to(bird.position, {
        x: 60,
        // y: -8,
        duration: 2,
        ease: "power2.inOut"
    });

    // tl.to(bird.rotation, {
    //     y: 0,
    //     duration: 1
    // })

    tl.to(bird.position, {
        // x:35,
        // y:-8,
        z: -52,
        duration: 2,
        ease: "power2.inOut"
    });


})

function exportGLB(gateClip) {

    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'Museumasd.glb';
            link.click();

            URL.revokeObjectURL(url);
        },
        (error) => {
            console.error('An error happened during export', error);
        },
        {
            binary: true,
            animations: [gateClip], // ✅ REQUIRED
            onlyVisible: true
        }
    );
}


function exportableDoorAnimation() {

    gate.name = 'Gate';

    const times = [0, 2, 4, 6];

    const q0 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, 0, 0)
    );

    const q1 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI / 2, 0)
    );

    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q1.x, q1.y, q1.z, q1.w,
        q0.x, q0.y, q0.z, q0.w
    ];

    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        'Gate.quaternion', // 🎯 TARGET CHILD NODE
        times,
        values
    );

    const gateClip = new THREE.AnimationClip(
        'GateOpenClose',
        -1,
        [rotationTrack]
    );

    exportGLB(gateClip);
}



animate()


export { scene, camera, renderer }