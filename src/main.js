// // src/main.js

import { loadModels } from "./loaders/modelLoader.js";
import { loadTextures } from "./loaders/textureLoader.js";
import { addLights, addSceneEnvironment, createVideoasBackground } from "./threejsCore/lights.js";
import { manager } from './threejsCore/loadingManager.js';
import { camera, controls } from "./threejsCore/scene.js"
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
import { createReticleBasedMovement } from "./threejsCore/newReticleBasedMovement.js";
import "./utils/navbar.js"


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

  // Create reticleBased Movement
  createReticleBasedMovement({ MuseumModel, controls })

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

  // // // Initialise Tweakpane
  // initTweakpane({ instances })


});