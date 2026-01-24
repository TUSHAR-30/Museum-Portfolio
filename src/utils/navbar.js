import * as THREE from 'three';
import gsap from 'gsap';
import { camera, controls } from '../threejsCore/scene';
import { navbarConfigDesktop } from '../../public/data/navbarConfig.desktop';
import { navbarConfigMobile } from '../../public/data/navbarConfig.mobile';
import { isMobileDevice } from '../utils/device';


const nav = document.getElementById('artifact-nav');
const toggle = document.getElementById('nav-toggle');
const arrow = toggle.querySelector('.arrow');

toggle.addEventListener('click', () => {
  nav.classList.toggle('expanded');
  arrow.textContent = nav.classList.contains('expanded') ? '>' : '<';
});



function teleportTo(config) {
  const startCamPos = camera.position.clone();
  const startTarget = controls.target.clone();

  const endCamPos = new THREE.Vector3(...config.position);
  const endTarget = new THREE.Vector3(...config.target);

  const tweenData = { t: 0 };

  gsap.to(tweenData, {
    t: 1,
    duration: 1.0,
    ease: "power2.out",

    onStart() {
      controls.enabled = false;
    },

    onUpdate() {
      camera.position.lerpVectors(startCamPos, endCamPos, tweenData.t);
      controls.target.lerpVectors(startTarget, endTarget, tweenData.t);
    },

    onComplete() {
      controls.enabled = true;
      controls.update();
    }
  });
}


document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;

    const navbarConfig = isMobileDevice()
      ? navbarConfigMobile
      : navbarConfigDesktop;

    const config = navbarConfig.find(
      item => item.teleportName === targetId
    );

    if (!config) {
      console.warn(`No navbarConfig found for ${targetId}`);
      return;
    }

    teleportTo(config);

    // UX polish: collapse nav after selection
    // nav.classList.remove('expanded');
  });
});