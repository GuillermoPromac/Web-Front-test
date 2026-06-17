/**
 * Profile entity within the Profile Management bounded context.
 *
 * @class Profile
 */
export class Profile {

    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Profile identifier.
     * @param {string} [params.userId=''] - Foreign key of the related user.
     * @param {string} [params.fundoName=''] - Name of the agricultural field (fundo).
     * @param {string} [params.contactPhone=''] - Contact phone number for the profile.
     * @param {number} [params.moistureThreshold=0] - Moisture threshold percentage for alerts.
     * @param {number} [params.tempThreshold=0] - Temperature threshold in Celsius for alerts.
     */
    constructor({
                    id = null,
                    user_id = '',
                    fundo_name = '',
                    contact_phone = '',
                    moisture_threshold = 0,
                    temp_threshold = 0
                }) {
        this.id = id;
        this.user_id = user_id;
        this.fundo_name = fundo_name;
        this.contact_phone = contact_phone;
        this.moisture_threshold = moisture_threshold;
        this.temp_threshold = temp_threshold;
    }

}