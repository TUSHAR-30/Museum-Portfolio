import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import { scene } from './scene';


// Lights
export function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff,1);
    dirLight1.position.set(0, 5, 0);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff,1);
    dirLight2.position.set(5, 0, 0);
    scene.add(dirLight2);
    const dirLight3 = new THREE.DirectionalLight(0xffffff,1);
    dirLight3.position.set(-5, 0, 0);
    scene.add(dirLight3);
    const dirLight4 = new THREE.DirectionalLight(0xffffff,1);
    dirLight4.position.set(0, -5, 0);
    scene.add(dirLight4);
    const dirLight5 = new THREE.DirectionalLight(0xffffff,1);
    dirLight5.position.set(0, 0, 5);
    scene.add(dirLight5);
    const dirLight6 = new THREE.DirectionalLight(0xffffff,1);
    dirLight6.position.set(0, 0, -5);
    scene.add(dirLight6);
}


// --------------------
// Environment
// --------------------
export function addSceneEnvironment({manager}) {
    new RGBELoader(manager).load('resources/images/image1.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = 1;
    });
}

// --------------------
// Video Background
// --------------------
export function createVideoasBackground() {
    const video = document.createElement('video');
    video.src = 'resources/images/nature.mp4';
    video.loop = true;
    video.muted = true;
    video.play();

    scene.background = new THREE.VideoTexture(video);
}