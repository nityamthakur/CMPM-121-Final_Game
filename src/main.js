"use strict";

// Global variable for language management
let currentLanguage = 'en'; // Default language

// Load language data
let languageData = {};
fetch('./languages.json')
    .then((response) => response.json())
    .then((data) => {
        languageData = data;
        console.log('Language data loaded successfully.');
    })
    .catch((error) => {
        console.error('Failed to load language data:', error);
    });

// Helper function to get localized strings
function t(key) {
    const keys = key.split('.');
    let result = languageData[currentLanguage];
    keys.forEach((k) => {
        result = result ? result[k] : null;
    });
    return result || key; // Return key if translation is not found
}

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
        const resume = confirm(t('main_menu.resume_auto_save')); // Use translated string
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

    // Register the Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./src/utilities/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
};

// Event listener to change language (if implemented in HTML or settings)
document.addEventListener('languageChange', (e) => {
    currentLanguage = e.detail.language || 'en';
    console.log(`Language changed to: ${currentLanguage}`);
});