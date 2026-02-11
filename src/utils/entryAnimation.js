import gsap from "gsap";
import * as THREE from "three";

export function entryAnimation({ MuseumModel, instances, camera }) {
  return new Promise((resolve, reject) => {
    if(!MuseumModel) return;
    const GateAction = MuseumModel.userData.actions["GateOpenClose"]
    // const humanTushar = instances["HumanTushar-0"]
    // const WelComingAction = instances["HumanTushar-0"].userData.actions[" Welcoming"];

    setTimeout(() => {
      GateAction.setLoop(THREE.LoopOnce); // Set the animation to play only once
      GateAction.clampWhenFinished = true; // Keep the final pose when finished
      GateAction.play();
      // WelComingAction.setLoop(THREE.LoopOnce); // Set the animation to play only once
      // WelComingAction.clampWhenFinished = true; // Keep the final pose when finished
      // WelComingAction.play();
    }, 1000);

    // ---- visibility handling ----
    function onVisibilityChange() {
      MuseumModel.userData.mixer.timeScale = document.hidden ? 0 : 1;
      // humanTushar.userData.mixer.timeScale = document.hidden ? 0 : 1;
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    const tl = gsap.timeline();
    tl.fromTo(camera.position,
      {
        x: 0,
        y: 0,
        z: 200,
      },
      {
        x: 0,
        y: 0,
        z: 50,
        duration: 3.0,
        delay:2.5,
        ease: "none",
        onComplete() {
          document.removeEventListener("visibilitychange", onVisibilityChange);
          resolve();
        }
      }
    )

  });
}