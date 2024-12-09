class ScenarioManager {
    constructor(gameScene) {
        this.gameScene = gameScene; // Reference to the GameScene
        this.scenario = null; // Placeholder for the loaded scenario
    }

    /**
     * Load and parse the scenario from a YAML file.
     * @param {string} filePath - Path to the YAML file.
     * @returns {Promise<void>} Resolves when the scenario is loaded successfully.
     */
    async loadScenario(scenarioName) {
        try {
            // Ensure the correct relative path to the scenario files
            const response = await fetch(`scenarios/${scenarioName}.yaml`);
            if (!response.ok) {
                throw new Error(`Failed to load scenario file: ${response.statusText}`);
            }
            const yamlData = await response.text();
            this.scenario = YAML.parse(yamlData);
            console.log('Scenario loaded successfully:', this.scenario);
        } catch (error) {
            console.error('Failed to load and parse scenario YAML:', error);
            throw error;
        }
    }

    /**
     * Apply the loaded scenario to the game.
     * This configures the grid, player position, plants, and other gameplay settings.
     */
    applyScenario() {
        if (!this.scenario) {
            console.error('No scenario loaded. Cannot apply settings.');
            return;
        }

        const { grid_size, initial_plants, starting_currency, victory_conditions } = this.scenario;

        // Update the grid size
        const [gridWidth, gridHeight] = grid_size || [5, 5];
        this.gameScene.grid.resize(gridWidth, gridHeight);

        // Set initial plants on the grid
        if (initial_plants && Array.isArray(initial_plants)) {
            this.gameScene.grid.addInitialPlants(initial_plants);
        }

        // Set starting currency
        if (typeof starting_currency === 'number') {
            this.gameScene.currency = starting_currency;
            this.gameScene.events.emit('updateCurrency', starting_currency);
        }

        // Set victory conditions
        if (victory_conditions) {
            this.gameScene.winConditions = victory_conditions;
        }

        console.log('Scenario applied:', this.scenario);
    }

    /**
     * Handle special events for the current turn.
     * @param {number} turnCount - The current turn number.
     */
    handleSpecialEvents(turnCount) {
        if (!this.scenario || !this.scenario.special_events) {
            return;
        }

        this.scenario.special_events.forEach(([eventTurn, eventName]) => {
            if (eventTurn === turnCount) {
                console.log(`Special event triggered: ${eventName}`);
                // Handle specific event logic here
            }
        });
    }

    getScenario() {
        return this.scenario;
    }

    getWinConditions() {
        return this.scenario?.victory_conditions || [];
    }

    getPlantData(type) {
        return this.scenario?.plant_definitions?.[type] || null;
    }
}

