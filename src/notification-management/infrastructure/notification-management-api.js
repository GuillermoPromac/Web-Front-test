import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const notificationsEndpointPath = import.meta.env.VITE_NOTIFICATION_ENDPOINT_PATH;

/**
 * Infrastructure service gateway for the Notification Management bounded-context endpoints.
 *
 * @class NotificationManagementApi
 * @extends BaseApi
 */
export class NotificationManagementApi extends BaseApi {
    #notificationsEndpoint;

    /** Creates endpoint client for notifications. */
    constructor() {
        super();
        this.#notificationsEndpoint = new BaseEndpoint(this, notificationsEndpointPath);
    }

    /**
     * Fetches all notification resources.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the notifications response.
     */
    getNotifications() {
        return this.#notificationsEndpoint.getAll();
    }

    /**
     * Fetches one notification resource by identifier.
     * @param {number|string} id - Notification identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the notification response.
     */
    getNotificationById(id) {
        return this.#notificationsEndpoint.getById(id);
    }

    /**
     * Creates a notification resource.
     * @param {Object} resource - Notification resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created notification response.
     */
    createNotification(resource) {
        return this.#notificationsEndpoint.create(resource);
    }

    /**
     * Updates a notification resource.
     * @param {Object} resource - Notification resource payload (must include id).
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated notification response.
     */
    updateNotification(resource) {
        return this.#notificationsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes a notification resource by identifier.
     * @param {number|string} id - Notification identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the delete response.
     */
    deleteNotification(id) {
        return this.#notificationsEndpoint.delete(id);
    }

    /**
     * Marks a notification as read.
     * @param {number|string} id - Notification identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the updated notification response.
     */
    markAsRead(id) {
        return this.#notificationsEndpoint.update(id, { is_read: true });
    }

    /**
     * Marks all notifications as read for a profile.
     * @param {string} profileId - Profile identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the notifications response.
     */
    markAllAsRead(profileId) {
        return this.getNotifications().then(response => {
            const notifications = response.data;
            const updatePromises = notifications
                .filter(n => !n.is_read && n.profile_id === profileId)
                .map(n => this.markAsRead(n.id));
            return Promise.all(updatePromises);
        });
    }
}