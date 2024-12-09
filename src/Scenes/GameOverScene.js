// GameOverScene.js
//import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(400, 250, 'You Win!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const restartButton = this.add.text(400, 350, 'Return to Menu', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}