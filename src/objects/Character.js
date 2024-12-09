class Character {
    constructor(scene, x, y, texture, scale = 0.1) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, texture);
        this.sprite.setScale(scale);
        this.sprite.setOrigin(0.5);
        this.speed = 10; // Movement speed in pixels per second
        this.position = { x: 0, y: 0 }; // Grid position
        this.isMoving = false; // Track whether the character is currently moving
    }

    move(dx, dy, gridSize) {
        // Prevent starting a new move while still moving
        if (this.isMoving) return;

        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within bounds
        if (newX >= 0 && newX < gridSize.width && newY >= 0 && newY < gridSize.height) {
            this.isMoving = true;

            // Update grid position
            this.position.x = newX;
            this.position.y = newY;

            // Calculate target position in pixels
            const targetX = this.position.x * this.scene.cellSize + this.scene.cellSize / 2;
            const targetY = this.position.y * this.scene.cellSize + this.scene.cellSize / 2;

            // Smooth movement using Phaser's tween system
            this.scene.tweens.add({
                targets: this.sprite,
                x: targetX,
                y: targetY,
                duration: 1000 / this.speed, // Duration based on speed
                onComplete: () => {
                    this.isMoving = false; // Allow new movement once the tween is complete
                }
            });
        }
    }
}

