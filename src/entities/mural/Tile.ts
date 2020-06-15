import { TILE_SIZE, GAP_BETWEEN_TILES } from '../../Config'
import { TilePosition } from './Mural'
import { Materials } from '../../Materials'
import { Global, ColorHex } from '../../Global'
import { playSound } from '../../sounds/Sounds'

// Shape
const boxShape = new BoxShape()
boxShape.withCollisions = false

export class Tile extends Entity {

    constructor(position: TilePosition, onClickListener: (color: ColorHex) => void) {
        super()
        const xPosition = position.x * (TILE_SIZE + GAP_BETWEEN_TILES)
        const yPosition = position.y * (TILE_SIZE + GAP_BETWEEN_TILES)
        const transform = new Transform({ position: new Vector3(xPosition, yPosition, 0), scale: new Vector3(TILE_SIZE, TILE_SIZE, 0.125) })
        this.addComponent(transform)

        this.addComponent(new OnPointerDown(() => {
            // Play sound
            playSound()

            // Update this tile
            this.setColor(Global.currentColor)

            // Call listener
            onClickListener(Global.currentColor)
        },
        {
            button: ActionButton.POINTER,
            hoverText: 'Paint'
        }))
    }

    public setVisible(): void {
        this.addComponent(boxShape)
    }

    public setColor(color: ColorHex): void {
        this.addComponentOrReplace(Materials.getForColor(color))
    }
}