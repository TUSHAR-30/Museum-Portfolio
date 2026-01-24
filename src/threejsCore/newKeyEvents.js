import * as THREE from 'three';
import { camera } from './scene';
import { roomDimensionConfig } from '../../public/data/roomDimensionConfig';

// controlsState.js
const keyControls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  rotateLeft: false,
  rotateRight: false,
};

function bindButton(id, key) {
  const btn = document.getElementById(id);

  const start = () => (keyControls[key] = true);
  const end = () => (keyControls[key] = false);

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


const {ROOM_WIDTH,ROOM_HEIGHT,ROOM_DEPTH}=roomDimensionConfig

// //   // Stay inside room
const zlimit = ROOM_DEPTH / 2 - 2;
const xlimit = ROOM_WIDTH / 2 - 2;
const ylimit = ROOM_HEIGHT / 2 - 2;

// --------------------
// Movement State
// --------------------
const keys = {};
const moveSpeed = 1.0;
const rotateSpeed = 0.03;

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') keyControls.forward = true;
  if (e.code === 'KeyS') keyControls.backward = true;
  if (e.code === 'KeyA') keyControls.left = true;
  if (e.code === 'KeyD') keyControls.right = true;
  if (e.code === 'ArrowLeft') keyControls.rotateLeft = true;
  if (e.code === 'ArrowRight') keyControls.rotateRight = true;
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') keyControls.forward = false;
  if (e.code === 'KeyS') keyControls.backward = false;
  if (e.code === 'KeyA') keyControls.left = false;
  if (e.code === 'KeyD') keyControls.right = false;
  if (e.code === 'ArrowLeft') keyControls.rotateLeft = false;
  if (e.code === 'ArrowRight') keyControls.rotateRight = false;
});

function rotateWithControls(angle, controls) {
  const offset = new THREE.Vector3()
    .subVectors(controls.target, camera.position);

  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

  controls.target.copy(camera.position).add(offset);
}



export function updateControls({ controls }) {
  // Rotation
  if (keyControls.rotateLeft) rotateWithControls(rotateSpeed, controls);
  if (keyControls.rotateRight) rotateWithControls(-rotateSpeed, controls);


  // Movement
const direction = new THREE.Vector3();
if (keyControls.forward) direction.z -= 1;
if (keyControls.backward) direction.z += 1;
if (keyControls.left) direction.x -= 1;
if (keyControls.right) direction.x += 1;

if (direction.lengthSq() > 0) {
  direction.normalize();
  direction.applyQuaternion(camera.quaternion);

  const nextPosition = camera.position.clone()
    .addScaledVector(direction, moveSpeed);

  // Check bounds BEFORE applying
  if (
    nextPosition.x >= -xlimit && nextPosition.x <= xlimit &&
    nextPosition.y >= -ylimit && nextPosition.y <= ylimit &&
    nextPosition.z >= -zlimit && nextPosition.z <= zlimit
  ) {
    camera.position.copy(nextPosition);
    controls.target.addScaledVector(direction, moveSpeed);
  }
}

}


export function clampToRoom(vec) {
  vec.x = THREE.MathUtils.clamp(vec.x, -xlimit, xlimit);
  vec.y = THREE.MathUtils.clamp(vec.y, -ylimit, ylimit);
  vec.z = THREE.MathUtils.clamp(vec.z, -zlimit, zlimit);
}

