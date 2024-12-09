class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        // Load images for the game
        this.load.image('cabbage_1', 'cabbage_1.png');
        this.load.image('cabbage_2', 'cabbage_2.png');
        this.load.image('cabbage_3', 'cabbage_3.png');
        this.load.image('carrot_1', 'carrot_1.png');
        this.load.image('carrot_2', 'carrot_2.png');
        this.load.image('carrot_3', 'carrot_3.png');
        this.load.image('corn_1', 'corn_1.png');
        this.load.image('corn_2', 'corn_2.png');
        this.load.image('corn_3', 'corn_3.png');
        this.load.image('character', 'Character.png');
        this.load.image('grass', 'grass.png');

        // Display loading progress
        const loadingText = this.add.text(20, 20, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' });
        this.load.on('progress', (progress) => {
            loadingText.setText(`Loading: ${Math.round(progress * 100)}%`);
        });
    }

    create() {
        // Display background
        this.add.image(400, 300, 'grass');

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
                '- Reach the win condition to complete the level.'
            );
        } else {
            this.instructionText.setText('');
        }
    }
}

