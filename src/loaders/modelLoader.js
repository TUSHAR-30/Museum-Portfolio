// loaders/modelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import preFetchResoucesPaths from '../../public/data/preFetchResourcesPaths.js';

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
          () => {
            reject(
              new Error(
                `Model failed to load → name: "${modelData.modelName}", path: ${modelData.modelPath}`
              )
            );
          }
        );
      });
    })
  ).then(() => modelCache);
}
