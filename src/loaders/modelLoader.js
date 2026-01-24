// loaders/modelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import preFetchResoucesPaths from '../../public/data/preFetchResourcesPaths';

export function loadModels(manager) {
  const loader = new GLTFLoader(manager);
  const { models:modelsData } = preFetchResoucesPaths;

  const modelCache = {};

  return Promise.all(
    modelsData.map(modelData => {
      return new Promise((resolve, reject) => {
        loader.load(
          modelData.modelPath,
          (gltf) => {
            gltf.scene.userData={
              animations:gltf.animations
            }
            modelCache[modelData.modelName] = gltf.scene;
            resolve();
          },
          undefined,
          reject
        );
      });
    })
  ).then(() => modelCache);
}
