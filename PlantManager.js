import { PlantDefinitions } from './PlantDefinitionLanguage';

class PlantManager {
    constructor(scene) {
        this.scene = scene;
        this.plants = [];
    }

    /**
     * Create a new plant and add it to the grid.
     * @param {string} type - The type of plant.
     * @param {number} x - The x-coordinate on the grid.
     * @param {number} y - The y-coordinate on the grid.
     */
    createPlant(type, x, y) {
        const plantDefinition = PlantDefinitions.getPlantDefinition(type);

        if (!plantDefinition) {
            console.error(`Plant type "${type}" is not defined.`);
            return null;
        }

        const plant = {
            type,
            position: { x, y },
            growth: 1,
            produceValue: plantDefinition.produceValue,
            growthRules: plantDefinition.growthRules,
            sprite: this.scene.add.sprite(
                x * this.scene.cellSize + this.scene.cellSize / 2,
                y * this.scene.cellSize + this.scene.cellSize / 2,
                `${type}_1`
            ),
        };

        // Scale the sprite dynamically
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(`${type}_1`);
        const scaleFactor = Math.min(
            maxPlantSize / plantTexture.getSourceImage().width,
            maxPlantSize / plantTexture.getSourceImage().height
        );

        plant.sprite.setScale(scaleFactor);
        plant.sprite.setDepth(1); // Ensure the plant is above the grid

        this.plants.push(plant);
        console.log(`Created plant of type "${type}" at (${x}, ${y}).`);
        return plant;
    }

    /**
     * Update the growth stage of all plants based on the current resources.
     */
    updatePlantGrowth() {
        this.plants.forEach((plant) => {
            const { x, y } = plant.position;
            const resources = this.scene.grid.getResourcesAt(x, y);
            const neighbors = this.getNeighboringPlants(x, y);

            const canGrow = plant.growthRules.every((rule) =>
                rule({ sun: resources.sun, water: resources.water, neighbors })
            );

            if (canGrow && plant.growth < 3) {
                plant.growth++;
                this.updatePlantSprite(plant);
                console.log(`Plant at (${x}, ${y}) grew to stage ${plant.growth}.`);
            }
        });
    }

    /**
     * Update the sprite of a plant based on its growth stage.
     * @param {Object} plant - The plant object.
     */
    updatePlantSprite(plant) {
        const textureKey = `${plant.type}_${plant.growth}`;
        plant.sprite.setTexture(textureKey);

        // Adjust scaling dynamically for the new sprite
        const maxPlantSize = this.scene.cellSize - 10;
        const plantTexture = this.scene.textures.get(textureKey);
        const scaleFactor = Math.min(
            maxPlantSize / plantTexture.getSourceImage().width,
            maxPlantSize / plantTexture.getSourceImage().height
        );

        plant.sprite.setScale(scaleFactor);
    }

    /**
     * Get all neighboring plants for a given grid cell.
     * @param {number} x - The x-coordinate on the grid.
     * @param {number} y - The y-coordinate on the grid.
     * @returns {Array<Object>} - An array of neighboring plants.
     */
    getNeighboringPlants(x, y) {
        const neighbors = [];
        const directions = [
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
        ];

        directions.forEach(({ dx, dy }) => {
            const neighbor = this.plants.find(
                (plant) => plant.position.x === x + dx && plant.position.y === y + dy
            );
            if (neighbor) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

    /**
     * Remove a plant from the grid.
     * @param {Object} plant - The plant to remove.
     */
    removePlant(plant) {
        plant.sprite.destroy();
        this.plants = this.plants.filter((p) => p !== plant);
        console.log(`Removed plant at (${plant.position.x}, ${plant.position.y}).`);
    }

    /**
     * Serialize all plants for saving the game state.
     * @returns {Array<Object>} - Serialized plant data.
     */
    serializePlants() {
        return this.plants.map((plant) => ({
            type: plant.type,
            position: plant.position,
            growth: plant.growth,
        }));
    }

    /**
     * Deserialize plants from saved game state.
     * @param {Array<Object>} plantData - Serialized plant data.
     */
    deserializePlants(plantData) {
        this.plants.forEach((plant) => plant.sprite.destroy());
        this.plants = [];

        plantData.forEach((data) => {
            const plant = this.createPlant(data.type, data.position.x, data.position.y);
            if (plant) {
                plant.growth = data.growth;
                this.updatePlantSprite(plant);
            }
        });

        console.log('Plants restored from saved state.');
    }
}

