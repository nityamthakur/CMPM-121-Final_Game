class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Turn counter
        this.turnText = this.add.text(550, 10, 'Turn: 0', { fontSize: '20px', fill: '#fff' });

        // Produce display
        this.produceText = this.add.text(550, 50, 'Produce: 0g', { fontSize: '20px', fill: '#fff' });
        this.goalText = this.add.text(550, 80, 'Goal: 50g', { fontSize: '20px', fill: '#fff' });

        // Instructions
        this.instructionsText = this.add.text(
            550,
            120,
            'Controls:\nArrow Keys: Move\nSPACE: Advance Turn',
            { fontSize: '16px', fill: '#fff' }
        );

        // Event listeners
        this.events.on('updateTurn', (turnCount) => {
            this.turnText.setText(`Turn: ${turnCount}`);
        });
        this.events.on('updateProduce', (produceWeight) => {
            this.produceText.setText(`Produce: ${produceWeight}g`);
        });
    }
}

//export default UIScene;