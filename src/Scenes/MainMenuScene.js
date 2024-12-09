class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        // List of plant types and their growth stages
        const plantTypes = ['cabbage', 'carrot', 'corn'];
        const growthStages = [1, 2, 3];

        // Load plant images dynamically
        plantTypes.forEach((type) => {
            growthStages.forEach((stage) => {
                this.load.image(`${type}_${stage}`, `${type}_${stage}.png`);
            });
        });

        // Load other game assets
        this.load.image('character', 'Character.png');
        this.load.image('grass', 'grass.png');

        // Display loading progress
        const loadingText = this.add.text(20, 20, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' });
        this.load.on('progress', (progress) => {
            loadingText.setText(`Loading: ${Math.round(progress * 100)}%`);
        });
    }

    create() {
        // Display title
        this.add.text(400, 100, 'Plant Farming Simulator', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add "Start Game" button
        const startButton = this.add.text(400, 200, 'Start Game', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        startButton.on('pointerdown', () => this.scene.start('GameScene'));

        // Add "Instructions" button
        const instructionsButton = this.add.text(400, 250, 'Instructions', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        instructionsButton.on('pointerdown', () => this.showInstructions());

        // Hidden text for instructions
        this.instructionText = this.add.text(400, 400, '', { fontSize: '20px', fill: '#fff', align: 'center' })
            .setOrigin(0.5);
        this.instructionText.visible = false;
    }

    showInstructions() {
        this.instructionText.visible = !this.instructionText.visible;
        if (this.instructionText.visible) {
            this.instructionText.setText(
                'Instructions:\n' +
                '- Use arrow keys to move.\n' +
                '- Reap and sow plants near you.\n' +
                '- Manage sun and water to grow crops.\n' +
                '- Each plant has different costs and growth times.\n' +
                '- Reach the goal to complete the level!'
            );
        } else {
            this.instructionText.setText('');
        }
    }
}

//export default MainMenuScene;