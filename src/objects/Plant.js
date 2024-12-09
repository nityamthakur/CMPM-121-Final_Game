class Plant {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type; // Plant type: cabbage, carrot, or corn
        this.growth = 1; // Initial growth stage
        this.position = { x, y };

        // Plant-specific data: cost, growth turns, and produce values
        this.plantData = {
            cabbage: { cost: 5, growthTurns: [2, 2], produce: 10 },
            carrot: { cost: 3, growthTurns: [1, 2], produce: 5 },
            corn: { cost: 7, growthTurns: [3, 3], produce: 15 },
        };

        // Ensure the plant type is valid
        if (!this.plantData[type]) {
            throw new Error(`Invalid plant type: ${type}`);
        }

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
        console.log(`Creating plant sprite at (${spriteX}, ${spriteY}) for type: ${type}`);
        // Track remaining turns needed for growth
        this.growthTurnsLeft = [...this.plantData[type].growthTurns];
    }

    grow(sun, water) {
        if (this.growth < 3) {
            if (sun >= this.growth && water >= this.growth) {
                this.growthTurnsLeft[this.growth - 1] -= 1;

                if (this.growthTurnsLeft[this.growth - 1] <= 0) {
                    this.growth++;
                    this.updateSprite();
                }
            }
        }
    }

    updateSprite() {
        // Update texture based on growth stage
        this.sprite.setTexture(`${this.type}_${this.growth}`);

        // Adjust scaling dynamically for the new texture
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(`${this.type}_${this.growth}`);
        const scaleFactor = Math.min(
            maxPlantSize / plantTexture.getSourceImage().width,
            maxPlantSize / plantTexture.getSourceImage().height
        );

        this.sprite.setScale(scaleFactor);
    }

    getCost() {
        return this.plantData[this.type].cost;
    }
}