
import { ColorHex } from "./Mural"
import { Materials } from "./Materials"

const INITIAL_COLORS: ColorHex[] = [
    `#E4A672`,
    `#B86F50`,
    `#743F39`,
    `#3F2832`,
    `#9E2835`,
    `#E53B44`,
    `#FB922B`,
    `#FFE762`,
    `#63C64D`,
    `#327345`,
    `#193D3F`,
    `#4F6781`,
    `#AFBFD2`,
    `#2CE8F4`,
    `#0484D1`,
    `#FFFFFF`,
]

export let currentColor: ColorHex = `#E4A672`

export class Palette extends Entity {

    private readonly swatches: Swatch[] = []

    constructor(parent: Entity) {
        super()
        this.setParent(parent)
        this.addComponent(new Transform({ scale: new Vector3(1, 1, 1) }))
        this.addComponent(new PlaneShape())
        this.addComponent(Materials.getForColor('#666666'))
        engine.addEntity(this)

        // Add swatches
        let rowY = 0
        for (let i = 0; i < INITIAL_COLORS.length; i++) {
            const x = ((i % 4) + 1) / 6 - 0.43
            if (i % 4 === 0) {
                rowY -= 0.17
            }
            const y = rowY + 0.45

            const swatch = new Swatch(INITIAL_COLORS[i], x, y)
            swatch.setParent(this)
            engine.addEntity(swatch)
            this.swatches.push(swatch)
        }
    }
}

class Swatch extends Entity {

    constructor(
        private color: ColorHex,
        x: number,
        y: number) {
        super()
        this.addComponent(new Transform({ position: new Vector3(x, y, -0.001), scale: new Vector3(0.16, 0.16, 0.1) }))
        this.addComponent(Materials.getForColor(color))
        this.addComponent(new PlaneShape())
        const self = this
        this.addComponent(new OnPointerDown(({ buttonId }) => {
            if (buttonId === 1) {
                // Pick color
                currentColor = this.color
            } else if (buttonId === 2) {
                // Change swatch
                canvas.visible = true
                textInput.placeholder = this.color
                textInput.onTextSubmit = new OnTextSubmit((x) => {
                    this.color = x.text.trim().slice(0, 7)
                    self.addComponentOrReplace(Materials.getForColor(this.color))
                    canvas.visible = false
                    currentColor = this.color
                })
            }
        },
            { button: ActionButton.ANY, hoverText: 'E - Pick Color\nF - Change Swatch' }
        )
        )
    }
}

const canvas = new UICanvas()
canvas.visible = false

const textInput = new UIInputText(canvas)
textInput.width = "140px"
textInput.height = "35px"
textInput.vAlign = "bottom"
textInput.hAlign = "center"
textInput.fontSize = 30
textInput.placeholderColor = Color4.Gray()
textInput.positionY = "200px"
textInput.isPointerBlocker = true