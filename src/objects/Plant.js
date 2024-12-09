class Plant {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.growth = 1; // Starts at level 1
        this.position = { x, y };

        this.sprite = this.scene.add.sprite(
            x * this.scene.cellSize + this.scene.cellSize / 2,
            y * this.scene.cellSize + this.scene.cellSize / 2,
            `${type}_1`
        );
        this.sprite.setScale(3.5); // Larger plants for visibility
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
        this.sprite.setTexture(`${this.type}_${this.growth}`);
    }
}

//export default Plant;