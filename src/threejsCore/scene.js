import * as THREE from 'three';
import { updateControls } from './newKeyEvents';
import mixerAnimationManager from '../utils/mixerAnimationManager';
import { isMobileDevice } from '../utils/device';
import { getOrbitControls } from './orbitControls';


// --------------------
// Scene / Camera / Renderer
// --------------------
const scene = new THREE.Scene();

const MOBILE_FOV = 88;
const DESKTOP_FOV = 45;

const container = document.getElementById('threeContainer');

const camera = new THREE.PerspectiveCamera(
  isMobileDevice() ? MOBILE_FOV : DESKTOP_FOV,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, isMobileDevice() ? 0.01 : 50)

const direction = new THREE.Vector3();
camera.getWorldDirection(direction);
console.log(direction);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7; // start here

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);



// --------------------
// Render Loop
// --------------------
const clock = new THREE.Clock();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    clock.getDelta(); // 🔥 flush accumulated time
  }
});

export function animate() {
  const delta = clock.getDelta();
  mixerAnimationManager.update(delta);
  (function () {
    let controls = getOrbitControls();
    if (controls) {
      updateControls({ controls })
      controls.update()
    }
  })()
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.fov = isMobileDevice() ? MOBILE_FOV : DESKTOP_FOV;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});


export { scene, camera, renderer };