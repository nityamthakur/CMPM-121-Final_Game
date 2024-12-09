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
        BootScene,      // First scene to preload all assets
        MainMenuScene,  // Main menu scene for starting or loading the game
        GameScene,      // Main gameplay scene
        UIScene,        // UI overlay for in-game information and controls
        GameOverScene   // Scene for displaying win/lose messages
    ]
};

// Initialize the Phaser game instance
const game = new Phaser.Game(config);

// Check for auto-save and prompt the player or allow scenario selection
window.onload = () => {
    const saveSystem = new SaveSystem();
    const autoSaveState = saveSystem.loadAuto();

    if (autoSaveState) {
        const resume = confirm('An auto-save was found. Do you want to resume your previous game?');
        if (resume) {
            // Start the game with the auto-save state
            game.scene.start('GameScene', { savedState: autoSaveState });
        } else {
            // Go to main menu for scenario selection
            game.scene.start('MainMenuScene');
        }
    } else {
        // No auto-save found, go to main menu
        game.scene.start('MainMenuScene');
    }
};