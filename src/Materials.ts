import { ColorHex } from "./Global"

export class Materials {

    private static materials: any = { }

    static getForColor(color: ColorHex) {
        const material = Materials.materials[color]
        if (!material) {
            const newMaterial = this.buildMaterial(color)
            Materials.materials[color] = newMaterial
            return newMaterial
        }
        return material
    }

    private static buildMaterial(color: ColorHex): Material {
        const material = new Material()
        material.albedoColor = Color3.FromHexString(color)
        material.metallic = 0.2
        material.roughness = 1.0
        return material
    }
}