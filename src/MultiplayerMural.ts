import { MURAL_WIDTH, MURAL_HEIGHT, EMPTY_COLOR } from "./Config"
import { Mural, TilePosition, ColorHex } from "./Mural"
import { Tile } from "./tile"
import { setTimeout, shuffleArray } from "./Utils"
import { currentColor } from "./Palette"

// A mural than can be shared with other players
export class MultiplayerMural {

    private readonly messageBus = new MessageBus()
    private visible = false
    private initialSynced = false
    private colorMural: Mural<ColorHex>
    private entityMural: Mural<Tile>

    constructor() {
        // Register to answer anyone who asks about the mural state
        this.messageBus.on(NEED_ALL, (_, sender) => {
            if (sender !== 'self') {
                if (this.colorMural) {
                    this.messageBus.emit(HERE_IS_ALL, { colorMural: this.colorMural.toJson() })
                }
            }
        })

        // Listen to changes
        this.messageBus.on(CHANGE, ( { position, color }, sender) => {
            if (sender !== 'self') {
                this.colorMural.setTile(position, color)
                this.entityMural.getTile(position).setColor(color)
            }
        })
    }

    loadTiles(parentScene: Entity) {
        this.entityMural = Mural.initializeEmpty(MURAL_WIDTH, MURAL_HEIGHT, (position) => {
            const tile = new Tile(position, () => this.changedTile(position, currentColor))
            tile.setParent(parentScene)
            return tile
        })
    }

    startSyncing() {
        // Prepare for answer
        this.messageBus.on(HERE_IS_ALL, ({ colorMural: colorMuralJson }) => {
            if (!this.initialSynced) {
                this.initialSynced = true
                const colorMural = Mural.fromJSON<ColorHex>(colorMuralJson)
                this.loadColorMural(colorMural)
            }
        })

        // Ask for the mural state
        this.messageBus.emit(NEED_ALL, { })

        // Set fallback. If got no response in a few seconds, then start empty
        setTimeout(2000, () => {
            if (!this.initialSynced) {
                this.initialSynced = true
                this.loadColorMural(Mural.initializeEmpty(MURAL_WIDTH, MURAL_HEIGHT, () => EMPTY_COLOR))
            }
        })
    }

    showMural() {
        if (!this.visible) {
            this.visible = true
            const tiles = shuffleArray(this.entityMural.getAllTiles());
            tiles.forEach(({ value: tile }) => tile.setVisible())
        }
    }

    private changedTile(position: TilePosition, color: ColorHex): void {
        this.colorMural.setTile(position, color)
        this.entityMural.getTile(position).setColor(color)
        this.messageBus.emit(CHANGE, { position, color })
    }

    private loadColorMural(colorMural: Mural<ColorHex>) {
        this.colorMural = colorMural

        // Set the colors on the mural
        colorMural.getAllTiles()
            .forEach(({ pos, value: color }) => this.entityMural.getTile(pos).setColor(color))
    }

}

const NEED_ALL = 'needAll'
const HERE_IS_ALL = 'hereIsAll'
const CHANGE = 'tileChange'