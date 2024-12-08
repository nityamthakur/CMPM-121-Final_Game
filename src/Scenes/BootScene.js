class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Set the path for all assets
        this.load.setPath('./assets/');

        // Load images
        this.load.image('player', 'player.png'); // Load the player sprite
        this.load.image('balloonSmall', 'balloon_small.png');
        this.load.image('balloonMedium', 'balloon_medium.png');
        this.load.image('balloonLarge', 'balloon_large.png');
        this.load.image('bullet', 'bullet.png');
        this.load.image('background', 'background.png'); // Background image

        this.load.image('balloonSpecial', 'balloon_special.png');
        this.load.image('powerUp1', 'powerup1.png'); // Rapid fire

        // Load new images
        this.load.image('enemy', 'enemy.png'); // Load the enemy sprite
        this.load.image('enemyBullet', 'enemyBullet.png'); // Load the enemy bullet sprite
        this.load.image('thunderCloud', 'thunderCloud.png'); // Load the thunder cloud sprite
        this.load.image('lightning', 'lightning.png'); // Load the lightning strike sprite
        this.load.image('meteor', 'meteor.png'); // Extra life
        this.load.image('shield', 'shield.png');
        this.load.image('shield_effect', 'shield_effect.png');
        this.load.image('enemyBoss', 'enemy_boss.png');
        this.load.image('bossBullet', 'boss_bullet.png');
        this.load.image('heart', 'heart.png');


        // Load sounds
        this.load.audio('pop', 'pop.ogg');
        this.load.audio('deflate', 'deflate.ogg');
        this.load.audio('shoot', 'shooting.ogg');
        this.load.audio('powerUpCollect', 'collect.ogg'); // Sound for collecting a power-up
        this.load.audio('powerUpUse', 'use.ogg'); // Sound for using a power-up

        // Load new sounds
        this.load.audio('enemyShoot', 'enemyShoot.ogg'); // Sound for enemy shooting
        this.load.audio('lightningStrike', 'lightningStrike.ogg'); // Sound for lightning strike
        this.load.audio('enemyHit', 'enemyHit.ogg'); // Sound for when the player is hit by an enemy or enemy bullet

        // Display loading progress
        const loadingText = this.add.text(20, 20, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' });
        this.load.on('progress', (progress) => {
            loadingText.setText(`Loading: ${Math.round(progress * 100)}%`);
        });
    }

    create() {
        // All assets are loaded, transition to the main menu
        this.scene.start('MainMenuScene');
    }
}