import { MURAL_WIDTH, MURAL_HEIGHT, EMPTY_COLOR } from "../../Config"
import { Mural, TilePosition } from "./Mural"
import { Tile } from "./Tile"
import { shuffleArray } from "../../Utils"
import { MultiplayerEntity } from "../MultiplayerEntity"
import { ColorHex } from "../../Global"

// A mural than can be shared with other players
export class MultiplayerMural extends MultiplayerEntity<TilePosition, ColorHex, string> {

    constructor() {
        super('mural')
    }

    private colorMural: Mural<ColorHex>
    private entityMural: Mural<Tile>

    protected runInitialLoad(): void {
        this.entityMural = Mural.initializeEmpty(MURAL_WIDTH, MURAL_HEIGHT, (position) => {
            const tile = new Tile(position, (color) => this.changeEntity(position, color))
            tile.setParent(this)
            return tile
        })
    }

    protected getFullStateDefaults(): string {
        return Mural.initializeEmpty(MURAL_WIDTH, MURAL_HEIGHT, () => EMPTY_COLOR).toJson()
    }

    protected initializeWithFullState(fullState: string): void {
        this.colorMural = Mural.fromJSON<ColorHex>(fullState)

        // Set the colors on the mural
        this.colorMural.getAllTiles()
            .forEach(({ pos, value: color }) => this.entityMural.getTile(pos).setColor(color))
    }

    protected getFullStateToShare(): string {
        return this.colorMural?.toJson()
    }

    protected setAsVisible(): void {
        const tiles = shuffleArray(this.entityMural.getAllTiles());
        tiles.forEach(({ value: tile }) => tile.setVisible())
    }

    protected onChange(position: TilePosition, color: ColorHex): void {
        this.colorMural.setTile(position, color)
        this.entityMural.getTile(position).setColor(color)
    }

}