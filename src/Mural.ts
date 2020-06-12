
export class Mural<T> {

    private constructor(
        private readonly mural: T[][],
        private readonly width: number,
        private readonly height: number) { }

    getTile(tile: TilePosition): T {
        if (0 <= tile.x && tile.x < this.mural.length && 0 <= tile.y && tile.y < this.mural[tile.x].length) {
            return this.mural[tile.x][tile.y]
        } else {
            throw new Error('Indexes out of bounds')
        }
    }

    getAllTiles(): { pos: TilePosition, value: T }[] {
        const result: { pos: TilePosition, value: T }[] = []
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                result.push({ pos: { x, y }, value: this.mural[x][y] })
            }
        }
        return result
    }

    setTile(tile: TilePosition, color: T) {
        if (0 <= tile.x && tile.x < this.mural.length && 0 <= tile.y && tile.y < this.mural[tile.x].length) {
            this.mural[tile.x][tile.y] = color
        } else {
            throw new Error('Indexes out of bounds')
        }
    }

    toJson(): string {
        return JSON.stringify(this.mural)
    }

    static fromJSON<T>(text: string): Mural<T> {
        const mural: T[][] = JSON.parse(text)
        const width = mural.length
        const height = mural[0].length
        return new Mural(mural, width, height)
    }

    static initializeEmpty<T>(width: number, height: number, startValue?: (position: TilePosition) => T): Mural<T> {
        const result: T[][] = []
        for (let x = 0; x < width; x++) {
            result[x] = new Array<T>(height)
            if (startValue) {
                for (let y = 0; y < height; y++) {
                    result[x][y] = startValue({ x, y })
                }
            }
        }
        return new Mural(result, width, height)
    }

}

export type TilePosition = { x: number, y: number }
export type ColorHex = string