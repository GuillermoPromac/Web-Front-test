import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const productsEndpointPath = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH;
const ordersEndpointPath = import.meta.env.VITE_ORDERS_ENDPOINT_PATH;

/**
 * API client for the commercial management module.
 *
 * @class CommercialManagementApi
 * @extends BaseApi
 */
export class CommercialManagementApi extends BaseApi {
    #productsEndpoint;
    #ordersEndpoint;

    constructor() {
        super();
        this.#productsEndpoint = new BaseEndpoint(this, productsEndpointPath);
        this.#ordersEndpoint = new BaseEndpoint(this, ordersEndpointPath);
    }

    // ==================== PRODUCTS ====================

    /**
     * Retrieves all products.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getProducts() {
        return this.#productsEndpoint.getAll();
    }

    /**
     * Retrieves a product by its identifier.
     * @param {number|string} id - Product identifier
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getProductById(id) {
        return this.#productsEndpoint.getById(id);
    }

    /**
     * Creates a new product.
     * @param {Object} resource - Product data
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createProduct(resource) {
        return this.#productsEndpoint.create(resource);
    }

    // ==================== ORDERS ====================

    /**
     * Retrieves all orders.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getOrders() {
        return this.#ordersEndpoint.getAll();
    }

    /**
     * Retrieves an order by its identifier.
     * @param {number|string} id - Order identifier
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getOrderById(id) {
        return this.#ordersEndpoint.getById(id);
    }

    /**
     * Creates a new order.
     * @param {Object} resource - Order data (CreateOrderResource)
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createOrder(resource) {
        return this.#ordersEndpoint.create(resource);
    }

    /**
     * Validates an order (changes status to Validated).
     * @param {number|string} id - Order identifier
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    validateOrder(id) {
        return this.http.put(`${ordersEndpointPath}/${id}/validate`);
    }

    /**
     * Updates order status.
     * @param {number|string} id - Order identifier
     * @param {Object} resource - UpdateOrderStatusResource
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateOrderStatus(id, resource) {
        return this.http.put(`${ordersEndpointPath}/${id}/status`, resource);
    }
}