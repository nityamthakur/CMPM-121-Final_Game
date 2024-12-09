class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        // Initialize save and history managers
        this.saveSystem = new SaveSystem();
        this.historyManager = new HistoryManager();
    
        // Grid setup
        const cellSize = 100; // Define grid cell size
        this.grid = new Grid(this, 5, 5, cellSize);
        this.cellSize = cellSize; // Ensure cellSize is accessible globally within GameScene
    
        // Player setup
        this.player = new Character(this, 0, 0, 'character', 0.1);
    
        // Currency and produce
        this.currency = 20; // Starting currency
        this.produceWeight = 0; // Total produce collected
    
        // Plants
        this.plants = [];
    
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Launch UI Scene
        this.scene.launch('UIScene');
    
        // Advance turn
        this.turnCount = 0;
        this.input.keyboard.on('keydown-SPACE', () => {
            this.advanceTurn();
        });
    
        // Handle events from UIScene
        this.events.on('sowPlant', (type) => this.handleSowPlant(type));
        this.events.on('reapPlant', () => this.handleReapPlant());
        this.events.on('saveGame', (slot) => this.saveGame(slot));
        this.events.on('loadGame', (slot) => this.loadGame(slot));
        this.events.on('undo', () => this.undoAction());
        this.events.on('redo', () => this.redoAction());
    
        // Check if starting a new game
        if (data?.newGame) {
            console.log('Starting a new game.');
            this.pushGameStateToHistory();
            return; // Skip loading auto-save
        }
    
        // Check for auto-save and load if present
        const autoSaveState = this.saveSystem.loadAuto();
        if (autoSaveState) {
            this.loadGameFromState(autoSaveState);
        }
    }

    advanceTurn() {
        // Update resources and notify UIScene
        this.grid.updateResources();
        this.events.emit('updateTurn', ++this.turnCount);

        // Update plant growth
        this.plants.forEach((plant) => {
            const resources = this.grid.getResourcesAt(plant.position.x, plant.position.y);
            plant.grow(resources.sun, resources.water);
        });

        // Push the new state to history
        this.pushGameStateToHistory();

        // Auto-save after advancing the turn
        this.autoSave();

        // Check win condition
        this.checkWinCondition();
    }

    handleSowPlant(type) {
        const { x, y } = this.player.position;
    
        // Check if there is already a plant in this cell
        if (this.getPlantAt(x, y)) {
            console.log('Cannot plant here: Tile is already occupied.');
            return;
        }
    
        const plantData = {
            cabbage: { cost: 5 },
            carrot: { cost: 3 },
            corn: { cost: 7 },
        };
    
        if (!plantData[type]) {
            console.log('Invalid plant type.');
            return;
        }
    
        const plantCost = plantData[type].cost;
    
        // Check if the player has enough currency
        if (this.currency < plantCost) {
            console.log('Not enough currency to sow this plant.');
            return;
        }
    
        // Deduct cost
        this.currency -= plantCost;
        this.events.emit('updateCurrency', this.currency);
    
        // Create and place the plant
        const plant = new Plant(this, x, y, type);
        this.plants.push(plant);
    
        console.log(`Planted ${type} at (${x}, ${y})`);
    }

    handleReapPlant() {
        const { x, y } = this.player.position;

        const plant = this.getPlantAt(x, y);
        if (!plant) {
            console.log('No plant to reap here.');
            return;
        }

        if (plant.growth === 3) {
            const produce = plant.plantData[plant.type].produce;
            this.produceWeight += produce;

            this.currency += produce;
            this.events.emit('updateCurrency', this.currency);
            this.events.emit('updateProduce', this.produceWeight);

            this.removePlant(plant);

            console.log(`Reaped ${plant.type} and earned ${produce}g of produce.`);

            // Push the new state to history
            this.pushGameStateToHistory();

            // Auto-save after reaping
            this.autoSave();

            this.checkWinCondition();
        } else {
            console.log('Plant is not fully grown yet.');
        }
    }

    saveGame(slot) {
        const gameState = this.getCurrentGameState();
        this.saveSystem.saveToSlot(slot, gameState);
        console.log(`Game saved to slot: ${slot}`, gameState);
    }
    
    loadGame(slot) {
        const gameState = this.saveSystem.loadFromSlot(slot);
        if (gameState) {
            console.log(`Game loaded from slot: ${slot}`, gameState);
            this.loadGameFromState(gameState);
        } else {
            console.log(`No saved game found in slot: ${slot}`);
        }
    }

    autoSave() {
        const gameState = this.getCurrentGameState();
        this.saveSystem.saveAuto(gameState);
    }

    undoAction() {
        const previousState = this.historyManager.undo();
        if (previousState) {
            console.log('Undo successful. Restoring state:', previousState);
            this.loadGameFromState(previousState);
        } else {
            console.log('No state to undo.');
        }
    }
    
    redoAction() {
        const nextState = this.historyManager.redo();
        if (nextState) {
            console.log('Redo successful. Restoring state:', nextState);
            this.loadGameFromState(nextState);
        } else {
            console.log('No state to redo.');
        }
    }

    pushGameStateToHistory() {
        const gameState = this.getCurrentGameState();
        console.log('Pushing game state to history:', gameState);
        this.historyManager.pushState(gameState);
    }

    getPlantAt(x, y) {
        return this.plants.find((plant) => plant.position.x === x && plant.position.y === y);
    }

    removePlant(plant) {
        plant.sprite.destroy();
        this.plants = this.plants.filter((p) => p !== plant);
    }

    checkWinCondition() {
        if (this.produceWeight >= 50) {
            this.scene.start('GameOverScene', { message: 'You Win!' });
        }
    }

    getCurrentGameState() {
        return {
            grid: this.grid.serialize(),
            player: { x: this.player.position.x, y: this.player.position.y },
            currency: this.currency,
            produceWeight: this.produceWeight,
            turnCount: this.turnCount,
            plants: this.plants.map((plant) => ({
                type: plant.type,
                position: plant.position,
                growth: plant.growth
            })),
        };
    }

    loadGameFromState(state) {
        this.grid.deserialize(state.grid);
        this.player.position = state.player;
        this.player.sprite.setPosition(
            state.player.x * this.cellSize + this.cellSize / 2,
            state.player.y * this.cellSize + this.cellSize / 2
        );
        this.currency = state.currency;
        this.produceWeight = state.produceWeight;
        this.turnCount = state.turnCount;
    
        // Clear existing plants and re-add from saved state
        this.plants.forEach((plant) => plant.sprite.destroy());
        this.plants = [];
        state.plants.forEach((plantData) => {
            const plant = new Plant(this, plantData.position.x, plantData.position.y, plantData.type);
            plant.growth = plantData.growth; // Restore growth stage
            plant.updateSprite(); // Update texture based on growth stage
            this.plants.push(plant);
        });
    
        console.log('Game state fully restored:', state);
    }

    update() {
        if (this.cursors.left.isDown) this.player.move(-1, 0, this.grid);
        if (this.cursors.right.isDown) this.player.move(1, 0, this.grid);
        if (this.cursors.up.isDown) this.player.move(0, -1, this.grid);
        if (this.cursors.down.isDown) this.player.move(0, 1, this.grid);
    }
}