class SaveSystem {
    constructor() {
        this.localStorageKeyPrefix = 'game_save_'; // Prefix for save slots
        this.autoSaveKey = 'auto_save'; // Key for auto-save
    }

    /**
     * Save the game state to a specific save slot.
     * @param {string} slot - The save slot identifier (e.g., "slot1", "slot2").
     * @param {object} gameState - The game state to save.
     */
    saveToSlot(slot, gameState) {
        const key = `${this.localStorageKeyPrefix}${slot}`;
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem(key, serializedState);
        console.log(`Game saved to ${slot}`);
    }

    /**
     * Load the game state from a specific save slot.
     * @param {string} slot - The save slot identifier (e.g., "slot1", "slot2").
     * @returns {object|null} - The loaded game state or null if no save exists.
     */
    loadFromSlot(slot) {
        const key = `${this.localStorageKeyPrefix}${slot}`;
        const serializedState = localStorage.getItem(key);
        if (serializedState) {
            console.log(`Game loaded from ${slot}`);
            return JSON.parse(serializedState);
        } else {
            console.log(`No save found in ${slot}`);
            return null;
        }
    }

    /**
     * Save the game state as an auto-save.
     * @param {object} gameState - The game state to auto-save.
     */
    saveAuto(gameState) {
        try {
            const serializedState = JSON.stringify(gameState);
            localStorage.setItem(this.autoSaveKey, serializedState);
            console.log('Game auto-saved successfully.');
        } catch (error) {
            console.error('Failed to auto-save:', error);
        }
    }

    /**
     * Load the auto-saved game state.
     * @returns {object|null} - The loaded auto-saved game state or null if no auto-save exists.
     */
    loadAuto() {
        const serializedState = localStorage.getItem(this.autoSaveKey);
        if (serializedState) {
            console.log('Auto-save loaded.');
            return JSON.parse(serializedState);
        } else {
            console.log('No auto-save found.');
            return null;
        }
    }

    /**
     * Delete a save slot or auto-save.
     * @param {string} slot - The save slot identifier or "auto" for auto-save.
     */
    deleteSave(slot) {
        const key = slot === 'auto' ? this.autoSaveKey : `${this.localStorageKeyPrefix}${slot}`;
        localStorage.removeItem(key);
        console.log(`${slot === 'auto' ? 'Auto-save' : `Save slot ${slot}`} deleted.`);
    }

    /**
     * List all available save slots.
     * @returns {string[]} - An array of save slot identifiers.
     */
    listSaveSlots() {
        const saveSlots = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.localStorageKeyPrefix)) {
                saveSlots.push(key.replace(this.localStorageKeyPrefix, ''));
            }
        }
        return saveSlots;
    }

    /**
     * Check if an auto-save exists.
     * @returns {boolean} - True if an auto-save exists, false otherwise.
     */
    hasAutoSave() {
        return localStorage.getItem(this.autoSaveKey) !== null;
    }
}
