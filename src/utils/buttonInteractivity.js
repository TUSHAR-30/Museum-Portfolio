import * as THREE from 'three';
import { camera, renderer } from "../threejsCore/scene";


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const interactiveButtons = []; // 🔑 only buttons
let hoveredButton = null;

renderer.domElement.addEventListener("mousemove", onMouseMove);
renderer.domElement.addEventListener("click", onClick);

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    updateButtonHover();
}

function onClick() {
    if (!hoveredButton) return;

    const { url, btnEvent } = hoveredButton.userData;
    if (btnEvent) btnEvent();
    else if (url) window.open(url, "_blank");
}



function updateButtonHover() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveButtons, false);

    if (intersects.length > 0) {
        const button = intersects[0].object;

        if (hoveredButton !== button) {
            // reset old hover
            if (hoveredButton) {
                hoveredButton.scale.copy(hoveredButton.userData.baseScale);
            }

            hoveredButton = button;

            // scale up
            hoveredButton.scale.multiplyScalar(1.2);
            renderer.domElement.style.cursor = "pointer";
        }
    } else {
        if (hoveredButton) {
            hoveredButton.scale.copy(hoveredButton.userData.baseScale);
            hoveredButton = null;
            renderer.domElement.style.cursor = "default";
        }
    }
}


export { interactiveButtons }