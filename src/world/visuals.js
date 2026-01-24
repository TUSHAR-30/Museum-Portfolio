import * as THREE from "three";
import { scene } from "../threejsCore/scene";
import { VisualsConfig } from "../../public/data/VisualsConfig";
import { createMaterial } from "../utils/utils";

export function createVisuals({textures}){
    VisualsConfig.forEach((visualConfig,index)=>{
        const {position,scale,rotation,visualImageName}=visualConfig
        const visual=new THREE.Mesh(
            new THREE.PlaneGeometry(2,2),
            createMaterial({texture:textures[visualImageName],isUpdateTextureProperties:true}) 
        )
        visual.position.set(...position)
        visual.rotation.set(...rotation)
        visual.scale.set(...scale)
        // console.log(visual)
        scene.add(visual)
    })
}