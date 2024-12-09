class Plant {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type; // Type of plant: cabbage, carrot, or corn
        this.growth = 1; // Growth stage starts at level 1
        this.position = { x, y };

        // Growth requirements and production values for each plant type
        this.plantData = {
            cabbage: { cost: 5, growthTurns: [2, 2], produce: 10 },
            carrot: { cost: 3, growthTurns: [1, 2], produce: 5 },
            corn: { cost: 7, growthTurns: [3, 3], produce: 15 }
        };

        // Validate plant type
        if (!this.plantData[type]) {
            throw new Error(`Invalid plant type: ${type}`);
        }

        // Dynamic scaling based on grid cell size
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(`${type}_1`);
        const textureWidth = plantTexture.getSourceImage().width;
        const textureHeight = plantTexture.getSourceImage().height;
        const scaleX = maxPlantSize / textureWidth;
        const scaleY = maxPlantSize / textureHeight;
        const scaleFactor = Math.min(scaleX, scaleY);

        // Create the plant sprite
        this.sprite = this.scene.add.sprite(
            x * this.scene.cellSize + this.scene.cellSize / 2,
            y * this.scene.cellSize + this.scene.cellSize / 2,
            `${type}_1`
        );
        this.sprite.setScale(scaleFactor);

        // Track remaining turns needed for growth
        this.growthTurnsLeft = [...this.plantData[type].growthTurns];
    }

    grow(sun, water) {
        if (this.growth < 3) {
            // Check if sun and water requirements are met
            if (sun >= this.growth && water >= this.growth) {
                // Decrease growth turns left
                this.growthTurnsLeft[this.growth - 1] -= 1;
    
                // Advance growth stage if all turns for the current stage are completed
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
        const textureWidth = plantTexture.getSourceImage().width;
        const textureHeight = plantTexture.getSourceImage().height;
        const scaleX = maxPlantSize / textureWidth;
        const scaleY = maxPlantSize / textureHeight;
        const scaleFactor = Math.min(scaleX, scaleY);
        this.sprite.setScale(scaleFactor);
    }

    getCost() {
        return this.plantData[this.type].cost;
    }
}

//export default Plant;