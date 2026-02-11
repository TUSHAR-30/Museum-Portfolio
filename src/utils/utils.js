import * as THREE from 'three';
import { Text } from "troika-three-text";
import { interactiveButtons } from './buttonInteractivity';

export function createText({
    text,
    fontSize = 0.1,
    color = "#000000",
    maxWidth = 1.9,
    anchorY = "top",
    anchorX = "left",
    font = '/resources/fonts/Roboto-Bold.ttf',
    applyBold = false
}) {
    const t = new Text();
    t.text = text;
    t.fontSize = fontSize;
    t.color = color;
    t.maxWidth = maxWidth;
    t.anchorX = anchorX;
    t.anchorY = anchorY;
    if (applyBold) {
        t.font = font
        // t.outlineWidth = '2%'    
        // t.outlineColor = '#24e1f2'
    }
    return t;
}

export function createButton({ material, url, width, height,btnGeometry,btnEvent }) {
    const geometry = btnGeometry || new THREE.PlaneGeometry(width || 0.25, height || 0.25);

    const button = new THREE.Mesh(geometry, material);
    button.userData = { type: "button", url, btnEvent, baseScale: button.scale.clone() };
    interactiveButtons.push(button); // 🔑 register button  
    return button;
}

export function createTexture({ label }) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, "#22c55e");
    grad.addColorStop(1, "#06b6d4");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = "#000";
    ctx.font = "bold 65px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 256, 64);

    let texture = {};
    texture.baseColor = new THREE.CanvasTexture(canvas);
    return texture;
}

export function createMaterial({ texture, color, isUpdateTextureProperties = false }) {

    if (isUpdateTextureProperties && texture?.baseColor) {
        texture.baseColor.center.set(0.5, 0.5);
        texture.baseColor.rotation = -Math.PI;
        texture.baseColor.flipY = false;
        texture.baseColor.needsUpdate = true;
    }

    const materialConfig = {
        side: THREE.DoubleSide,
        transparent: true,
        color: color ?? 0xffffff,
        metalness: 0.5,
        roughness: 0.85,
    };

    if (texture?.baseColor) materialConfig.map = texture.baseColor;
    if (texture?.ao) materialConfig.aoMap = texture.ao;
    if (texture?.metallic) materialConfig.metalnessMap = texture.metallic;
    if (texture?.roughness) materialConfig.roughnessMap = texture.roughness;
    if (texture?.normal) materialConfig.normalMap = texture.normal;

    return new THREE.MeshStandardMaterial(materialConfig);
}


export function createCrackedMaterial({ mainTexture, crackTexture }) {

    mainTexture.colorSpace = THREE.SRGBColorSpace;
    mainTexture.center.set(0.5, 0.5);
    mainTexture.rotation = -Math.PI; // 90 degrees
    mainTexture.flipY = false;
    mainTexture.updateMatrix();
    mainTexture.needsUpdate = true;

    const vertexShader = `
        uniform mat3 uvTransform;
        varying vec2 vUv;

        void main() {
            vUv = (uvTransform * vec3(uv, 1.0)).xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float crackProgress;

        void main() {
            vec4 image1=texture2D(texture1,vUv);
            vec4 image2=texture2D(texture2,vUv); 

            gl_FragColor = mix(image1,image2,crackProgress);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            texture1: { value: mainTexture },
            texture2: { value: crackTexture },
            uvTransform: { value: mainTexture.matrix },
            crackProgress: { value: 0.0 }
        }
    });

    return material;
}

export function animateCrack({ material, imageMesh }) {
    function tick() {
        material.uniforms.crackProgress.value += 0.005;
        if (material.uniforms.crackProgress.value < 0.5) {
            requestAnimationFrame(tick);
        }
    }
    tick();
}