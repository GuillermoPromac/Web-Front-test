/**
 * Community Profile entity within the Community Management bounded context.
 *
 * @class CommunityProfile
 */
export class CommunityProfile {

    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Community profile identifier.
     * @param {string} [params.profile_id=''] - Foreign key of the related general profile.
     * @param {string} [params.nickname=''] - User's community nickname.
     * @param {number} [params.reputation_score=0] - User's reputation score.
     * @param {string} [params.public_bio=''] - Public biography of the user.
     * @param {boolean} [params.visibility_status=false] - Whether the profile is visible in the community.
     */
    constructor({
                    id = null,
                    profile_id = '',
                    nickname = '',
                    reputation_score = 0,
                    public_bio = '',
                    visibility_status = false
                }) {
        this.id = id;
        this.profile_id = profile_id;
        this.nickname = nickname;
        this.reputation_score = reputation_score;
        this.public_bio = public_bio;
        this.visibility_status = visibility_status;
    }
}