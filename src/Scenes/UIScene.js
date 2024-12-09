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

        // Produce display
        this.produceText = this.add.text(820, 70, 'Produce: 0g', {
            fontSize: '20px',
            fill: '#fff'
        });

        // Plant explanations
        this.add.text(820, 110, 'Plants:', { fontSize: '24px', fill: '#fff' });
        this.add.text(
            820,
            140,
            'Cabbage: $5, +10g\nCarrot: $3, +5g\nCorn: $7, +15g',
            { fontSize: '16px', fill: '#fff' }
        );

        // Sow buttons
        this.add.text(820, 200, 'Sow Plants:', { fontSize: '20px', fill: '#fff' });

        const sowCabbageButton = this.add.text(820, 230, 'Sow Cabbage', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#228B22',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('cabbage'));

        const sowCarrotButton = this.add.text(820, 270, 'Sow Carrot', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FF8C00',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('carrot'));

        const sowCornButton = this.add.text(820, 310, 'Sow Corn', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#FFD700',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.sowPlant('corn'));

        // Reap button
        const reapButton = this.add.text(820, 350, 'Reap Plant', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#8B0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => this.reapPlant());

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
        // Emit sowPlant event to GameScene
        this.scene.get('GameScene').events.emit('sowPlant', type);
    }

    reapPlant() {
        // Emit reapPlant event to GameScene
        this.scene.get('GameScene').events.emit('reapPlant');
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
}

//export default UIScene;