import * as THREE from 'three';
import { scene } from "../threejsCore/scene";
import { framesConfig } from '../../public/data/frameConfig';
import { animateCrack, createButton, createCrackedMaterial, createMaterial, createText } from '../utils/utils';

export function addFrameModelsToScene({ instances, textures }) {
    framesConfig.forEach(frameConfig => {
        const frameModel = instances[frameConfig.instanceName];
        if(!frameModel) return;
        const frameTexture = textures[frameConfig.frameImageName]
        const imageMaterial = createMaterial({ texture: frameTexture, isUpdateTextureProperties: true })
        // const imageMaterial = createCrackedMaterial({ mainTexture:frameTexture.baseColor,crackTexture:textures.Crack.baseColor })

        frameModel.traverse(child => {
            if (child.isMesh && (child.name == "Image" || child.name == "Photo")) {
                child.material = imageMaterial
                // setTimeout(() => {
                //     animateCrack({material:imageMaterial, imageMesh: child})
                // }, 5000);
            }

            if (child.isMesh && child.name == "Outer") {
                child.material = new THREE.MeshStandardMaterial({
                    color: "#D4AF37",
                    metalness: 0.5,
                    roughness: 0.5
                })
            }

            if (child.isMesh && child.name == "Content" && frameConfig.category?.categoryName == "ProjectShowCaseFrame") {
                const contentGroup = new THREE.Group();
                contentGroup.position.set(0.05, -0.2, 0.95);
                contentGroup.rotation.set(0, 1.57, 0)

                const { projectTitle: titleData, projectDescription: descriptionData, githubLink: githubLinkData, demoLink: demoLinkData } = frameConfig.category

                const titleText = createText({ text: titleData, fontSize: 0.18, anchorY: "top", anchorX: "left" });
                titleText.position.set(0, 0, 0);
                contentGroup.add(titleText)

                const descriptionText = createText({ text: descriptionData, fontSize: 0.1, anchorY: "top", anchorX: "left" });
                descriptionText.position.set(0, -0.25, 0);
                contentGroup.add(descriptionText)

                const githubBtn = createButton({ material: createMaterial({ texture: textures.GithubLogo, isUpdateTextureProperties: true }), url: githubLinkData });
                githubBtn.position.set(0.125, -0.92, 0)
                contentGroup.add(githubBtn)

                const demoBtn = createButton({ material: createMaterial({ texture: textures.DemoLogo, isUpdateTextureProperties: true }), url: demoLinkData });
                demoBtn.position.set(0.5, -0.92, 0)
                contentGroup.add(demoBtn)

                child.add(contentGroup)
            }
        })

    })
}
