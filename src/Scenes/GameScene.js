

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        console.log('GameScene initialized.');

        // Set grid size and cell size
        this.cellSize = 100;
        this.grid = new Grid(this, 5, 5); // 5x5 grid
        this.grid.render();

        // Initialize player
        this.player = new Character(this, 0, 0, 'character', 0.1);

        // Initialize game variables
        this.currency = 20; // Starting currency
        this.produceWeight = 0; // Total weight of harvested produce
        this.turnCount = 0; // Tracks the number of turns
        this.plants = []; // Stores all plants on the grid

        // Save/Load Manager
        this.saveLoadManager = new SaveLoadManager(this);

        // Load auto-save on game start
        this.saveLoadManager.loadAutoSave();

        // Event listeners for save/load actions
        this.events.on('saveGame', (slotName) => this.saveLoadManager.saveState(slotName));
        this.events.on('loadGame', (slotName) => this.saveLoadManager.loadState(slotName));

        // UI Updates via events
        this.events.emit('updateCurrency', this.currency);
        this.events.emit('updateProduce', this.produceWeight);
        this.events.emit('updateTurn', this.turnCount);

        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on('keydown-SPACE', () => this.advanceTurn());

        // Launch the UI Scene
        this.scene.launch('UIScene');
    }

    update() {
        // Handle movement input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.player.move(-1, 0, { width: 5, height: 5 });
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.player.move(1, 0, { width: 5, height: 5 });
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.move(0, -1, { width: 5, height: 5 });
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.player.move(0, 1, { width: 5, height: 5 });
        }
    }

    advanceTurn() {
        console.log('Advancing turn.');

        // Auto-save game state
        this.saveLoadManager.autoSave();

        // Update grid resources
        this.grid.updateResources();
        this.turnCount++;
        this.events.emit('updateTurn', this.turnCount);

        // Update all plants on the grid
        this.plants.forEach((plant) => {
            const { sun, water } = this.grid.getCellData(plant.position.x, plant.position.y);
            const produce = plant.grow(sun, water);
            this.produceWeight += produce;
        });

        // Update UI for produce weight
        this.events.emit('updateProduce', this.produceWeight);

        // Check for game win condition (50g produce)
        if (this.produceWeight >= 50) {
            console.log('Game over! You reached the goal.');
            this.scene.stop('UIScene');
            this.scene.start('GameOverScene', { won: true });
        }

        console.log(`Turn ${this.turnCount} completed.`);
    }

    handleSowPlant(plantType, cost) {
        // Check if the player has enough currency
        if (this.currency < cost) {
            console.log('Not enough currency to sow this plant.');
            return;
        }

        // Get the player's current position
        const { x, y } = this.player.position;
        const cellData = this.grid.getCellData(x, y);

        // Check if the cell is empty
        if (cellData.plantType !== 0) {
            console.log('Cell is already occupied.');
            return;
        }

        // Deduct currency and sow the plant
        this.currency -= cost;
        this.events.emit('updateCurrency', this.currency);

        const plant = new Plant(this, x, y, plantType);
        this.plants.push(plant);

        // Update the grid with the plant information
        this.grid.setCellData(x, y, cellData.sun, cellData.water, plantType, 1);

        console.log(`Sowed a ${plantType} at (${x}, ${y}).`);
    }

    handleReapPlant() {
        // Get the player's current position
        const { x, y } = this.player.position;
        const cellData = this.grid.getCellData(x, y);

        // Check if there's a fully grown plant
        if (cellData.plantType === 0 || cellData.growthStage < 3) {
            console.log('No fully grown plant to reap here.');
            return;
        }

        // Calculate profit and update currency
        const plant = this.plants.find((p) => p.position.x === x && p.position.y === y);
        const profit = plant.reap();
        this.currency += profit;
        this.events.emit('updateCurrency', this.currency);

        // Remove the plant from the grid and array
        this.plants = this.plants.filter((p) => p !== plant);
        this.grid.setCellData(x, y, cellData.sun, cellData.water, 0, 0);

        console.log(`Reaped a plant at (${x}, ${y}) for ${profit} currency.`);
    }
}

