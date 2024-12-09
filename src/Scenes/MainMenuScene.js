class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        // Load assets
        this.load.image('cabbage_1', 'cabbage_1.png');
        this.load.image('carrot_1', 'carrot_1.png');
        this.load.image('corn_1', 'corn_1.png');
        this.load.image('character', 'Character.png');
        this.load.image('grass', 'grass.png');
    }

    create() {
        // Add background
        this.add.rectangle(400, 300, 800, 600, 0x87CEEB);

        // Add game title
        this.add.text(400, 100, 'Plant Farming Simulator', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add "Start Game" button
        const startButton = this.add.text(400, 200, 'Start Game', { fontSize: '24px', fill: '#fff', backgroundColor: '#000' })
            .setInteractive()
            .setOrigin(0.5);
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
            this.scene.stop('MainMenuScene');
        });

        // Add "Instructions" button
        const instructionsButton = this.add.text(400, 250, 'Instructions', { fontSize: '24px', fill: '#fff', backgroundColor: '#000' })
            .setInteractive()
            .setOrigin(0.5);
        instructionsButton.on('pointerdown', () => this.toggleInstructions());

        // Hidden instructions text
        this.instructionText = this.add.text(400, 400, '', { fontSize: '18px', fill: '#fff', align: 'center', wordWrap: { width: 600 } })
            .setOrigin(0.5);
        this.instructionText.visible = false;
    }

    toggleInstructions() {
        this.instructionText.visible = !this.instructionText.visible;

        if (this.instructionText.visible) {
            this.instructionText.setText(
                'Instructions:\n' +
                '- Use arrow keys to move.\n' +
                '- Press SPACE to advance turns.\n' +
                '- Sow plants by clicking the buttons.\n' +
                '- Reap fully grown plants to earn produce.\n' +
                '- Reach 50g of produce to win!'
            );
        } else {
            this.instructionText.setText('');
        }
    }
}

