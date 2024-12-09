class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Add UI elements
        this.add.text(10, 10, 'Plant Farming Game', { fontSize: '20px', fill: '#fff' });

        this.currencyText = this.add.text(10, 40, 'Currency: 0', { fontSize: '16px', fill: '#fff' });
        this.produceText = this.add.text(10, 60, 'Produce: 0g', { fontSize: '16px', fill: '#fff' });
        this.turnText = this.add.text(10, 80, 'Turn: 0', { fontSize: '16px', fill: '#fff' });

        this.add.text(10, 120, 'Controls:', { fontSize: '16px', fill: '#fff' });
        this.add.text(10, 140, '- Arrow Keys: Move', { fontSize: '14px', fill: '#fff' });
        this.add.text(10, 160, '- Space: Advance Turn', { fontSize: '14px', fill: '#fff' });
        this.add.text(10, 180, '- Sow: Click Sow Buttons', { fontSize: '14px', fill: '#fff' });
        this.add.text(10, 200, '- Reap: Click Reap Button', { fontSize: '14px', fill: '#fff' });

        // Buttons for sowing plants
        this.add.text(10, 240, 'Sow Plants:', { fontSize: '16px', fill: '#fff' });

        const sowCabbage = this.add.text(10, 260, 'Sow Cabbage (5)', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').handleSowPlant('cabbage', 5));

        const sowCarrot = this.add.text(10, 290, 'Sow Carrot (3)', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').handleSowPlant('carrot', 3));

        const sowCorn = this.add.text(10, 320, 'Sow Corn (7)', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').handleSowPlant('corn', 7));

        // Button for reaping plants
        const reapPlant = this.add.text(10, 360, 'Reap Plant', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').handleReapPlant());

        // Buttons for saving and loading
        this.add.text(10, 400, 'Save/Load:', { fontSize: '16px', fill: '#fff' });

        const saveSlot1 = this.add.text(10, 420, 'Save Slot 1', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').events.emit('saveGame', 'slot1'));

        const loadSlot1 = this.add.text(10, 450, 'Load Slot 1', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').events.emit('loadGame', 'slot1'));

        const saveSlot2 = this.add.text(10, 480, 'Save Slot 2', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').events.emit('saveGame', 'slot2'));

        const loadSlot2 = this.add.text(10, 510, 'Load Slot 2', { fontSize: '16px', fill: '#000', backgroundColor: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.get('GameScene').events.emit('loadGame', 'slot2'));

        // Event listeners for updating UI
        const gameScene = this.scene.get('GameScene');

        gameScene.events.on('updateCurrency', (newCurrency) => {
            this.currencyText.setText(`Currency: ${newCurrency}`);
        });

        gameScene.events.on('updateProduce', (newProduce) => {
            this.produceText.setText(`Produce: ${newProduce}g`);
        });

        gameScene.events.on('updateTurn', (newTurn) => {
            this.turnText.setText(`Turn: ${newTurn}`);
        });
    }
}
