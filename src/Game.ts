import { MultiplayerMural } from './MultiplayerMural'
import { setTimeout, addOneTimeTrigger } from './Utils'
import { Palette } from './Palette'

// Base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape('models/baseScene.glb'))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// Prepare containers
const muralContainer = new Entity()
muralContainer.addComponent(
    new Transform({
        position: new Vector3(8, 0, 12),
        rotation: Quaternion.Euler(0, 90, 0),
    })
)
engine.addEntity(muralContainer)

const paletteContainer = new Entity()
paletteContainer.addComponent(
    new Transform({
        position: new Vector3(8.5, 1, 3),
        rotation: Quaternion.Euler(0, 150, 0)
    })
)
engine.addEntity(paletteContainer)
new Palette(paletteContainer)

const multiplayerMural: MultiplayerMural = new MultiplayerMural()

// We have to split the loading process into different parts, so that the scene can load fast,
// and also users don't see the mural loading for too much time

// Initialize tiles. We are using a timeout so the scene can load first
setTimeout(2000, () => multiplayerMural.loadTiles(muralContainer))

// When the user enters the scene, it starts syncing with other players
addOneTimeTrigger(
    new Vector3(8, 0, 8),
    new Vector3(15, 8, 15),
    () => multiplayerMural.startSyncing())

// When the user is near the mural, then start showing it
addOneTimeTrigger(
    new Vector3(8, 0, 8),
    new Vector3(1, 8, 1),
    () => multiplayerMural.showMural())

