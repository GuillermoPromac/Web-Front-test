/**
 * Notification entity within the Notification Management bounded context.
 *
 * @class Notification
 */
export class Notification {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Notification identifier.
     * @param {string} [params.profile_id=''] - Profile identifier associated with the notification.
     * @param {string} [params.title=''] - Notification title.
     * @param {string} [params.message=''] - Notification message content.
     * @param {boolean} [params.is_alert=false] - Indicates if this is an alert notification.
     * @param {boolean} [params.is_read=false] - Indicates if the notification has been read.
     * @param {string} [params.created_at=''] - Creation timestamp.
     */
    constructor({ id = null, profile_id = '', title = '', message = '', is_alert = false, is_read = false, created_at = '' }) {
        this.id = id;
        this.profile_id = profile_id;
        this.title = title;
        this.message = message;
        this.is_alert = is_alert;
        this.is_read = is_read;
        this.created_at = created_at || new Date().toISOString();
    }
}