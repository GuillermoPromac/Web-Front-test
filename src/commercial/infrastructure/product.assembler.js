import { Product } from "../domain/model/product.entity.js";

/**
 * Maps product resources into domain entities.
 *
 * @class ProductAssembler
 */
export class ProductAssembler {
    /**
     * Maps a resource object to a Product entity.
     * @param {Object} resource - Product resource payload
     * @returns {Product} Product entity
     */
    static toEntityFromResource(resource) {
        return new Product({
            id: resource.id,
            name: resource.name,
            description: resource.description || '',
            price: resource.price,
            type: resource.type || resource.category || 'PHYSICAL',
            imageUrl: resource.imageUrl || ''
        });
    }

    /**
     * Parses product resources from an HTTP response.
     * @param {import('axios').AxiosResponse} response - HTTP response
     * @returns {Product[]} Array of Product entities
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['products'];
        if (!resources) resources = response.data;
        if (!resources || !Array.isArray(resources)) return [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}