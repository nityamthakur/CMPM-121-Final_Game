class Plant {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.growth = 1; // Starts at level 1
        this.position = { x, y };

        // Calculate dynamic scale based on grid cell size
        const maxPlantSize = this.scene.cellSize - 10; // Keep a small margin
        const plantTexture = this.scene.textures.get(`${type}_1`);
        const textureWidth = plantTexture.getSourceImage().width;
        const textureHeight = plantTexture.getSourceImage().height;
        const scaleX = maxPlantSize / textureWidth;
        const scaleY = maxPlantSize / textureHeight;
        const scaleFactor = Math.min(scaleX, scaleY); // Maintain aspect ratio

        // Plant sprite positioned within the grid
        this.sprite = this.scene.add.sprite(
            x * this.scene.cellSize + this.scene.cellSize / 2,
            y * this.scene.cellSize + this.scene.cellSize / 2,
            `${type}_1`
        );

        // Dynamically scale the plant sprite
        this.sprite.setScale(scaleFactor);
    }

    grow(sun, water) {
        if (this.growth < 3 && sun >= this.growth && water >= this.growth) {
            this.growth++;
            this.updateSprite();
            return 5; // Returns the produce weight added
        }
        return 0;
    }

    updateSprite() {
        // Update texture based on growth stage
        this.sprite.setTexture(`${this.type}_${this.growth}`);

        // Adjust scaling dynamically again for the new texture
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(`${this.type}_${this.growth}`);
        const textureWidth = plantTexture.getSourceImage().width;
        const textureHeight = plantTexture.getSourceImage().height;
        const scaleX = maxPlantSize / textureWidth;
        const scaleY = maxPlantSize / textureHeight;
        const scaleFactor = Math.min(scaleX, scaleY);
        this.sprite.setScale(scaleFactor);
    }
}

