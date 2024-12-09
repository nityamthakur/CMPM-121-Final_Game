class HistoryManager {
    constructor() {
        this.historyStack = []; // Stack for storing past states
        this.redoStack = []; // Stack for storing redo states
        this.maxHistorySize = 50; // Optional: Limit the number of undoable actions to save memory
    }

    /**
     * Push a new game state to the history stack.
     * @param {object} gameState - The current game state to save.
     */
    pushState(gameState) {
        // Serialize and clone the state to avoid unintended mutations
        const clonedState = JSON.parse(JSON.stringify(gameState));
        this.historyStack.push(clonedState);

        // Clear the redo stack when a new action is performed
        this.redoStack = [];

        // Maintain a fixed size for the history stack
        if (this.historyStack.length > this.maxHistorySize) {
            this.historyStack.shift();
        }
    }

    /**
     * Undo the last action and move the current state to the redo stack.
     * @returns {object|null} - The previous game state or null if no undo is possible.
     */
    undo() {
        if (this.historyStack.length === 0) {
            console.log('Undo not possible: No history available.');
            return null;
        }

        const lastState = this.historyStack.pop();
        this.redoStack.push(lastState);

        if (this.historyStack.length > 0) {
            const previousState = this.historyStack[this.historyStack.length - 1];
            console.log('Undo successful.');
            return JSON.parse(JSON.stringify(previousState));
        } else {
            console.log('Undo successful, but no further history exists.');
            return null;
        }
    }

    /**
     * Redo the last undone action and move the state back to the history stack.
     * @returns {object|null} - The redone game state or null if no redo is possible.
     */
    redo() {
        if (this.redoStack.length === 0) {
            console.log('Redo not possible: No redo history available.');
            return null;
        }

        const redoState = this.redoStack.pop();
        this.historyStack.push(redoState);
        console.log('Redo successful.');
        return JSON.parse(JSON.stringify(redoState));
    }

    /**
     * Clear all history and redo stacks.
     */
    clearHistory() {
        this.historyStack = [];
        this.redoStack = [];
        console.log('History cleared.');
    }

    /**
     * Get the current size of the history stack.
     * @returns {number} - Number of states in the history stack.
     */
    getHistorySize() {
        return this.historyStack.length;
    }

    /**
     * Get the current size of the redo stack.
     * @returns {number} - Number of states in the redo stack.
     */
    getRedoSize() {
        return this.redoStack.length;
    }
}

