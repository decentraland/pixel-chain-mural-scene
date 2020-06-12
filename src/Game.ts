import { MultiplayerMural } from './mural/MultiplayerMural'
import { setTimeout, addOneTimeTrigger } from './Utils'
import { MultiplayerPalette } from './palette/MultiplayerPalette'

// Base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape('models/baseScene.glb'))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// Add palette
const palette = new MultiplayerPalette()
palette.addComponent(
    new Transform({
        position: new Vector3(8.5, 1, 3),
        rotation: Quaternion.Euler(0, 150, 0),
        scale: new Vector3(1, 1, 1),
    })
)

// Add mural
const mural: MultiplayerMural = new MultiplayerMural()
mural.addComponent(
    new Transform({
        position: new Vector3(8, 0, 12),
        rotation: Quaternion.Euler(0, 90, 0),
    })
)

// We have to split the loading process into different parts, so that the scene can load fast,
// and also users don't see the mural loading for too much time

// Initialize the entities. We are using a timeout so the scene can load first
setTimeout(2000, () => {
    mural.startLoading()
    palette.startLoading()
})

// When the user enters the scene, it starts syncing with other players
addOneTimeTrigger(
    new Vector3(8, 0, 8),
    new Vector3(15, 8, 15),
    () => {
        mural.startSyncing()
        palette.startSyncing();
        palette.show();
    })

// When the user is near the mural, then start showing it
addOneTimeTrigger(
    new Vector3(8, 0, 8),
    new Vector3(1, 8, 1),
    () => mural.show())

