// loaders/modelLoader.js
import * as THREE from 'three';
import preFetchResoucesPaths from '../../public/data/preFetchResourcesPaths';

export function loadTextures(manager) {
  const loader = new THREE.TextureLoader(manager);
  const { textures: texturesData } = preFetchResoucesPaths;

  const textureCache = {};

  const promises = [];

  texturesData.forEach((textureEntry) => {
    const { textureID, textureName, texturePath } = textureEntry;

    textureCache[textureName] = {};

    Object.entries(texturePath).forEach(([mapType, path]) => {
      const promise = new Promise((resolve, reject) => {
        loader.load(
          path,
          (texture) => {
            // Common texture settings for PBR
            texture.colorSpace =
              mapType === 'baseColor'
                ? THREE.SRGBColorSpace
                : THREE.SRGBColorSpace;

            texture.flipY = false;

            textureCache[textureName][mapType] = texture;
            resolve();
          },
          undefined,
          (err) => {
            console.error('❌ Texture failed to load:', {
              textureName,
              mapType,
              path,
            });
            (err) => {
              reject(
                new Error(
                  `Texture failed → texture: "${textureName}", map: "${mapType}", path: ${path}`
                )
              );
            }
            
          }
        );
      });

      promises.push(promise);
    });
  });

  return Promise.all(promises).then(() => textureCache);
}
