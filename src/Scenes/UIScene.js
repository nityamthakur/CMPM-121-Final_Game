class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Currency display
        this.currency = 20; // Initial currency
        this.currencyText = this.add.text(820, 10, `Currency: $${this.currency}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Turn counter
        this.turnCount = 0;
        this.turnText = this.add.text(820, 40, `Turn: ${this.turnCount}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Produce display and goal
        this.produceText = this.add.text(820, 70, `Produce: 0g`, {
            fontSize: '20px',
            fill: '#fff'
        });
        this.goalText = this.add.text(820, 100, `Goal: 50g`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Plant explanations
        this.add.text(820, 140, 'Plants:', { fontSize: '24px', fill: '#fff' });
        this.add.text(
            820,
            170,
            'Cabbage: $5, +10g\nCarrot: $3, +5g\nCorn: $7, +15g',
            { fontSize: '16px', fill: '#fff' }
        );

        // Sow buttons
        this.add.text(820, 230, 'Sow Plants:', { fontSize: '20px', fill: '#fff' });

        const sowCabbageButton = this.add.text(820, 260, 'Sow Cabbage', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#228B22',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('cabbage'));

        const sowCarrotButton = this.add.text(820, 300, 'Sow Carrot', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FF8C00',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('carrot'));

        const sowCornButton = this.add.text(820, 340, 'Sow Corn', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FFD700',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('corn'));

        // Reap button
        const reapButton = this.add.text(820, 380, 'Reap Plant', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.reapPlant());

        // Undo/Redo buttons
        const undoButton = this.add.text(820, 420, 'Undo', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#000080',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.undoAction());

        const redoButton = this.add.text(820, 460, 'Redo', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#008000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.redoAction());

        // Save and Load buttons
        const saveButton = this.add.text(820, 500, 'Save Game', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#483D8B',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.saveGame());

        const loadButton = this.add.text(820, 540, 'Load Game', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#2F4F4F',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.loadGame());

        // Instructions button
        const instructionsButton = this.add.text(820, 580, 'Instructions', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#555',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.showInstructions());

        this.instructionText = this.add.text(
            820,
            620,
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

