class Grid {
    constructor(scene, width, height, cellSize) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        // Single contiguous byte array (AoS format)
        // Each cell is represented by 4 bytes: [sun, water, plantType, growthStage]
        this.grid = new Uint8Array(width * height * 4);

        // Visual representation of tiles and sun/water
        this.tiles = [];
        this.sunAndWaterText = [];

        this.createGrid();
    }

    getIndex(x, y) {
        return (y * this.width + x) * 4;
    }

    createGrid() {
        for (let y = 0; y < this.height; y++) {
            const tileRow = [];
            const textRow = [];
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);

                // Initialize the byte array values
                this.grid[index] = Phaser.Math.Between(1, 5); // Sun level
                this.grid[index + 1] = Phaser.Math.Between(0, 3); // Water level
                this.grid[index + 2] = 0; // Plant type (0 = empty)
                this.grid[index + 3] = 0; // Growth stage (0 = none)

                // Create a tile using grass.png
                const tile = this.scene.add.sprite(
                    x * this.cellSize + this.cellSize / 2,
                    y * this.cellSize + this.cellSize / 2,
                    'grass'
                );
                tile.setDisplaySize(this.cellSize - 5, this.cellSize - 5);
                tileRow.push(tile);

                // Display sun and water levels as text
                const text = this.scene.add.text(
                    x * this.cellSize + 5,
                    y * this.cellSize + 5,
                    `S:${this.grid[index]}\nW:${this.grid[index + 1]}`,
                    {
                        fontSize: '12px',
                        fill: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: { left: 2, right: 2, top: 2, bottom: 2 },
                    }
                );
                textRow.push(text);
            }
            this.tiles.push(tileRow);
            this.sunAndWaterText.push(textRow);
        }
    }

    updateResources() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);

                // Randomly regenerate sun levels and accumulate water
                this.grid[index] = Phaser.Math.Between(1, 5); // Sun
                this.grid[index + 1] = Math.min(this.grid[index + 1] + Phaser.Math.Between(0, 2), 5); // Water

                // Update sun and water display
                this.sunAndWaterText[y][x].setText(`S:${this.grid[index]}\nW:${this.grid[index + 1]}`);
            }
        }
    }

    getResourcesAt(x, y) {
        const index = this.getIndex(x, y);
        return {
            sun: this.grid[index],
            water: this.grid[index + 1],
        };
    }

    addInitialPlants(initialPlants) {
        initialPlants.forEach(({ x, y, type }) => {
            const index = this.getIndex(x, y);

            // Set plant type and reset growth stage
            this.grid[index + 2] = type; // Plant type (numeric ID)
            this.grid[index + 3] = 1; // Initial growth stage

            // Add the plant visually on the grid
            const plant = new Plant(this.scene, x, y, type);
            plant.growth = 1; // Ensure growth stage is consistent
            this.scene.plants.push(plant);
            console.log(`Placed initial plant: ${type} at (${x}, ${y})`);
        });
    }

    serialize() {
        return {
            grid: Array.from(this.grid),
            width: this.width,
            height: this.height,
        };
    }

    deserialize(data) {
        if (data && data.grid && data.width && data.height) {
            this.grid = Uint8Array.from(data.grid);
            this.width = data.width;
            this.height = data.height;
            console.log('Grid state restored from save.');

            // Update text display after deserialization
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const index = this.getIndex(x, y);
                    this.sunAndWaterText[y][x].setText(
                        `S:${this.grid[index]}\nW:${this.grid[index + 1]}`
                    );
                }
            }
        } else {
            console.error('Invalid grid data provided for deserialization.');
        }
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.grid = new Uint8Array(newWidth * newHeight * 4);

        // Clear previous visual elements
        this.tiles.forEach((row) => row.forEach((tile) => tile.destroy()));
        this.sunAndWaterText.forEach((row) => row.forEach((text) => text.destroy()));

        this.tiles = [];
        this.sunAndWaterText = [];
        this.createGrid();
        console.log(`Grid resized to ${newWidth}x${newHeight}.`);
    }
}

