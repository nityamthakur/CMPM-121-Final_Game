//import Character from '../objects/Character.js';
//import Plant from '../objects/Plant.js';
//import Grid from '../objects/Grid.js';

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

        // Plants and produce
        this.plants = [];
        this.produceWeight = 0;
        this.produceGoal = 50; // Win condition

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Launch UI Scene
        this.scene.launch('UIScene');

        // Advance turn
        this.input.keyboard.on('keydown-SPACE', () => {
            this.advanceTurn();
        });
    }

    advanceTurn() {
        this.grid.updateResources();
        this.scene.get('UIScene').events.emit('updateTurn', ++this.turnCount);

        // Update plant growth
        this.plants.forEach((plant) => {
            const resources = this.grid.getResourcesAt(plant.position.x, plant.position.y);
            this.produceWeight += plant.grow(resources.sun, resources.water);
        });

        // Update produce in UI
        this.scene.get('UIScene').events.emit('updateProduce', this.produceWeight);

        // Check win condition
        if (this.produceWeight >= this.produceGoal) {
            this.scene.start('GameOverScene', { message: 'You Win!' });
        }
    }

    update() {
        if (this.cursors.left.isDown) this.player.move(-1, 0, this.grid);
        if (this.cursors.right.isDown) this.player.move(1, 0, this.grid);
        if (this.cursors.up.isDown) this.player.move(0, -1, this.grid);
        if (this.cursors.down.isDown) this.player.move(0, 1, this.grid);

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            const { x, y } = this.player.position;
            if (!this.getPlantAt(x, y)) {
                const plant = new Plant(this, x, y, 'carrot');
                this.plants.push(plant);
            }
        }
    }

    getPlantAt(x, y) {
        return this.plants.find((plant) => plant.position.x === x && plant.position.y === y);
    }
}

//export default GameScene;