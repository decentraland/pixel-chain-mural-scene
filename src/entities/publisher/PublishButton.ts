import { MultiplayerPalette } from '../palette/MultiplayerPalette'
import { playSound } from '../../sounds/Sounds'
import { MultiplayerMural } from '../mural/MultiplayerMural'
import { Materials } from '../Materials'
import { publish } from './Publisher'
import { showInput } from '../../ui/Modals'

export class PublishButton extends Entity {
  constructor(mural: MultiplayerMural, palette: MultiplayerPalette) {
    super()

    this.addComponent(
      new OnPointerDown(
        async () => {
          // Play sound
          playSound()

          // Get current state
          const paletteColors = palette.getFullStateToShare()
          const indices = mural.getFullStateToShare()

          if (paletteColors && indices) {
            // Get input name
            showInput('NAME YOUR ART', 'NAME:', 'NAME', async (name) => {
              // Publish
              await publish(name, paletteColors, indices)
            })
          }
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Publish'
        }
      )
    )

    engine.addEntity(this)
  }

  show() {
    // This can be modified
    this.addComponent(new BoxShape())
    this.addComponent(Materials.buildMaterial(`#FF00FF`))
  }
}
