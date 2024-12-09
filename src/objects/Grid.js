class Grid {
    constructor(scene, width, height, cellSize) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        this.tiles = [];
        this.sunAndWater = [];

        this.createGrid();
    }

    createGrid() {
        for (let y = 0; y < this.height; y++) {
            const row = [];
            const sunWaterRow = [];
            for (let x = 0; x < this.width; x++) {
                const cell = this.scene.add.rectangle(
                    x * this.cellSize + this.cellSize / 2,
                    y * this.cellSize + this.cellSize / 2,
                    this.cellSize - 10, // Space between tiles
                    this.cellSize - 10,
                    0x228b22
                );
                cell.setStrokeStyle(2, 0x000000);
                row.push(cell);

                // Initialize random sun and water levels
                const sun = Phaser.Math.Between(1, 5);
                const water = 0;
                sunWaterRow.push({ sun, water });

                // Add sun/water display
                this.scene.add.text(
                    x * this.cellSize + 10,
                    y * this.cellSize + 10,
                    `S:${sun}\nW:${water}`,
                    { fontSize: '16px', fill: '#fff' }
                );
            }
            this.tiles.push(row);
            this.sunAndWater.push(sunWaterRow);
        }
    }

    updateResources() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.sunAndWater[y][x];
                cell.sun = Phaser.Math.Between(1, 5);
                cell.water = Math.min(cell.water + 1, 5);
            }
        }
    }

    getResourcesAt(x, y) {
        return this.sunAndWater[y][x];
    }
}

//export default Grid;