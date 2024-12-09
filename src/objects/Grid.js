class Grid {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width; // Number of grid columns
        this.height = height; // Number of grid rows
        this.cellSize = scene.cellSize; // Size of each cell in pixels

        // Single contiguous byte array (AoS format)
        // Each cell is represented by 4 bytes: [sun, water, plantType, growthStage]
        this.grid = new Uint8Array(width * height * 4);

        this.initGrid();
    }

    // Helper method to calculate the starting index for a cell
    getIndex(x, y) {
        return (y * this.width + x) * 4;
    }

    // Initialize the grid with default values
    initGrid() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);
                this.grid[index] = Phaser.Math.Between(1, 5); // Sun level (1-5)
                this.grid[index + 1] = 0; // Water level (starts at 0)
                this.grid[index + 2] = 0; // Plant type (0 = empty)
                this.grid[index + 3] = 0; // Growth stage (0 = no plant)
            }
        }
    }

    // Update the sun and water levels for all cells
    updateResources() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);
                this.grid[index] = Phaser.Math.Between(1, 5); // Random sun level
                this.grid[index + 1] = Math.min(this.grid[index + 1] + 1, 5); // Accumulate water (max 5)
            }
        }
    }

    // Get the data for a specific cell
    getCellData(x, y) {
        const index = this.getIndex(x, y);
        return {
            sun: this.grid[index],
            water: this.grid[index + 1],
            plantType: this.grid[index + 2],
            growthStage: this.grid[index + 3],
        };
    }

    // Set the data for a specific cell
    setCellData(x, y, sun, water, plantType, growthStage) {
        const index = this.getIndex(x, y);
        this.grid[index] = sun;
        this.grid[index + 1] = water;
        this.grid[index + 2] = plantType;
        this.grid[index + 3] = growthStage;
    }

    // Render the grid on the game scene (optional for visualization)
    render() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.getIndex(x, y);
                const sun = this.grid[index];
                const water = this.grid[index + 1];

                // Draw grid background (grass texture or rectangle)
                this.scene.add.image(
                    x * this.cellSize + this.cellSize / 2,
                    y * this.cellSize + this.cellSize / 2,
                    'grass'
                ).setScale(this.cellSize / 100);

                // Display sun and water levels as text
                this.scene.add.text(
                    x * this.cellSize + 5,
                    y * this.cellSize + 5,
                    `S:${sun}\nW:${water}`,
                    {
                        fontSize: '12px',
                        fill: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: { left: 2, right: 2, top: 2, bottom: 2 }
                    }
                );
            }
        }
    }
}

