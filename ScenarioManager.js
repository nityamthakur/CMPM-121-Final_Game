import * as YAML from 'yaml';

class ScenarioManager {
    constructor(gameScene) {
        this.gameScene = gameScene; // Reference to the GameScene
    }

    /**
     * Load and parse the scenario from a YAML file.
     * @param {string} yamlData - The raw YAML data as a string.
     */
    loadScenario(yamlData) {
        try {
            this.scenario = YAML.parse(yamlData);
            console.log('Scenario loaded successfully:', this.scenario);
        } catch (error) {
            console.error('Failed to parse scenario YAML:', error);
            throw error;
        }
    }

    /**
     * Apply the loaded scenario configuration to the game.
     */
    applyScenario() {
        if (!this.scenario) {
            console.error('No scenario loaded. Call loadScenario first.');
            return;
        }

        const { grid_size, initial_currency, available_plants, win_conditions, special_events, initial_placements, weather_policy } = this.scenario;

        // Configure grid size
        this.gameScene.grid = new Grid(this.gameScene, grid_size[0], grid_size[1], this.gameScene.cellSize);

        // Set initial currency
        this.gameScene.currency = initial_currency;
        this.gameScene.events.emit('updateCurrency', this.gameScene.currency);

        // Set available plants
        this.gameScene.availablePlants = available_plants;

        // Configure win conditions
        this.gameScene.winConditions = win_conditions;

        // Configure special events
        this.gameScene.specialEvents = special_events;

        // Set initial plant placements
        if (initial_placements) {
            initial_placements.forEach(({ type, x, y, growth_stage }) => {
                const plant = new Plant(this.gameScene, x, y, type);
                plant.growth = growth_stage;
                plant.updateSprite();
                this.gameScene.plants.push(plant);
            });
        }

        // Configure weather policy
        this.gameScene.weatherPolicy = weather_policy;

        // Display human instructions (if applicable)
        if (this.scenario.human_instructions) {
            this.displayInstructions(this.scenario.human_instructions);
        }
    }

    /**
     * Display instructions to the player.
     * @param {string} instructions - The instruction text to display.
     */
    displayInstructions(instructions) {
        this.gameScene.add.text(400, 50, instructions, {
            fontSize: '16px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
    }

    /**
     * Handle special events based on the current turn.
     * @param {number} currentTurn - The current game turn.
     */
    handleSpecialEvents(currentTurn) {
        if (!this.scenario || !this.scenario.special_events) return;

        this.scenario.special_events.forEach(([triggerTurn, event]) => {
            if (currentTurn === triggerTurn) {
                console.log(`Triggering event: ${event}`);
                switch (event) {
                    case 'heavy_rain':
                        this.triggerHeavyRain();
                        break;
                    case 'double_growth':
                        this.triggerDoubleGrowth();
                        break;
                    default:
                        console.warn(`Unknown event: ${event}`);
                        break;
                }
            }
        });
    }

    /**
     * Apply the heavy rain event.
     */
    triggerHeavyRain() {
        console.log('Heavy rain triggered: Increasing water levels.');
        for (let y = 0; y < this.gameScene.grid.height; y++) {
            for (let x = 0; x < this.gameScene.grid.width; x++) {
                const cell = this.gameScene.grid.getResourcesAt(x, y);
                cell.water = Math.min(cell.water + 2, 5); // Increase water by 2, max 5
                this.gameScene.grid.updateTileDisplay(x, y, cell);
            }
        }
    }

    /**
     * Apply the double growth event.
     */
    triggerDoubleGrowth() {
        console.log('Double growth triggered: Plants grow twice as fast.');
        this.gameScene.plants.forEach((plant) => {
            const resources = this.gameScene.grid.getResourcesAt(plant.position.x, plant.position.y);
            plant.grow(resources.sun, resources.water); // First growth
            plant.grow(resources.sun, resources.water); // Second growth
        });
    }
}

