"use strict";



// Configuration for Phaser Game
let config = {
    type: Phaser.AUTO,
    width: 1000, // Adjusted width to accommodate the UI on the right
    height: 600,
    parent: 'phaser-game', // Ensure a div with id="phaser-game" in your HTML
    backgroundColor: '#87CEEB', // Light blue background for farming theme
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for top-down simulation
            debug: false // Set to true for debugging collision boxes
        }
    },
    scene: [
        MainMenuScene, // This includes both BootScene and MainMenuScene
        GameScene,
        UIScene,
        GameOverScene
    ]
};

// Initialize the Phaser game instance
const game = new Phaser.Game(config);

// Check for auto-save and prompt the player
window.onload = () => {
    const saveSystem = new SaveSystem();
    const autoSaveState = saveSystem.loadAuto();

    if (autoSaveState) {
        const resume = confirm('An auto-save was found. Do you want to resume your previous game?');
        if (resume) {
            // Start the game with the auto-save state
            game.scene.start('GameScene', { savedState: autoSaveState });
        }
    }
};