import { ColorHex, Global } from "../Global"
import { SwatchIndex } from "./MultiplayerPalette"
import { Materials } from "../Materials"

export class Swatch extends Entity {

    private color: ColorHex

    constructor(index: SwatchIndex, onSwatchChangeListener: (color: ColorHex) => void) {
        super()
        const x = ((index % 4) + 1) / 6 - 0.43
        const y = Math.floor(index / 4) * -0.17 + 0.25
        this.addComponent(new Transform({ position: new Vector3(x, y, -0.001), scale: new Vector3(0.16, 0.16, 0.1) }))
        this.addComponent(new OnPointerDown(({ buttonId }) => {
            if (buttonId === 1) {
                // Pick color
                Global.currentColor = this.color
            } else if (buttonId === 2) {
                // Change swatch
                canvas.visible = true
                textInput.placeholder = this.color
                textInput.onTextSubmit = new OnTextSubmit((x) => {
                    // TODO: Validate color
                    const color = x.text.trim().slice(0, 7)
                    this.setColor(color)
                    canvas.visible = false
                    Global.currentColor = this.color
                    onSwatchChangeListener(color)
                })
            }
        },
        { button: ActionButton.ANY, hoverText: 'E - Pick Color\nF - Change Swatch' }))
    }

    public setColor(color: ColorHex) {
        this.color = color
        this.addComponentOrReplace(Materials.getForColor(color))
    }

    public setVisible() {
        this.addComponentOrReplace(new PlaneShape())
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