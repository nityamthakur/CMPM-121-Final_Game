

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Initialize save and history managers
        this.saveSystem = new SaveSystem();
        this.historyManager = new HistoryManager();

        // Grid setup
        this.cellSize = 100;
        this.grid = new Grid(this, 5, 5, this.cellSize);

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

        // Push the initial game state to the history
        this.pushGameStateToHistory();

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
            const resources = this.grid.getCellData(plant.position.x, plant.position.y);
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
            corn: { cost: 7 }
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

        // Plant the seed
        const plant = new Plant(this, x, y, type);
        this.plants.push(plant);

        console.log(`Planted ${type} at (${x}, ${y})`);

        // Push the new state to history
        this.pushGameStateToHistory();

        // Auto-save after sowing
        this.autoSave();
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
    }

    loadGame(slot) {
        const gameState = this.saveSystem.loadFromSlot(slot);
        if (gameState) {
            this.loadGameFromState(gameState);
        }
    }

    autoSave() {
        const gameState = this.getCurrentGameState();
        this.saveSystem.saveAuto(gameState);
    }

    undoAction() {
        const previousState = this.historyManager.undo();
        if (previousState) {
            this.loadGameFromState(previousState);
        }
    }

    redoAction() {
        const nextState = this.historyManager.redo();
        if (nextState) {
            this.loadGameFromState(nextState);
        }
    }

    pushGameStateToHistory() {
        const gameState = this.getCurrentGameState();
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
            turnCount: this.turnCount
        };
    }

    loadGameFromState(state) {
        this.grid.deserialize(state.grid);
        this.player.position = state.player;
        this.currency = state.currency;
        this.produceWeight = state.produceWeight;
        this.turnCount = state.turnCount;
        console.log('Game state loaded.');
    }

    update() {
        if (this.cursors.left.isDown) this.player.move(-1, 0, this.grid);
        if (this.cursors.right.isDown) this.player.move(1, 0, this.grid);
        if (this.cursors.up.isDown) this.player.move(0, -1, this.grid);
        if (this.cursors.down.isDown) this.player.move(0, 1, this.grid);
    }
}

