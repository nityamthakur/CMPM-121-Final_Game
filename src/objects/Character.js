class Character {
    constructor(scene, x, y, texture, scale = 0.5) {
        this.scene = scene;
        this.sprite = scene.add.sprite(
            x * scene.cellSize + scene.cellSize / 2,
            y * scene.cellSize + scene.cellSize / 2,
            texture
        );
        this.sprite.setScale(scale);
        this.sprite.setOrigin(0.5);
        this.sprite.setDepth(2); // Set depth higher than grid tiles
        this.speed = 10; // Movement speed in pixels per second
        this.position = { x: x, y: y }; // Initial grid position
        this.isMoving = false; // Track whether the character is currently moving
    }

    move(dx, dy, grid) {
        // Prevent starting a new move while still moving
        if (this.isMoving) {
            console.log('Character is currently moving.');
            return;
        }

        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within bounds of the grid
        if (newX >= 0 && newX < grid.width && newY >= 0 && newY < grid.height) {
            this.isMoving = true; // Prevent additional movement until the current move is completed

            console.log(`Moving to: x=${newX}, y=${newY}`);
            this.position.x = newX;
            this.position.y = newY;

            // Calculate the target position in pixels
            const targetX = newX * grid.cellSize + grid.cellSize / 2;
            const targetY = newY * grid.cellSize + grid.cellSize / 2;

            // Smooth movement using Phaser's tween system
            this.scene.tweens.add({
                targets: this.sprite,
                x: targetX,
                y: targetY,
                duration: 1000 / this.speed, // Duration based on speed
                onComplete: () => {
                    this.isMoving = false; // Allow new movement once the tween is complete
                    console.log('Movement complete.');
                },
            });
        } else {
            console.log('Move out of bounds prevented.');
        }
    }
}