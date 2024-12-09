"use strict";

// Import Phaser and all scenes (uncomment if using modules)
// import MainMenuScene from './scenes/MainMenuScene.js';
// import GameScene from './scenes/GameScene.js';
// import UIScene from './scenes/UIScene.js';
// import GameOverScene from './scenes/GameOverScene.js';

// Phaser game configuration
let config = {
    type: Phaser.AUTO,
    width: 1000, // Adjusted width to include space for UI on the right
    height: 600,
    parent: 'phaser-game', // Links to the div in index.html
    backgroundColor: '#87CEEB', // Light blue background for the farming theme
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for a top-down game
            debug: false // Enable if you want to debug collisions
        }
    },
    scene: [
        MainMenuScene, // The main menu scene
        GameScene,     // The core gameplay scene
        UIScene,       // The UI scene for controls and display
        GameOverScene  // The game over scene
    ]
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Debug log
console.log('Phaser game initialized.');