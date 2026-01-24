// src/scene.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


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
camera.position.set(-1, 2, 1);

// --------------------
// Lights
// --------------------
// scene.add(new THREE.AmbientLight(0xffffff, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(4, 5, 0);
dirLight.castShadow=true;

// Improve shadow quality
// dirLight.shadow.mapSize.set(2048, 2048);
// dirLight.shadow.bias = -0.0003;
// dirLight.shadow.normalBias = 0.02;

// Configuring shadow camera
// dirLight.shadow.camera.near = 1;
// dirLight.shadow.camera.far  = 20;

scene.add(dirLight);

// Create the helper(Debugging)
const lightHelper = new THREE.DirectionalLightHelper(dirLight, 1); // Size 1
scene.add(lightHelper);

// Add this helper to see the shadow frustum:
const shadowCamHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(shadowCamHelper);


const plane1=new THREE.Mesh(
    new THREE.PlaneGeometry(5,5),
    new THREE.MeshStandardMaterial({color:"red",side:THREE.FrontSide})
)
plane1.rotation.set(-1.57,0,0)
plane1.receiveShadow=true
plane1.castShadow=true;
scene.add(plane1)


const sphere1=new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial({"color":"blue",roughness:0.5,metalness:0})
)
console.log(sphere1.material)
sphere1.position.set(0,1,0)
sphere1.receiveShadow=true
sphere1.castShadow=true;
scene.add(sphere1)


// const sphere2=new THREE.Mesh(
//     new THREE.SphereGeometry(0.5),
//     new THREE.MeshStandardMaterial()
// )
// sphere2.position.set(0,4,0)
// sphere2.receiveShadow=true
// sphere2.castShadow=true;
// scene.add(sphere2)



// --------------------
// Renderer
// --------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true;


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
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate()


export { scene, camera, renderer }