class Plant {
    constructor(scene, x, y, type, plantDefinition) {
        this.scene = scene;
        this.type = type; // Plant type (e.g., cabbage, carrot, corn)
        this.position = { x, y }; // Grid position
        this.growth = 1; // Initial growth stage
        this.growthRules = plantDefinition.growthRules; // Dynamic growth logic from DSL
        this.produceValue = plantDefinition.produceValue; // Produce value for reaping

        // Create the sprite for the plant
        const cellSize = this.scene.cellSize;
        const spriteX = x * cellSize + cellSize / 2;
        const spriteY = y * cellSize + cellSize / 2;

        this.sprite = this.scene.add.sprite(spriteX, spriteY, `${type}_1`);

        // Dynamic scaling based on cell size
        const maxPlantSize = cellSize - 10;
        const plantTexture = this.scene.textures.get(`${type}_1`);
        const scaleFactor = Math.min(
            maxPlantSize / plantTexture.getSourceImage().width,
            maxPlantSize / plantTexture.getSourceImage().height
        );

        this.sprite.setScale(scaleFactor);
        this.sprite.setDepth(1); // Ensure the plant appears above the grid

        console.log(`Created plant "${type}" at (${x}, ${y}) with growth rules.`);
    }

    grow(resources, neighbors) {
        if (this.growth < 3) {
            const canGrow = this.growthRules.every((rule) =>
                rule({
                    sun: resources.sun,
                    water: resources.water,
                    neighbors,
                })
            );

            if (canGrow) {
                this.growth++;
                this.updateSprite();
                console.log(
                    `Plant "${this.type}" at (${this.position.x}, ${this.position.y}) grew to stage ${this.growth}.`
                );
            }
        }
    }

    updateSprite() {
        const textureKey = `${this.type}_${this.growth}`;
        this.sprite.setTexture(textureKey);

        // Adjust scaling dynamically for the new texture
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(textureKey);
        const scaleFactor = Math.min(
            maxPlantSize / plantTexture.getSourceImage().width,
            maxPlantSize / plantTexture.getSourceImage().height
        );

        this.sprite.setScale(scaleFactor);
    }

    /**
     * Get the value of produce when reaped.
     * @returns {number} - Produce value.
     */
    getProduceValue() {
        return this.produceValue;
    }

    /**
     * Destroy the plant's sprite when it is removed.
     */
    destroy() {
        this.sprite.destroy();
    }
}

