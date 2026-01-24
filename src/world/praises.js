import * as THREE from "three";
import { scene } from "../threejsCore/scene";
import { createButton, createMaterial, createText, createTexture } from "../utils/utils";
import { praisesConfig } from "../../public/data/praisesConfig";
import gsap from "gsap";


export function createPraises({ instances, textures }) {
    const { instanceData, praisesTitleData, praisesData } = praisesConfig;
    const praisesStand = instances[instanceData.instanceName];

    let glassMesh;
    praisesStand.traverse((child) => {
        if (child.isMesh && child.name == "Glass") {
            glassMesh = child;
        }
        if (child.isMesh && child.name === "Stand") {
            child.material = new THREE.MeshNormalMaterial()
        
            const text = createText({
                text: praisesTitleData.text.toUpperCase(),
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
            mesh.rotation.set(0,3.14,0)
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

    praisesData.forEach((praiseData, index) => {

        const group = new THREE.Group();
        glassMeshGroup.add(group)

        const praiseTitleTexture = textures[praiseData.praiseTitle];
        const praiseTitleMaterial = createMaterial({ texture: praiseTitleTexture, isUpdateTextureProperties: true })
        const praiseTitlePhoto = new THREE.Mesh(
            new THREE.PlaneGeometry(2.15, 1.0),
            praiseTitleMaterial
        );
        praiseTitlePhoto.position.set(0, 0, 0);
        praiseTitlePhoto.rotation.set(0, 3.14, 0)
        group.add(praiseTitlePhoto)


        const colleagueTexture = textures[praiseData.colleaguePohto];
        const colleagueMaterial = createMaterial({ texture: colleagueTexture,isUpdateTextureProperties:true })
        const colleaguePhoto = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.5),
            colleagueMaterial
        );
        colleaguePhoto.position.set(-0.8, -0.85, 0);
        group.add(colleaguePhoto)

        const collegueText = createText({ text: praiseData.praiseText, fontSize: "0.1", maxWidth: "1.5", applyBold: true });
        collegueText.position.set(-0.38, -0.6, 0);
        group.add(collegueText)

        const collegueName = createText({ text: `By ( ${praiseData.colleagueName} )`, fontSize: "0.1", maxWidth: "1.5", applyBold: true });
        collegueName.position.set(-0.38, -1.1, 0);
        group.add(collegueName)

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