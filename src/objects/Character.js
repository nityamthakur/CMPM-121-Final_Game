class Character {
    constructor(scene, x, y, texture, scale = 0.1) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, texture);
        this.sprite.setScale(scale);
        this.sprite.setOrigin(0.5);
        this.speed = 1; // Movement speed
        this.position = { x: 0, y: 0 }; // Grid position
    }

    move(dx, dy, gridSize) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within bounds
        if (newX >= 0 && newX < gridSize.width && newY >= 0 && newY < gridSize.height) {
            this.position.x = newX;
            this.position.y = newY;
            this.updatePosition();
        }
    }

    updatePosition() {
        this.sprite.x = this.position.x * this.scene.cellSize + this.scene.cellSize / 2;
        this.sprite.y = this.position.y * this.scene.cellSize + this.scene.cellSize / 2;
    }
}

//export default Character;