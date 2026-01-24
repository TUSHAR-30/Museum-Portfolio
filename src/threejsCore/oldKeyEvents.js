import * as THREE from 'three';
import { camera } from './scene';
// import config from '../data/config.json';

// controlsState.js
const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  rotateLeft: false,
  rotateRight: false,
};

function bindButton(id, key) {
  const btn = document.getElementById(id);

  const start = () => (controls[key] = true);
  const end = () => (controls[key] = false);

  btn.addEventListener('mousedown', start);
  btn.addEventListener('mouseup', end);
  btn.addEventListener('mouseleave', end);

  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    start();
  });

  btn.addEventListener('touchend', end);
}

bindButton('forward', 'forward');
bindButton('backward', 'backward');
bindButton('left', 'left');
bindButton('right', 'right');
bindButton('rotateLeft', 'rotateLeft');
bindButton('rotateRight', 'rotateRight');


// const roomData = config.geometries.find(g => g.name === 'room');
// const ROOM_WIDTH = roomData.size[0];
// const ROOM_HEIGHT = roomData.size[1];
// const ROOM_DEPTH = roomData.size[2];


// //   // Stay inside room
// const zlimit = ROOM_DEPTH / 2 - 8;
// const xlimit = ROOM_WIDTH / 2 - 8;
// const ylimit = ROOM_HEIGHT / 2 - 8;

// --------------------
// Movement State
// --------------------
const keys = {};
const moveSpeed = 1.0;
const rotateSpeed = 0.03;
let yaw = 0;

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') controls.forward = true;
  if (e.code === 'KeyS') controls.backward = true;
  if (e.code === 'KeyA') controls.left = true;
  if (e.code === 'KeyD') controls.right = true;
  if (e.code === 'ArrowLeft') controls.rotateLeft = true;
  if (e.code === 'ArrowRight') controls.rotateRight = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') controls.forward = false;
  if (e.code === 'KeyS') controls.backward = false;
  if (e.code === 'KeyA') controls.left = false;
  if (e.code === 'KeyD') controls.right = false;
  if (e.code === 'ArrowLeft') controls.rotateLeft = false;
  if (e.code === 'ArrowRight') controls.rotateRight = false;
});


export function updateControls() {
  // Rotation
  if (controls.rotateLeft) yaw += rotateSpeed;
  if (controls.rotateRight) yaw -= rotateSpeed;
  camera.rotation.set(0, yaw, 0);

  // Movement
  const direction = new THREE.Vector3();
  if (controls.forward) direction.z -= 1;
  if (controls.backward) direction.z += 1;
  if (controls.left) direction.x -= 1;
  if (controls.right) direction.x += 1;

  if (direction.lengthSq() > 0) {
    direction.normalize().applyEuler(camera.rotation);
    camera.position.addScaledVector(direction, moveSpeed);
  }

  // Clamp inside room
  // camera.position.x = THREE.MathUtils.clamp(camera.position.x, -xlimit, xlimit);
  // camera.position.y = THREE.MathUtils.clamp(camera.position.y, -ylimit, ylimit);
  // camera.position.z = THREE.MathUtils.clamp(camera.position.z, -zlimit, zlimit);
}
