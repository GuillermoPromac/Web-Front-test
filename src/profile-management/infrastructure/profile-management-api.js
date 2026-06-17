import { BaseApi } from '../../shared/infrastructure/base-api.js';

/**
 * Service for profile management operations.
 *
 * @class ProfileManagementApi
 * @extends BaseApi
 */
export class ProfileManagementApi extends BaseApi {
    /**
     * Initializes the API service for the 'profiles' resource.
     */
    constructor() {
        super();
        this.resource = 'profiles';
    }

    /**
     * Retrieves all profiles from the infrastructure.
     *
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server containing the list of profiles.
     */
    getProfile() {
        return this.http.get(`/${this.resource}`);
    }

    /**
     * Updates an existing profile by its identifier.
     *
     * @param {string|number} id - The profile identifier.
     * @param {Object} payload - The updated profile data.
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server confirming the update.
     */
    updateProfile(id, payload) {

        return this.http.put(`/${this.resource}/${id}`, payload);
    }

    /**
     * Creates a new profile.
     *
     * @param {Object} payload - The profile data to be created.
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server containing the created profile.
     */
    createProfile(payload) {
        return this.http.post(`/${this.resource}`, payload);
    }

    /**
     * Deletes a profile by its identifier.
     *
     * @param {string|number} id - The profile identifier.
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server confirming the deletion.
     */
    deleteProfile(id) {
        return this.http.delete(`/${this.resource}/${id}`);
    }
}