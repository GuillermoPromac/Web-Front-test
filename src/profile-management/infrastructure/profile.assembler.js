import {Profile} from "../domain/model/profile.entity.js";

/**
 * Maps publishing category resources into domain entities.
 *
 * @class ProfileAssembler {
 */
export class ProfileAssembler {
    /**
     * Maps resource to Profile entity using snake_case to match the Entity constructor.
     * @param {Object} resource - Profile resource payload.
     * @returns {Profile} Profile entity.
     */
    static toEntityFromResource(resource) {
        return new Profile({...resource});
    }

    /**
     * Parses profile resources from a response.
     * @param {Object} response - HTTP response.
     * @returns {Profile[]} Profile entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['profiles'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}