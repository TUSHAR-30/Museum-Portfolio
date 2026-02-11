// // src/main.js

import { loadModels } from "./loaders/modelLoader.js";
import { loadTextures } from "./loaders/textureLoader.js";
import { addLights, addSceneEnvironment, createVideoasBackground } from "./threejsCore/lights.js";
import { manager } from './threejsCore/loadingManager.js';
import { animate, camera } from "./threejsCore/scene.js"
import { applyMaterialToMuseumMeshes, hideMuseumMesh } from './world/museum.js';
import { addFrameModelsToScene } from './world/frame.js';
import { createAboutMeSection } from './world/aboutMe.js';
import { initTweakpane } from './utils/tweakpane.js';
import { placeSkillsStand } from './world/skills.js';
import { createWorkExperienceStand } from './world/workExperience.js';
import { createPraises } from './world/praises.js';
import { addInstanceToScene } from './threejsCore/instancesSceneAddition.js';
import { createEducation } from './world/education.js';
import { createVisuals } from './world/visuals.js';
import { entryAnimation } from "./utils/entryAnimation.js";
import { createOribtControls } from "./threejsCore/orbitControls.js";
import { createReticleBasedMovement } from "./threejsCore/newReticleBasedMovement.js";
import { createNavbar } from "./utils/navbar.js";


// addLights()
addSceneEnvironment({ manager });
createVideoasBackground();


// --------------------
// Load Models and Textures
// --------------------
Promise.all([
  loadModels(manager),
  loadTextures(manager)
]).then(([modelCache, textures]) => {

  const instances = addInstanceToScene({ modelCache })
  const MuseumModel = instances["Museum-0"]
  hideMuseumMesh({ MuseumModel })

  // Apply material to Museummeshes
  applyMaterialToMuseumMeshes({ MuseumModel, textures })

  // addFrameModel
  addFrameModelsToScene({ instances, textures })

  // Create Aboutme section
  createAboutMeSection({ textures })

  // Create skills stand
  placeSkillsStand({ instances, textures })

  // Work experince stand
  createWorkExperienceStand({ instances })

  // Praises
  createPraises({ instances, textures })

  // Education
  createEducation({ instances, textures })

  // Create Visuals
  createVisuals({ textures })

  // Entry Animation
  entryAnimation({ MuseumModel, instances, camera }).then(() => {
    const controls = createOribtControls();
    createReticleBasedMovement({ MuseumModel, controls })
    createNavbar({ controls })
  })

  // // // Initialise Tweakpane
  // initTweakpane({ instances })

  const loadingElement = document.getElementById("loading");
  loadingElement.classList.add("hidden");
  animate()


})
  .catch(err => {
    console.error("❌ Asset loading error:");
    console.error(err.message);

    const progressContainer = document.querySelector(".progress-container");
    const percentText = document.querySelector(".loader-percent");
    const loaderTitle = document.querySelector(".loader-title");

    loaderTitle.innerHTML = "Something went wrong.\nPlease try again later.";
    progressContainer.style.display = "none"
    percentText.style.display = "none"
  })