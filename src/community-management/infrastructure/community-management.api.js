import { BaseApi } from '../../shared/infrastructure/base-api.js';

/**
 * Service for community profile management operations.
 *
 * @class CommunityManagementApi
 * @extends BaseApi
 */
export class CommunityManagementApi extends BaseApi {
    /**
     * Initializes the API service for the 'community_profiles' resource.
     */
    constructor() {
        super();
        this.resource = 'community_profiles';
    }

    /**
     * Retrieves all community profiles from the infrastructure.
     *
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getCommunityProfiles() {
        return this.http.get(`/${this.resource}`);
    }

    /**
     * Updates an existing community profile by its identifier.
     *
     * @param {string|number} id - The profile identifier.
     * @param {Object} payload - The updated profile data.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateCommunityProfile(id, payload) {
        return this.http.put(`/${this.resource}/${id}`, payload);
    }

    /**
     * Creates a new community profile.
     *
     * @param {Object} payload - The profile data to be created.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createCommunityProfile(payload) {
        return this.http.post(`/${this.resource}`, payload);
    }

    /**
     * Deletes a community profile by its identifier.
     *
     * @param {string|number} id - The profile identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    deleteCommunityProfile(id) {
        return this.http.delete(`/${this.resource}/${id}`);
    }

    /**
     * Retrieves all comments from the infrastructure.
     *
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server containing the list of comments.
     */
    getComments() {
        return this.http.get('/comments');
    }

    /**
     * Creates a new comment.
     *
     * @param {Object} payload - The comment data to be created.
     * @returns {Promise<import('axios').AxiosResponse>} The response from the server confirming the creation.
     */
    createComment(payload) {
        return this.http.post('/comments', payload);
    }

}