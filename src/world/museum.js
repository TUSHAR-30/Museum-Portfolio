import * as THREE from 'three';
import { createMaterial } from '../utils/utils';

export function hideMuseumMesh({ MuseumModel }) {
    MuseumModel.traverse((child) => {
        if (child.isMesh && (child.name == "Window1Glass" || child.name == "Window2Glass")) {
            child.visible = false
        }
    })
}

export function applyMaterialToMuseumMeshes({ MuseumModel, textures }) {

    // Create material(s)
    const materials = {
        LobbyBottomWall: createMaterial({ texture: textures.LobbyBottomWall, color: "0xe3ba72" }),
        LobbyTopWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        LobbyRightWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        LobbyLeftWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        LobbyFrontWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        FrontWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        BackWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        RightWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        LeftWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        TopWall: createMaterial({ texture: textures.Wall, color: "#a7b9c4" }),
        BottomWall: createMaterial({ texture: textures.LobbyBottomWall, color: "0xc4a7ad" }),
        Gate: createMaterial({ texture: textures.Gate }),
    };

    MuseumModel.traverse((child) => {

        if (child.isMesh && materials[child.name]) {
            child.material = materials[child.name]

            // IMPORTANT for aoMap
            if (!child.geometry.attributes.uv2) {
                child.geometry.setAttribute(
                    'uv2',
                    new THREE.BufferAttribute(
                        child.geometry.attributes.uv.array,
                        2
                    )
                );
            }
        }
    });
}