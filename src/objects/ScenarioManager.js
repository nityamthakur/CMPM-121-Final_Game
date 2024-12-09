class ScenarioManager {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.scenarios = new Scenarios(); // Instantiate Scenarios class
        this.scenario = null;
    }

    /**
     * Load a scenario by name.
     * @param {string} scenarioName - The name of the scenario to load.
     */
    loadScenario(scenarioName) {
        try {
            const scenario = this.scenarios.getScenario(scenarioName);
            if (scenario) {
                this.scenario = scenario;
                console.log(`Scenario loaded successfully: ${scenarioName}`, this.scenario);
            } else {
                throw new Error(`Scenario "${scenarioName}" not found.`);
            }
        } catch (error) {
            console.error('Error loading scenario:', error);
        }
    }

    /**
     * Apply the scenario settings to the game.
     */
    applyScenario() {
        if (!this.scenario) {
            console.error('No scenario loaded. Cannot apply settings.');
            return;
        }

        const { grid_size, available_plants, special_events, win_conditions, human_instructions } = this.scenario;

        // Set grid size
        const [width, height] = grid_size;
        this.gameScene.grid.resize(width, height);

        // Set available plants
        this.gameScene.availablePlants = available_plants;

        // Set special events
        this.specialEvents = special_events;

        // Set win conditions
        this.winConditions = win_conditions;

        // Display human instructions
        console.log('Instructions:', human_instructions);
    }

    handleSpecialEvents(turnCount) {
        if (!this.specialEvents) return;

        this.specialEvents.forEach(([eventTurn, eventName]) => {
            if (turnCount === eventTurn) {
                console.log(`Special Event Triggered: ${eventName}`);
            }
        });
    }

    getPlantData(type) {
        return this.gameScene.availablePlants?.find((plant) => plant === type) || null;
    }

    getWinConditions() {
        return this.winConditions || [];
    }
}