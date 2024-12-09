// import Character from '../objects/Character.js';
// import Plant from '../objects/Plant.js';
// import Grid from '../objects/Grid.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
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
    
        // Check win condition
        if (this.produceWeight >= 50) {
            this.scene.start('GameOverScene', { message: 'You Win!' });
        }
    }

    handleSowPlant(type) {
        const { x, y } = this.player.position;
    
        // Check if there is already a plant in this cell
        if (this.getPlantAt(x, y)) {
            console.log('Cannot plant here: Tile is already occupied.');
            return;
        }
    
        // Get plant cost
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
    
        // Deduct cost and notify UIScene
        this.currency -= plantCost;
        this.events.emit('updateCurrency', this.currency);
    
        // Plant the seed
        const plant = new Plant(this, x, y, type);
        this.plants.push(plant);
        console.log(`Planted ${type} at (${x}, ${y})`);
    }

    handleReapPlant() {
        const { x, y } = this.player.position;

        // Check if there is a plant to reap
        const plant = this.getPlantAt(x, y);
        if (!plant) {
            console.log('No plant to reap here.');
            return;
        }

        // Reap the plant only if it is fully grown
        if (plant.growth === 3) {
            const produce = plant.plantData[plant.type].produce;
            this.produceWeight += produce;

            // Add produce weight and currency
            this.currency += produce; // Optional: Reward currency for reaping
            this.events.emit('updateCurrency', this.currency);
            this.events.emit('updateProduce', this.produceWeight);

            // Remove the plant
            this.removePlant(plant);
            console.log(`Reaped ${plant.type} and earned ${produce}g of produce.`);
        } else {
            console.log('Plant is not fully grown yet.');
        }
    }

    getPlantAt(x, y) {
        return this.plants.find((plant) => plant.position.x === x && plant.position.y === y);
    }

    removePlant(plant) {
        // Remove the plant from the grid and the plants array
        plant.sprite.destroy();
        this.plants = this.plants.filter((p) => p !== plant);
    }

    update() {
        // Handle player movement
        if (this.cursors.left.isDown) this.player.move(-1, 0, this.grid);
        if (this.cursors.right.isDown) this.player.move(1, 0, this.grid);
        if (this.cursors.up.isDown) this.player.move(0, -1, this.grid);
        if (this.cursors.down.isDown) this.player.move(0, 1, this.grid);
    }
}

//export default GameScene;