class VictoryManager {
    /**
     * @param {Phaser.Scene} scene - Reference to the game scene.
     */
    constructor(scene) {
        this.scene = scene;
        this.victoryConditions = [];
    }

    /**
     * Load victory conditions from a scenario definition.
     * @param {Array} conditions - List of victory conditions from the scenario.
     * Each condition should be an array with [type, operator, value].
     */
    loadConditions(conditions) {
        this.victoryConditions = conditions.map((condition) => {
            const [type, operator, value] = condition;
            return { type, operator, value };
        });
        console.log("Victory conditions loaded:", this.victoryConditions);
    }

    /**
     * Evaluate the current game state against all victory conditions.
     * @returns {boolean} - True if all victory conditions are met, false otherwise.
     */
    evaluateVictory() {
        for (const condition of this.victoryConditions) {
            const { type, operator, value } = condition;

            let currentValue = 0;
            switch (type) {
                case "produceWeight":
                    currentValue = this.scene.produceWeight;
                    break;
                case "currency":
                    currentValue = this.scene.currency;
                    break;
                case "plantCount":
                    currentValue = this.getPlantCount();
                    break;
                case "plantTypeCount":
                    currentValue = this.getPlantTypeCount(value.type);
                    break;
                default:
                    console.error(`Unknown condition type: ${type}`);
                    return false;
            }

            if (!this.evaluateCondition(currentValue, operator, value)) {
                return false; // If any condition fails, victory is not achieved
            }
        }
        return true; // All conditions met
    }

    /**
     * Evaluate a single condition.
     * @param {number} currentValue - Current value of the game state for the condition.
     * @param {string} operator - Operator to compare values (e.g., "min", "max", "equal").
     * @param {number} value - Target value to compare against.
     * @returns {boolean} - True if the condition is satisfied, false otherwise.
     */
    evaluateCondition(currentValue, operator, value) {
        switch (operator) {
            case "min":
                return currentValue >= value;
            case "max":
                return currentValue <= value;
            case "equal":
                return currentValue === value;
            default:
                console.error(`Unknown operator: ${operator}`);
                return false;
        }
    }

    /**
     * Count total number of plants in the game.
     * @returns {number} - Total number of plants.
     */
    getPlantCount() {
        return this.scene.plants.length;
    }

    /**
     * Count number of plants of a specific type.
     * @param {string} type - The plant type to count.
     * @returns {number} - Number of plants of the specified type.
     */
    getPlantTypeCount(type) {
        return this.scene.plants.filter((plant) => plant.type === type).length;
    }
}

