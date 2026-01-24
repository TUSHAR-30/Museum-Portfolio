// src/scene.js

import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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
camera.position.set(0, 0, 250);

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


// Renderingeachframe
function animate() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Variables
let mixer;
const clock = new THREE.Clock();


// --------------------
// Lights
// --------------------
const rgbeLoader = new RGBELoader();

rgbeLoader.load('resources/images/image1.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = texture; // lighting + reflections
  // scene.background = texture;  // visible background
});

const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load("resources/images/door.jpg")
doorTexture.colorSpace = THREE.SRGBColorSpace
doorTexture.flipY = false

const modelLoader = new GLTFLoader();
// Museum
modelLoader.load('/resources/models/Museum.glb', (gltf) => {
  if (!gltf.scene) {
    console.error("GLTF loaded but scene is undefined", gltf);
    return;
  }
  
  const museum = gltf.scene;
  scene.add(museum);

   // 👉 Setup animation mixer
   mixer = new THREE.AnimationMixer(museum);

   // Play the first animation
   const clip = gltf.animations[0];
   const action = mixer.clipAction(clip);
 
   action.setLoop(THREE.LoopOnce); // 🔑 play only once
   action.clampWhenFinished = true; // 🔑 keep final pose
   action.play();

  museum.traverse(child => {
    // if (child.isMesh) {
    //   child.material.side = THREE.DoubleSide
    // }
    // if (child.isMesh && child.name == "Window1Glass") {
    //   child.visible = false
    // }
    if (child.isMesh && child.name == "Gate") {
      child.material = new THREE.MeshStandardMaterial({
        map: doorTexture,
        side: THREE.DoubleSide
      })

    }
  })
});

// Video as background
function createVideoasBackground() {
  const video = document.createElement('video');
  video.src = 'resources/images/nature.mp4';
  video.loop = true;
  video.muted = true;
  video.play();

  const videoTexture = new THREE.VideoTexture(video);
  scene.background = videoTexture;

}
createVideoasBackground()


animate()


export { scene, camera, renderer }