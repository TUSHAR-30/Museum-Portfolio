import * as THREE from 'three';
import { workExperienceConfig } from "../../public/data/workExperienceConfig";
import { createButton, createMaterial, createText } from "../utils/utils";
import gsap from "gsap";


export function createWorkExperienceStand({ instances }) {
    const { instanceData, standTitleData, experiencesData } = workExperienceConfig;
    const workExperienceStand = instances[instanceData.instanceName];

    const faceGroup = new THREE.Group();
    faceGroup.position.set(-3, 1.6, 0.01)
    workExperienceStand.add(faceGroup)

    const nextExperienceBtnMaterial=createMaterial({color:"white"})
    const nextExperienceBtnGeometry= new THREE.CircleGeometry(0.2);
    const nextExperienceBtn=createButton({
        btnGeometry:nextExperienceBtnGeometry,
        material:nextExperienceBtnMaterial,
        btnEvent:nextExperienceBtnEvent
    })
    nextExperienceBtn.position.set(3, -3.0, 0.01)
    faceGroup.add(nextExperienceBtn);
    const nextExperienceBtnText = createText({ text: ">", anchorY: "middle", anchorX: "center", fontSize: 0.4, applyBold: true });
    nextExperienceBtnText.position.set(0, 0, 0.01)
    nextExperienceBtn.add(nextExperienceBtnText)


    // TITLEData
    const { text, fontSize, position } = standTitleData;
    const title = createText({ text, fontSize, color: "#fff", maxWidth: "5", applyBold: true })
    title.position.set(...position)
    faceGroup.add(title);

    // ExperiencesData
    const experienceGroups = [];
    let currentExperienceIndex = 0;

    experiencesData.forEach((experienceData, experienceIndex) => {
        const experienceGroup = new THREE.Group();
        experienceGroup.visible = false;

        const { jobTitle, company, duration, responsibilitiesData } = experienceData;

        let yoffset = -0.5;

        const jobTitleText = createText({ text: jobTitle, fontSize: "0.2", maxWidth: "5" });
        jobTitleText.position.set(-0.2, yoffset, 0.01);
        experienceGroup.add(jobTitleText);

        const durationText = createText({ text: duration, fontSize: "0.15", maxWidth: "5" });
        durationText.position.set(4, yoffset, 0.01);
        experienceGroup.add(durationText);

        const companyText = createText({ text: company, fontSize: "0.15", maxWidth: "5" });
        companyText.position.set(0, yoffset - 0.35, 0.01);
        experienceGroup.add(companyText);

        let responsibilityOffset = yoffset - 0.7;
        responsibilitiesData.forEach(responsibilityData => {
            const responsibility = createText({
                text: responsibilityData,
                maxWidth: "6",
                fontSize: "0.15"
            });
            responsibility.position.set(0, responsibilityOffset, 0.01);
            experienceGroup.add(responsibility);
            responsibilityOffset -= 0.5;
        });

        faceGroup.add(experienceGroup);
        experienceGroups.push(experienceGroup);
    });

    const firstExperience = experienceGroups[0];
    firstExperience.visible = true;
    firstExperience.traverse(obj => {
        if (obj.material) obj.material.opacity = 1;
    });

    function hideExperience(group) {

        group.traverse(obj => {
            if (obj.material) {
                gsap.to(obj.material, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.in"
                });
            }
        });

        gsap.delayedCall(1, () => {
            group.visible = false;
        });
    }

    function showExperience(group) {
        group.visible = true;

        group.traverse(obj => {
            if (obj.material) {
                obj.material.transparent = true;
                obj.material.opacity = 0;
                gsap.to(obj.material, {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        });
    }

    function nextExperienceBtnEvent ()  {
        const currentGroup = experienceGroups[currentExperienceIndex];
        const nextIndex = (currentExperienceIndex + 1) % experienceGroups.length;
        const nextGroup = experienceGroups[nextIndex];

        hideExperience(currentGroup);

        gsap.delayedCall(1, () => {
            showExperience(nextGroup);
        });

        currentExperienceIndex = nextIndex;
    };




}