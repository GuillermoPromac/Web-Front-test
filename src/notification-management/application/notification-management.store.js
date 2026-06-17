/**
 * Application service store for the `Notification Management` bounded context.
 * It coordinates notification use cases and keeps a UI-facing state.
 *
 * @module useNotificationStore
 */
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { NotificationManagementApi } from "../infrastructure/notification-management-api.js";
import { NotificationAssembler } from "../infrastructure/notification.assembler.js";
import { Notification } from "../domain/model/notification.entity.js";

const notificationApi = new NotificationManagementApi();

/**
 * Reactive store that exposes Notification Management commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useNotificationStore = defineStore('notification-management', () => {
    /**
     * List of notification entities.
     * @type {import('vue').Ref<Notification[]>}
     */
    const notifications = ref([]);

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether notifications have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const notificationsLoaded = ref(false);

    /**
     * Number of loaded notifications.
     * @type {import('vue').ComputedRef<number>}
     */
    const notificationsCount = computed(() => {
        return notificationsLoaded.value ? notifications.value.length : 0;
    });

    /**
     * Number of unread notifications.
     * @type {import('vue').ComputedRef<number>}
     */
    const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.is_read).length;
    });

    /**
     * Loads notifications from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchNotifications() {
        notificationApi.getNotifications().then(response => {
            notifications.value = NotificationAssembler.toEntitiesFromResponse(response);
            notificationsLoaded.value = true;
            console.log('Notifications loaded:', notifications.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Finds a notification entity by identifier.
     * @param {number|string} id - Notification identifier.
     * @returns {Notification|undefined} Matching notification, if available.
     */
    function getNotificationById(id) {
        return notifications.value.find(notification => notification.id === id);
    }

    /**
     * Creates a notification through infrastructure and appends it to the local state.
     * @param {Notification} notification - Notification entity to persist.
     * @returns {Promise<boolean>} Success status.
     */
    async function addNotification(notification) {
        try {
            const response = await notificationApi.createNotification(notification);
            const resource = response.data;
            const newNotification = NotificationAssembler.toEntityFromResource(resource);
            notifications.value.push(newNotification);
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    /**
     * Updates an existing notification and synchronizes local state.
     * @param {Notification} notification - Notification entity with updated data.
     * @returns {Promise<boolean>} Success status.
     */
    async function updateNotification(notification) {
        try {
            const response = await notificationApi.updateNotification(notification);
            const resource = response.data;
            const updatedNotification = NotificationAssembler.toEntityFromResource(resource);
            const index = notifications.value.findIndex(n => n.id === updatedNotification.id);
            if (index !== -1) notifications.value[index] = updatedNotification;
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    /**
     * Deletes a notification and removes it from the local state.
     * @param {Notification} notification - Notification entity to remove.
     * @returns {Promise<boolean>} Success status.
     */
    async function deleteNotification(notification) {
        try {
            await notificationApi.deleteNotification(notification.id);
            const index = notifications.value.findIndex(n => n.id === notification.id);
            if (index !== -1) notifications.value.splice(index, 1);
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    /**
     * Marks a notification as read.
     * @param {string|number} id - Notification identifier.
     * @returns {Promise<boolean>} Success status.
     */
    async function markAsRead(id) {
        try {
            const response = await notificationApi.markAsRead(id);
            const resource = response.data;
            const updatedNotification = NotificationAssembler.toEntityFromResource(resource);
            const index = notifications.value.findIndex(n => n.id === updatedNotification.id);
            if (index !== -1) notifications.value[index] = updatedNotification;
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    /**
     * Marks all notifications as read for the current profile.
     * @param {string} profileId - Profile identifier.
     * @returns {Promise<boolean>} Success status.
     */
    async function markAllAsRead(profileId) {
        try {
            await notificationApi.markAllAsRead(profileId);
            notifications.value.forEach(n => {
                if (n.profile_id === profileId && !n.is_read) {
                    n.is_read = true;
                }
            });
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    return {
        notifications,
        errors,
        notificationsLoaded,
        notificationsCount,
        unreadCount,
        fetchNotifications,
        getNotificationById,
        addNotification,
        updateNotification,
        deleteNotification,
        markAsRead,
        markAllAsRead
    }
});

export default useNotificationStore;