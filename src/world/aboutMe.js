import * as THREE from "three";
import { Text } from "troika-three-text";
import { aboutMeConfig } from "../../public/data/aboutMeConfig";
import { createButton, createMaterial, createText, createTexture } from "../utils/utils";
import { scene } from "../threejsCore/scene";


export function createAboutMeSection({textures}) {
    const hero = new THREE.Group();
    const data = aboutMeConfig;

    // ===============================
    // BACKGROUND PANEL (GRADIENT)
    // ===============================
    const bgTexture = createGradientTexture(
        data.panel.gradient.from,
        data.panel.gradient.to
    );

    const panelGeo = new THREE.PlaneGeometry(
        data.panel.size[0],
        data.panel.size[1]
    );

    const panelMat = new THREE.MeshStandardMaterial({
        map: bgTexture,
        roughness: 0.4,
        metalness: 0.1
    });

    const panel = new THREE.Mesh(panelGeo, panelMat);
    hero.add(panel);

    // ===============================
    // LEFT CONTENT GROUP
    // ===============================
    const content = new THREE.Group();
    content.position.set(-30, 20, 0.05);
    hero.add(content);

    // --- "Hi, I'm"
    const hello = createText({
        text: data.content.intro,
        fontSize: 2,
        color: "#94a3b8",
        maxWidth: 10
    });
    hello.position.set(0, -1, 0);
    content.add(hello);

    // --- Name
    const name = createText({
        text: data.content.name,
        fontSize: 3,
        color: "#22c55e",
        maxWidth: 40
    });
    name.position.set(0, -3.5, 0);
    content.add(name);

    // --- Role
    const role = createText({
        text: data.content.role,
        fontSize: 2,
        color: "#4ade80",
        maxWidth: 50
    });
    role.position.set(0, -9, 0);
    content.add(role);

    // --- Description
    const desc = createText({
        text: data.content.description,
        fontSize: 1.5,
        maxWidth: 35,
        color: "#cbd5f5"
    });
    desc.position.set(0, -13, 0);
    content.add(desc);

    // ===============================
    // BUTTONS
    // ===============================
    let btnX = 4;
    data.content.buttons.forEach((btn) => {
        const texture = createTexture({ label: btn.label });
        const material = createMaterial({ texture: texture,isUpdateTextureProperties:true });
        const button = createButton({
            material,
            btnEvent:openResume,
            width: 8,
            height: 4
        })

        button.position.set(btnX, -24, 0);
        button.rotation.set(0,Math.PI,0)
        content.add(button);

        btnX += 10;
    });

    // ===============================
    // SOCIAL ICONS
    // ===============================
    let iconX = 2;
    data.content.socials.forEach((social) => {
        const texture=textures[social.iconName]
        const material=createMaterial({ texture: texture,isUpdateTextureProperties: true });
        const icon = createButton({
            material,
            url: social.url,
            width: 4,
            height: 4
        })

       

        icon.position.set(iconX, -30, 0);
        icon.rotation.set(0,Math.PI,0)
        
        content.add(icon);

        iconX += 5;
    });

    // ===============================
    // PROFILE IMAGE
    // ===============================
    const profileTex =textures[data.profileImage.profileImageName]
    const material=createMaterial({ texture: profileTex , isUpdateTextureProperties: true });

    // const profileTex = new THREE.TextureLoader().load(data.profileImage.path);
    // profileTex.colorSpace = THREE.SRGBColorSpace;

    const profile = new THREE.Mesh(
        new THREE.PlaneGeometry(...data.profileImage.size),
        material
    );

    profile.position.set(...data.profileImage.position);
    hero.add(profile);

    // ===============================
    // FINAL POSITION / ROTATION
    // ===============================
    hero.position.set(...data.panel.position);
    hero.rotation.set(...data.panel.rotation);

    scene.add(hero);

}

function openResume(){
    window.open("/resources/pdf/TusharChawla_Resume.pdf", "_blank");
}

function createGradientTexture(from, to) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, from);
    grad.addColorStop(1, to);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}