import { Order } from "../domain/model/order.entity.js";

/**
 * Maps order resources into domain entities.
 *
 * @class OrderAssembler
 */
export class OrderAssembler {
    /**
     * Maps a resource object to an Order entity.
     * @param {Object} resource - Order resource payload
     * @returns {Order} Order entity
     */
    static toEntityFromResource(resource) {
        return new Order({
            id: resource.id,
            profileId: resource.profileId,
            productId: resource.productId,
            productName: resource.productName,
            quantity: resource.quantity,
            totalAmount: resource.totalAmount,
            status: resource.status,
            paymentMethod: resource.paymentMethod,
            createdAt: resource.createdAt,
            isSubscription: resource.isSubscription || false
        });
    }

    /**
     * Parses order resources from an HTTP response.
     * @param {import('axios').AxiosResponse} response - HTTP response
     * @returns {Order[]} Array of Order entities
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            return [];
        }

        let resources = response.data instanceof Array ? response.data : response.data['orders'];
        if (!resources) resources = response.data;
        if (!resources || !Array.isArray(resources)) return [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}