class PlantDefinitionLanguage {
    constructor() {
        this.plantDefinitions = [];
    }

    /**
     * Define a new plant type with its growth rules.
     * @param {Function} plantDefinitionFn - A function that defines a plant type using the DSL.
     */
    definePlant(plantDefinitionFn) {
        const plant = new PlantDSL();
        plantDefinitionFn(plant);
        this.plantDefinitions.push(plant.build());
    }

    /**
     * Get the plant definition for a given plant type.
     * @param {string} type - The type of plant.
     * @returns {Object|null} - The plant definition or null if not found.
     */
    getPlantDefinition(type) {
        return this.plantDefinitions.find((def) => def.type === type) || null;
    }
}

/**
 * Helper class for defining plant types using the DSL.
 */
class PlantDSL {
    constructor() {
        this.type = null;
        this.growthRules = [];
        this.produceValue = 0;
        this.cost = 0;
    }

    name(name) {
        this.type = name;
        return this;
    }

    costToPlant(cost) {
        this.cost = cost;
        return this;
    }

    produce(value) {
        this.produceValue = value;
        return this;
    }

    growsWhen(conditionFn) {
        this.growthRules.push(conditionFn);
        return this;
    }

    build() {
        if (!this.type) {
            throw new Error("Plant type must have a name.");
        }
        return {
            type: this.type,
            cost: this.cost,
            produceValue: this.produceValue,
            growthRules: this.growthRules,
        };
    }
}

/**
 * Global instance for defining plants using the DSL.
 */
const PlantDefinitions = new PlantDefinitionLanguage();

/**
 * Example definitions for different plant types.
 */
PlantDefinitions.definePlant(($) => {
    $.name("cabbage")
        .costToPlant(5)
        .produce(10)
        .growsWhen(({ sun, water, neighbors }) => sun >= 2 && water >= 1);
});

PlantDefinitions.definePlant(($) => {
    $.name("carrot")
        .costToPlant(3)
        .produce(5)
        .growsWhen(({ sun, water }) => sun >= 1 && water >= 2);
});

PlantDefinitions.definePlant(($) => {
    $.name("corn")
        .costToPlant(7)
        .produce(15)
        .growsWhen(({ sun, water, neighbors }) => {
            const cornNeighbors = neighbors.filter((n) => n.type === "corn").length;
            return sun >= 3 && water >= 2 && cornNeighbors >= 1;
        });
});

