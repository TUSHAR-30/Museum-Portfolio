import { modelsConfig } from "../../public/data/modelsConfig";
import mixerAnimationManager from "../utils/mixerAnimationManager";
import { scene } from "./scene";
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';


export function addInstanceToScene({ modelCache }) {
    const instances = {};
    modelsConfig.forEach((modelConfig, modelIndex) => {
        const { modelName, modelType, modelInstances } = modelConfig;
        const model = modelCache[modelName]
        if(!model) return;
        modelInstances.forEach((modelInstance, instanceIndex) => {
            const instance = cloneModel(model);
            const { instanceName, instanceInitialTransforms } = modelInstance
            instance.name = instanceName;
            const { position, rotation, scale, visible } = instanceInitialTransforms;
            if (position != null) instance.position.set(...position)
            if (rotation != null) instance.rotation.set(...rotation)
            if (scale != null) instance.scale.set(...scale)
            instance.visible = visible

            // If any unknown error comes related to instance transforms then i will uncomment this line
            // instance.matrixAutoUpdate === true
            // instance.updateMatrixWorld(true);

            scene.add(instance);
            instances[instanceName] = instance;

            const mixer = new THREE.AnimationMixer(instance);
            instance.userData.mixer = mixer;
            instance.userData.actions = {}
            model.userData.animations.forEach((clip) => {
                instance.userData.actions[clip.name] = mixer.clipAction(clip);
                console.log(instance.userData.actions)
            });
            mixerAnimationManager.add(mixer)

        })
    })
    return instances;
}


function isSkinned(model) {
    let skinned = false;
    model.traverse(o => {
        if (o.isSkinnedMesh) skinned = true;
    });
    return skinned;
}

function cloneModel(model) {
    return isSkinned(model)
        ? cloneSkeleton(model)
        : model.clone(true);
}