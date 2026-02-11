import * as THREE from "three";
import { scene } from "../threejsCore/scene";
import { createButton, createMaterial, createText, createTexture } from "../utils/utils";
import { praisesConfig } from "../../public/data/praisesConfig";
import gsap from "gsap";
import { educationConfig } from "../../public/data/educationConfig";


export function createEducation({ instances, textures }) {
    const { instanceData, educationTitleData, educationsData } = educationConfig;
    const praisesStand = instances[instanceData.instanceName];
    if(!praisesStand) return;

    let glassMesh;
    praisesStand.traverse((child) => {
        if (child.isMesh && child.name == "Glass") {
            glassMesh = child;
        }
        if (child.isMesh && child.name === "Stand") {
            child.material = new THREE.MeshNormalMaterial()
        
            const text = createText({
                text: educationTitleData.text.toUpperCase(),
                anchorX: "center",
                fontSize: "0.2",
                applyBold: true
            })
            text.position.set(0, 1.2, -1.3)
            text.rotation.set(0, Math.PI, 0)
            child.add(text)
        
            const material = createMaterial({
                texture: textures["Swan"],
                isUpdateTextureProperties: true
            })
        
            // IMPORTANT: enable transparency
            material.transparent = true
            material.opacity = 1
        
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.25, 1.5),
                material
            )
            mesh.position.set(0, 1.08, -1.31)
            child.add(mesh)
        
            // GSAP opacity animation loop
            const tl = gsap.timeline({ repeat: -1 })
        
            tl
                .to(material, {
                    opacity: 0,
                    duration: 5,
                    delay: 8,
                    ease: "power2.inOut"
                })
                .to(material, {
                    opacity: 1,
                    duration: 5,
                    delay: 8,
                    ease: "power2.inOut"
                })
        }
        
    })

    const praises = [];

    const glassMeshGroup = new THREE.Group();
    glassMeshGroup.position.set(0, 3.2, -1.3);
    glassMeshGroup.rotation.set(0, 3.14, 0)
    glassMesh.add(glassMeshGroup)

    educationsData.forEach((educationData, index) => {

        const group = new THREE.Group();
        glassMeshGroup.add(group)

        const educationTexture = textures[educationData.educationPhoto];
        const educationMaterial = createMaterial({ texture: educationTexture,isUpdateTextureProperties:true })
        const educationPhoto = new THREE.Mesh(
            new THREE.PlaneGeometry(2.15,1.0),
            educationMaterial
        );
        educationPhoto.position.set(0,0,0);
        educationPhoto.rotation.set(0,3.14,0)
        group.add(educationPhoto)

        const percentageTexture = textures[educationData.percentagePhoto];
        const percentageMaterial = createMaterial({ texture: percentageTexture,isUpdateTextureProperties:true })
        const percentagePhoto = new THREE.Mesh(
            new THREE.PlaneGeometry(2.35,0.5),
            percentageMaterial
        );
        percentagePhoto.position.set(0,-0.75,0);
        percentagePhoto.rotation.set(0,3.14,0)
        group.add(percentagePhoto)

        const institutionTexture = textures[educationData.institutionPhoto];
        const institutionMaterial = createMaterial({ texture: institutionTexture,isUpdateTextureProperties:true })
        const institutionPhoto = new THREE.Mesh(
            new THREE.PlaneGeometry(2.35,0.5),
            institutionMaterial
        );
        institutionPhoto.position.set(0,-1.15,0);
        institutionPhoto.rotation.set(0,3.14,0)
        group.add(institutionPhoto)

        

        group.scale.set(0.8, 0.8, 0.8);
        group.visible = false;

        // Enable opacity animation for all meshes/text
        group.traverse(child => {
            if (child.material) {
                child.material.transparent = true;
                child.material.opacity = 0;
            }
        });


        praises.push(group)



    })
    updatePraisesVisiblity()

    function updatePraisesVisiblity() {
        let currentIndex = 0;
    
        const showPraise = (index) => {
            const praise = praises[index];
    
            praise.visible = true;
    
            // Animate IN
            gsap.to(praise.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                ease: "power2.out"
            });
    
            praise.traverse(child => {
                if (child.material) {
                    gsap.to(child.material, {
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });
    
            // Hold for 5 seconds, then animate OUT
            gsap.delayedCall(5, () => hidePraise(index));
        };
    
        const hidePraise = (index) => {
            const praise = praises[index];
    
            // Animate OUT
            gsap.to(praise.scale, {
                x: 0.8,
                y: 0.8,
                z: 0.8,
                duration: 0.5,
                ease: "power2.in"
            });
    
            praise.traverse(child => {
                if (child.material) {
                    gsap.to(child.material, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.in"
                    });
                }
            });
    
            // After animation, hide and show next praise
            gsap.delayedCall(0.6, () => {
                praise.visible = false;
                currentIndex = (currentIndex + 1) % praises.length;
                showPraise(currentIndex);
            });
        };
    
        // Start the cycle
        showPraise(currentIndex);
    }
    

}