import * as THREE from "three";
import { animate } from "./scene";

const loadingElement = document.getElementById("loading");
const progressBar = document.querySelector(".progress-bar");
const percentText = document.querySelector(".loader-percent");

export const manager = new THREE.LoadingManager(
  // onLoad
  () => {
    setTimeout(() => {
      loadingElement.classList.add("hidden");
      animate()
    }, 500); // small delay feels nicer
  },

  // onProgress
  (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    progressBar.style.width = `${progress}%`;
    percentText.textContent = `${Math.round(progress)}%`;
  }
);
