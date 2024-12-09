class Scenarios {
    constructor() {
        this.scenarioData = {
            tutorial: {
                grid_size: [5, 5],
                available_plants: ['weed'],
                win_conditions: [['weed', 'min', 5]],
                special_events: [],
                human_instructions: 'Grow at least 5 weeds.'
            },
            storm: {
                grid_size: [10, 10],
                available_plants: ['weed', 'flower'],
                win_conditions: [['flower', 'min', 10], ['weed', 'max', 0]],
                special_events: [
                    [5, 'heavy_rain'],
                    [7, 'mushroom_incursion']
                ],
                human_instructions: 'Grow 10 flowers in a weed-free garden.'
            }
        };
    }

    getScenario(name) {
        return this.scenarioData[name] || null;
    }
}