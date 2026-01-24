import { Pane } from 'tweakpane'
import * as THREE from 'three'

export function initTweakpane({ instances }) {
    const modelNames = Object.keys(instances);

    if (modelNames.length) {

        let options = {}
        modelNames.forEach(modelName => {
            options = { ...options, [modelName]: modelName }
        })

        const params = {
            selectedModel: modelNames[0],
        }

        const pane = new Pane()
        pane.addBinding(params, 'selectedModel', { options })

        const positionFolder = pane.addFolder({ title: 'Position' })
        const rotationFolder = pane.addFolder({ title: 'Rotation' })
        const scaleFolder = pane.addFolder({ title: 'Scale' })

        let bindings = []

        function clearBindings() {
            bindings.forEach(b => b.dispose())
            bindings = []
        }

        function bindModel(model) {
            clearBindings()

            // Position
            bindings.push(
                positionFolder.addBinding(model.position, 'x', { min: -500, max: 500, step: 0.1 }),
                positionFolder.addBinding(model.position, 'y', { min: -500, max: 500, step: 0.1 }),
                positionFolder.addBinding(model.position, 'z', { min: -500, max: 500, step: 0.1 }),
            )

            // Rotation (radians)
            bindings.push(
                rotationFolder.addBinding(model.rotation, 'x', { min: -Math.PI, max: Math.PI }),
                rotationFolder.addBinding(model.rotation, 'y', { min: -Math.PI, max: Math.PI }),
                rotationFolder.addBinding(model.rotation, 'z', { min: -Math.PI, max: Math.PI }),
            )

            // Scale
            bindings.push(
                scaleFolder.addBinding(model.scale, 'x', { min: 0.001, max: 1000 }),
                scaleFolder.addBinding(model.scale, 'y', { min: 0.001, max: 1000 }),
                scaleFolder.addBinding(model.scale, 'z', { min: 0.001, max: 1000 }),
            )
        }


        pane.on('change', (ev) => {
            if (ev.target.key === 'selectedModel') {
                const model = instances[params.selectedModel]
                bindModel(model)
            }
        })

        bindModel(instances[params.selectedModel])


    }




}


