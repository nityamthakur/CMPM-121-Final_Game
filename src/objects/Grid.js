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
                // Create a tile using grass.png
                const tile = this.scene.add.sprite(
                    x * this.cellSize + this.cellSize / 2,
                    y * this.cellSize + this.cellSize / 2,
                    'grass' // Use grass.png from assets
                );

                // Scale the grass sprite to fit the grid cell
                tile.setDisplaySize(this.cellSize - 5, this.cellSize - 5);
                row.push(tile);

                // Initialize random sun and water levels
                const sun = Phaser.Math.Between(1, 5);
                const water = 0;
                sunWaterRow.push({ sun, water });

                // Add sun/water display, adjust position for better visibility
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