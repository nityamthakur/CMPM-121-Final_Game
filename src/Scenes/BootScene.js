class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
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
        // Transition to the Main Menu scene
        this.scene.start('MainMenuScene');
    }
}

