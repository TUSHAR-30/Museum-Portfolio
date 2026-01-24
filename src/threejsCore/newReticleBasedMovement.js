import { camera, renderer, scene } from './scene';
import * as THREE from 'three';
import gsap from 'gsap';

export function createReticleBasedMovement({ controls }) {

    // Reticle (visual target on floor)
    const reticle = new THREE.Mesh(
        new THREE.RingGeometry(2, 3, 32),
        new THREE.MeshBasicMaterial({ color: "white" })
    );

    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    controls.addEventListener('start', () => {
        document.body.style.cursor = 'grabbing';
    });
    controls.addEventListener('end', () => {
        document.body.style.cursor = 'default';
    });

    let pointerDown = false;
    let moved = false;
    let startX = 0;
    let startY = 0;

    const MOVE_THRESHOLD = 6; // pixels
    renderer.domElement.addEventListener('pointerdown', (e) => {
        pointerDown = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
    });

    renderer.domElement.addEventListener('pointermove', (e) => {
        if (!pointerDown) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (dx * dx + dy * dy > MOVE_THRESHOLD * MOVE_THRESHOLD) {
            moved = true;
        }
    });

    renderer.domElement.addEventListener('pointerup', () => {
        pointerDown = false;

        // ❌ dragged → ignore
        if (moved) return;

        // ❌ no reticle → ignore
        if (!reticle.visible) return;

        moveCameraTo(reticle.position);
    });

    window.addEventListener("pointermove", (e) => {
        updateMouse(e);

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(scene);
        if (hits.length > 0 && hits[0].object.name == "BottomWall") {
            const hitPoint = hits[0].point.clone().add(new THREE.Vector3(0, 0.01, 0));
            reticle.position.copy(hitPoint);
            // console.log(reticle.position)
            reticle.visible = true;
        } else {
            reticle.visible = false;
        }
    });

    function moveCameraTo(point) {
        const startCamPos = camera.position.clone();
        const startTarget = controls.target.clone();

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);

        const endCamPos = new THREE.Vector3(point.x, 0, point.z);
        const endTarget = endCamPos.clone().add(forward);

        gsap.to({ t: 0 }, {
            t: 1,
            duration: 0.8,
            ease: "power2.out",

            onStart() {
                controls.enabled = false;
                reticle.material.transparent = true;
                reticle.material.opacity = 0;
            },

            onUpdate() {
                const t = this.targets()[0].t;

                camera.position.lerpVectors(startCamPos, endCamPos, t);
                controls.target.lerpVectors(startTarget, endTarget, t);
            },

            onComplete() {
                controls.enabled = true;
                reticle.material.opacity = 1;
                controls.update();
            }
        });
    }

    function updateMouse(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

}
