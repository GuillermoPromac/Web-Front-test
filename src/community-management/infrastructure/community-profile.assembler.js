import { CommunityProfile } from "../domain/model/community-profile.entity.js";

/**
 * Maps community profile resources into domain entities.
 *
 * @class CommunityProfileAssembler
 */
export class CommunityProfileAssembler {
    /**
     * Maps resource to CommunityProfile entity using snake_case to match the Entity constructor.
     * @param {Object} resource - Community profile resource payload.
     * @returns {CommunityProfile} CommunityProfile entity.
     */
    static toEntityFromResource(resource) {
        return new CommunityProfile({...resource});
    }

    /**
     * Parses community profile resources from a response.
     * @param {Object} response - HTTP response.
     * @returns {CommunityProfile[]} CommunityProfile entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['community_profiles'];

        if (!resources) resources = response.data;

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}