class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Adjust the starting position of the UI to move it more in-bounds
        const uiX = 620; // Adjusted x-coordinate for UI
        const uiY = 10; // Starting y-coordinate for UI
        const spacing = 30; // Spacing between elements

        // Currency display
        this.currency = 20; // Initial currency
        this.currencyText = this.add.text(uiX, uiY, `Currency: $${this.currency}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Turn counter
        this.turnCount = 0;
        this.turnText = this.add.text(uiX, uiY + spacing, `Turn: ${this.turnCount}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Produce display and goal
        this.produceText = this.add.text(uiX, uiY + spacing * 2, `Produce: 0g`, {
            fontSize: '20px',
            fill: '#fff'
        });
        this.goalText = this.add.text(uiX, uiY + spacing * 3, `Goal: 50g`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Plant explanations
        this.add.text(uiX, uiY + spacing * 5, 'Plants:', { fontSize: '24px', fill: '#fff' });
        this.add.text(
            uiX,
            uiY + spacing * 6,
            'Cabbage: $5, +10g\nCarrot: $3, +5g\nCorn: $7, +15g',
            { fontSize: '16px', fill: '#fff' }
        );

        // Sow buttons
        this.add.text(uiX, uiY + spacing * 8, 'Sow Plants:', { fontSize: '20px', fill: '#fff' });

        const sowCabbageButton = this.add.text(uiX, uiY + spacing * 9, 'Sow Cabbage', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#228B22',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('cabbage'));

        const sowCarrotButton = this.add.text(uiX, uiY + spacing * 10, 'Sow Carrot', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FF8C00',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('carrot'));

        const sowCornButton = this.add.text(uiX, uiY + spacing * 11, 'Sow Corn', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FFD700',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('corn'));

        // Reap button
        const reapButton = this.add.text(uiX, uiY + spacing * 12, 'Reap Plant', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.reapPlant());

        // Undo/Redo buttons
        const undoButton = this.add.text(uiX, uiY + spacing * 13, 'Undo', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#000080',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.undoAction());

        const redoButton = this.add.text(uiX, uiY + spacing * 14, 'Redo', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#008000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.redoAction());

        // Save and Load buttons
        const saveButton = this.add.text(uiX, uiY + spacing * 15, 'Save Game', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#483D8B',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.saveGame());

        const loadButton = this.add.text(uiX, uiY + spacing * 16, 'Load Game', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#2F4F4F',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.loadGame());

        // Instructions button
        const instructionsButton = this.add.text(uiX, uiY + spacing * 17, 'Instructions', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#555',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.showInstructions());

        this.instructionText = this.add.text(
            uiX,
            uiY + spacing * 18,
            '',
            { fontSize: '16px', fill: '#fff', wordWrap: { width: 180 } }
        ).setVisible(false);

        // Event listeners for GameScene updates
        this.scene.get('GameScene').events.on('updateTurn', (turn) => {
            this.updateTurn(turn);
        });

        this.scene.get('GameScene').events.on('updateProduce', (produce) => {
            this.updateProduce(produce);
        });

        this.scene.get('GameScene').events.on('updateCurrency', (currency) => {
            this.updateCurrency(currency);
        });
    }


    sowPlant(type) {
        this.scene.get('GameScene').events.emit('sowPlant', type);
    }

    reapPlant() {
        this.scene.get('GameScene').events.emit('reapPlant');
    }

    undoAction() {
        this.scene.get('GameScene').events.emit('undo');
    }

    redoAction() {
        this.scene.get('GameScene').events.emit('redo');
    }

    saveGame() {
        const slot = prompt('Enter save slot name:');
        if (slot) {
            this.scene.get('GameScene').events.emit('saveGame', slot);
        }
    }

    loadGame() {
        const slot = prompt('Enter save slot name to load:');
        if (slot) {
            this.scene.get('GameScene').events.emit('loadGame', slot);
        }
    }

    updateTurn(turn) {
        this.turnCount = turn;
        this.turnText.setText(`Turn: ${turn}`);
    }

    updateProduce(produce) {
        this.produceText.setText(`Produce: ${produce}g`);
    }

    updateCurrency(currency) {
        this.currency = currency;
        this.currencyText.setText(`Currency: $${currency}`);
    }

    showInstructions() {
        const visible = this.instructionText.visible;
        this.instructionText.setVisible(!visible);
        if (!visible) {
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

