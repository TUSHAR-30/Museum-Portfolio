import * as THREE from 'three';
import { camera } from "../threejsCore/scene";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const interactiveButtons = []; // 🔑 only buttons
let hoveredButton = null;

window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    updateButtonHover()
});


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
            document.body.style.cursor = "pointer";
        }
    } else {
        if (hoveredButton) {
            hoveredButton.scale.copy(hoveredButton.userData.baseScale);
            hoveredButton = null;
            document.body.style.cursor = "default";
        }
    }
}

window.addEventListener("click", () => {
    if (!hoveredButton) return;

    const { url, btnEvent } = hoveredButton.userData;
    if (btnEvent) btnEvent()
    else if (url) {
        window.open(url, "_blank");
    }
});

export { interactiveButtons }