import { Inventory } from "../domain/model/inventory.entity.js";

/**
 * Maps inventory resources into domain entities.
 *
 * @class InventoryAssembler
 */
export class InventoryAssembler {

    /**
     * @param {Object} resource - Inventory resource payload.
     * @returns {Inventory} Inventory entity.
     */
    static toEntityFromResource(resource) {
        return new Inventory({ ...resource });
    }

    /**
     * Parses inventory resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with inventory resources.
     * @returns {Inventory[]} Inventory entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data
            : response.data['inventory'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}