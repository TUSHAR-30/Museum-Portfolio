// Don't render scene until the assets are downloaded.
// Load models and textures parallely . If anyone fails then don't render the scene.
// If both models and textures are downloaded then Create Material for museum and then traverse on model and apply the material accordingly.// src/scene.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// --------------------
// Scene
// --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// --------------------
// Camera
// --------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 40);

// --------------------
// Lights
// --------------------
scene.add(new THREE.AmbientLight(0xffffff, 2.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --------------------
// Renderer
// --------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

document.body.appendChild(renderer.domElement);


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

// export { scene, camera, renderer }

const controls = new OrbitControls(camera, renderer.domElement);


const data = {
    modelPaths: ["/resources/models/Ghost.glb", "/resources/models/Museum.glb", "/resources/models/FrameWithContent.glb"],
    texturePaths: ["/resources/images/door.jpg", "/resources/images/Wall.jpg"]
}

function loadModels() {

    const p = new Promise((resolve, reject) => {

        const modelCache = []
        const modelPaths = data.modelPaths;
        const modelLoader = new GLTFLoader();

        modelPaths.forEach((modelPath) => {
            console.log("inside loading")
            modelLoader.load(modelPath, gltf => {
                modelCache.push(gltf.scene);
                if (modelCache.length == modelPaths.length) resolve(modelCache)
            }, () => { },
                (err) => {
                    reject(err)
                }
            )
        })

    })

    return p;

}
function loadTextures() {

    const p = new Promise((resolve, reject) => {

        const textureCache = []
        const texturePaths = data.texturePaths;
        const textureLoader = new THREE.TextureLoader()

        texturePaths.forEach((texturePath) => {
            console.log("inside loading")
            textureLoader.load(texturePath, texture => {
                textureCache.push(texture);
                if (textureCache.length == texturePaths.length) resolve(textureCache)
            }, () => { },
                (err) => {
                    reject(err)
                }
            )
        })

    })

    return p;

}

async function loadAssets() {
    const loadingText=document.querySelector("#loading")
    Promise.all([loadModels(), loadTextures()])
    .then((data)=>{
        console.log("All assets are loaded",data)
        loadingText.style.display="none";
        data[0].forEach(model=>scene.add(model))
        animate()
    })
    .catch(err=>{
        console.dir(err)
        loadingText.innerHTML="Something went wrong"
    })
    

}
loadAssets()