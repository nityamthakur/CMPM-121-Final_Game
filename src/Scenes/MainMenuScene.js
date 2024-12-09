

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
        this.saveSystem = new SaveSystem();
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

        // Add "Start New Game" button
        const startButton = this.add.text(400, 200, 'Start New Game', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        startButton.on('pointerdown', () => this.startNewGame());

        // Add "Load Game" button
        const loadButton = this.add.text(400, 250, 'Load Game', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        loadButton.on('pointerdown', () => this.loadGameMenu());

        // Add "Resume Auto-Save" button (only if an auto-save exists)
        if (this.saveSystem.hasAutoSave()) {
            const resumeButton = this.add.text(400, 300, 'Resume Auto-Save', { fontSize: '24px', fill: '#fff' })
                .setInteractive()
                .setOrigin(0.5);
            resumeButton.on('pointerdown', () => this.resumeAutoSave());
        }

        // Add "Instructions" button
        const instructionsButton = this.add.text(400, 350, 'Instructions', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        instructionsButton.on('pointerdown', () => this.showInstructions());

        // Hidden text for instructions
        this.instructionText = this.add.text(400, 450, '', { fontSize: '20px', fill: '#fff', align: 'center' })
            .setOrigin(0.5);
        this.instructionText.visible = false;
    }

    startNewGame() {
        this.scene.start('GameScene');
    }

    loadGameMenu() {
        const saveSlots = this.saveSystem.listSaveSlots();
        if (saveSlots.length === 0) {
            alert('No saved games found.');
            return;
        }

        const slot = prompt(`Available save slots:\n${saveSlots.join('\n')}\n\nEnter the slot name to load:`);
        if (slot && saveSlots.includes(slot)) {
            const savedState = this.saveSystem.loadFromSlot(slot);
            if (savedState) {
                this.scene.start('GameScene', { savedState });
            } else {
                alert('Failed to load the selected save slot.');
            }
        }
    }

    resumeAutoSave() {
        const autoSaveState = this.saveSystem.loadAuto();
        if (autoSaveState) {
            this.scene.start('GameScene', { savedState: autoSaveState });
        }
    }

    showInstructions() {
        this.instructionText.visible = !this.instructionText.visible;
        if (this.instructionText.visible) {
            this.instructionText.setText(
                'Instructions:\n' +
                '- Use arrow keys to move.\n' +
                '- Sow plants using the buttons.\n' +
                '- Reap plants when fully grown.\n' +
                '- Manage resources (sun/water).\n' +
                '- Reaping earns both produce and currency.\n' +
                '- Reach 50g of produce to win!'
            );
        } else {
            this.instructionText.setText('');
        }
    }
}

