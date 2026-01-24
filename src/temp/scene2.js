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
camera.position.set(0, 5, 10);

// --------------------
// Lights
// --------------------
// scene.add(new THREE.AmbientLight(0xffffff, 2.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(10, 5, 0);
dirLight.castShadow=true;
// dirLight.shadow.camera.near = 1;
// dirLight.shadow.camera.far  = 20;

scene.add(dirLight);

// Create the helper
const lightHelper = new THREE.DirectionalLightHelper(dirLight, 1); // Size 1
scene.add(lightHelper);

const shadowCamHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(shadowCamHelper);


// Center
// plane1
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
    new THREE.MeshStandardMaterial()
)
sphere1.position.set(0,1,0)
// sphere1.receiveShadow=true
sphere1.castShadow=true;
scene.add(sphere1)



// Right side
// plane2
const plane2=new THREE.Mesh(
    new THREE.PlaneGeometry(5,5),
    new THREE.MeshStandardMaterial({color:"red",side:THREE.FrontSide})
)
plane2.rotation.set(-1.57,0,0)
plane2.position.set(10,0,0)
plane2.receiveShadow=true
// plane2.castShadow=true;
scene.add(plane2)


const sphere2=new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial()
)
sphere2.position.set(10,1,0)
// sphere2.receiveShadow=true
sphere2.castShadow=true;
scene.add(sphere2)

// LEft side
// plane3
const plane3=new THREE.Mesh(
    new THREE.PlaneGeometry(5,5),
    new THREE.MeshStandardMaterial({color:"red",side:THREE.FrontSide})
)
plane3.rotation.set(-1.57,0,0)
plane3.position.set(-10,0,0)
plane3.receiveShadow=true
// plane3.castShadow=true;
scene.add(plane3)


const sphere3=new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial()
)
sphere3.position.set(-10,1,0)
// sphere3.receiveShadow=true
sphere3.castShadow=true;
scene.add(sphere3)


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