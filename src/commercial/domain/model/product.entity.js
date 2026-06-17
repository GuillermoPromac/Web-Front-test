/**
 * Product entity within the Commercial Management bounded context.
 * Matches the ProductResource from the backend API.
 *
 * @class Product
 */
export class Product {
    /**
     * @param {Object} params - Entity attributes
     * @param {number} [params.id=0] - Product identifier
     * @param {string} [params.name=''] - Product name
     * @param {string} [params.description=''] - Product description
     * @param {number} [params.price=0] - Product price
     * @param {string} [params.type=''] - Product type (SUBSCRIPTION, PHYSICAL, etc.)
     * @param {string} [params.imageUrl=''] - Product image URL
     */
    constructor({ id = 0, name = '', description = '', price = 0, type = '', imageUrl = '' }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.imageUrl = imageUrl;
    }
}