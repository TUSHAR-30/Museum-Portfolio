import * as THREE from 'three';
import { skillsConfig } from '../../public/data/skillsConfig';
import { createButton, createMaterial, createText } from '../utils/utils';
import { scene } from '../threejsCore/scene';
import gsap from 'gsap';

export function placeSkillsStand({ instances,textures }) {
    const { instanceData, standTitleData, skillsData, gridData } = skillsConfig;
    const skillsStand = instances[instanceData.instanceName];


    let glassMesh, GLASS_MIN_X, GLASS_MAX_X;
    const skillItems = [];

    skillsStand.traverse((child) => {
        if (child.isMesh && child.name == "Glass") {
            glassMesh = child;

            const glassBoxWorld = new THREE.Box3().setFromObject(glassMesh);

            // Convert world → glass local space
            const glassInverseMatrix = new THREE.Matrix4()
                .copy(glassMesh.matrixWorld)
                .invert();

            glassBoxWorld.applyMatrix4(glassInverseMatrix);

            GLASS_MIN_X = glassBoxWorld.min.x;
            GLASS_MAX_X = glassBoxWorld.max.x;

            // const helper = new THREE.Box3Helper(glassBoxWorld, 0x00ff00);
            // skillsStand.add(helper);


            // console.log(GLASS_MIN_X, GLASS_MAX_X);


        }
    })

    const faceGroup = new THREE.Group();
    faceGroup.position.set(-3, 1.6, 0)

    // TITLEData
    const { text, fontSize, position } = standTitleData;
    const title = createText({ text, fontSize, color: "#fff", applyBold: true })
    title.position.set(...position)
    faceGroup.add(title);

    // SKILLS GRID
    const { columns, rowSpacing, colSpacing, start } = gridData;

    skillsData.forEach((skill, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        const skillItem = createSkillItem(skill,textures);
        skillItem.position.set(
            start[0] + col * colSpacing,
            start[1] - row * rowSpacing,
            start[2]
        );
        skillItems.push(skillItem);
        faceGroup.add(skillItem);
    });

    function updateSkillVisibility() {
        skillItems.forEach(item => {
            const x = item.position.x + faceGroup.position.x;

            // hide if fully outside glass
            item.visible = x > GLASS_MIN_X && x < GLASS_MAX_X;
        });
    }

    let slideStep = 0;       // counts slides: 0,1,2,3,...
    let direction = 1;
    updateSkillVisibility()
    const sliderTimeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 4.5 // 6s total - 1.5s animation
    });

    sliderTimeline.call(() => {
        slideSkills(direction);

        slideStep++;

        if (slideStep % 2 === 0) {
            direction *= -1;
        }
    });


    function slideSkills(direction = 1) {
        // direction: 1 = next (right arrow), -1 = previous
        const delta = direction * -7; // move left when going next

        skillItems.forEach(item => {
            gsap.to(item.position, {
                x: item.position.x + delta,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: updateSkillVisibility
            });
        });
    }

    glassMesh.add(faceGroup);
}

function createSkillItem({ iconName, name },textures) {
    const group = new THREE.Group();

    // LOGO
    const logoTexture = textures[iconName]
    const logoMaterial=createMaterial({texture:logoTexture,isUpdateTextureProperties:true});

    const logoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.9),
        logoMaterial
    );
    logoMesh.rotation.set(0,Math.PI,0)
    logoMesh.position.set(0, 0, 0);

    // TEXT
    const title = createText({ text: name, fontSize: 0.2, anchorX: "center", color: "#088F8F", applyBold: true })
    title.position.set(0, -0.5, 0)
    group.add(title);

    group.add(logoMesh, title);
    return group;
}



