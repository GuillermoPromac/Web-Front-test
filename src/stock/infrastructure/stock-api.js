import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const inventoryEndpointPath = import.meta.env.VITE_INVENTORY_ENDPOINT_PATH;

/**
 * Infrastructure service gateway for the Stock bounded-context endpoints.
 *
 * @class StockApi
 * @extends BaseApi
 */
export class StockApi extends BaseApi {
    #inventoryEndpoint;

    /** Creates endpoint client for inventory. */
    constructor() {
        super();
        this.#inventoryEndpoint = new BaseEndpoint(this, inventoryEndpointPath);
    }

    /**
     * Fetches all inventory resources.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the inventory response.
     */
    getInventory() {
        return this.#inventoryEndpoint.getAll();
    }

    /**
     * Fetches one inventory resource by identifier.
     * @param {number|string} id - Inventory identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the inventory response.
     */
    getInventoryById(id) {
        return this.#inventoryEndpoint.getById(id);
    }

    /**
     * Creates an inventory resource.
     * @param {Object} resource - Inventory resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created inventory response.
     */
    createInventory(resource) {
        return this.#inventoryEndpoint.create(resource);
    }

    /**
     * Updates an inventory resource.
     * @param {Object} resource - Inventory resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated inventory response.
     */
    updateInventory(resource) {
        return this.#inventoryEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes an inventory resource by identifier.
     * @param {number|string} id - Inventory identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteInventory(id) {
        return this.#inventoryEndpoint.delete(id);
    }
}