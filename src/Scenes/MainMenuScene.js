class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
        this.saveSystem = new SaveSystem();
    }

    create() {
        // Display title
        this.add.text(400, 100, 'Plant Farming Simulator', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add "Start New Game" button
        const startButton = this.add.text(400, 200, 'Start New Game', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .setOrigin(0.5);
        startButton.on('pointerdown', () => this.showScenarioMenu());

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

        // Hidden container for scenario selection
        this.scenarioMenu = this.add.container(400, 250).setVisible(false);
    }

    showScenarioMenu() {
        // Clear existing menu
        this.scenarioMenu.removeAll(true);

        // Add background for the menu
        const background = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.8).setOrigin(0.5);
        this.scenarioMenu.add(background);

        // Add a title
        const title = this.add.text(0, -120, 'Select a Scenario', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.scenarioMenu.add(title);

        // List scenarios (hardcoded for now, but can be dynamically loaded)
        const scenarios = ['tutorial', 'storm'];
        scenarios.forEach((scenario, index) => {
            const button = this.add.text(0, -50 + index * 50, scenario, { fontSize: '20px', fill: '#fff' })
                .setInteractive()
                .setOrigin(0.5);
            button.on('pointerdown', () => this.startNewGameWithScenario(scenario));
            this.scenarioMenu.add(button);
        });

        // Add a close button
        const closeButton = this.add.text(0, 100, 'Cancel', { fontSize: '20px', fill: '#ff0000' })
            .setInteractive()
            .setOrigin(0.5);
        closeButton.on('pointerdown', () => this.scenarioMenu.setVisible(false));
        this.scenarioMenu.add(closeButton);

        this.scenarioMenu.setVisible(true);
    }

    startNewGameWithScenario(scenario) {
        const saveSystem = new SaveSystem();
    
        // Clear auto-save data
        saveSystem.deleteSave('auto');
    
        // Start the game with the selected scenario
        this.scene.start('GameScene', { newGame: true, scenarioName: scenario });
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

