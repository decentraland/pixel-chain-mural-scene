import { TILE_SIZE, GAP_BETWEEN_TILES } from './Config'
import { ColorHex, TilePosition } from './Mural'
import { Materials } from './Materials'
import { currentColor } from './Palette'

// Shape
const boxShape = new BoxShape()
boxShape.withCollisions = false

// Sound
const sound = new Entity()
sound.addComponent(new Transform())
sound.getComponent(Transform).position = Camera.instance.position
sound.addComponent(new AudioSource(new AudioClip('sounds/navigationForward.mp3')))
engine.addEntity(sound)

export class Tile extends Entity {

    constructor(position: TilePosition, onClickListener: () => void) {
        super()
        const xPosition = position.x * (TILE_SIZE + GAP_BETWEEN_TILES)
        const yPosition = position.y * (TILE_SIZE + GAP_BETWEEN_TILES)
        const transform = new Transform({ position: new Vector3(xPosition, yPosition, 0), scale: new Vector3(TILE_SIZE, TILE_SIZE, 0.125) })

        this.addComponent(new OnPointerDown(() => {
            // Play sound
            sound.getComponent(AudioSource).playOnce()

            // Update this tile
            this.setColor(currentColor)

            // Call listener
            onClickListener()
        },
        {
            button: ActionButton.POINTER,
            hoverText: 'Paint'
        }))

        this.addComponent(transform)
    }

    public setVisible(): void {
        this.addComponent(boxShape)
    }

    public setColor(color: ColorHex): void {
        this.addComponentOrReplace(Materials.getForColor(color))
    }
}