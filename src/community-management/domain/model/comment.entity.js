/**
 * Comment entity within the Community Management bounded context.
 * Represents a review or comment left by one user on another user's mural.
 *
 * @class Comment
 */
export class Comment {

    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Comment identifier.
     * @param {string} [params.author_profile_id=''] - Identifier of the profile who wrote the comment.
     * @param {string} [params.target_profile_id=''] - Identifier of the profile receiving the comment.
     * @param {string} [params.content=''] - Text content of the comment.
     * @param {number} [params.rating=0] - Star rating associated with the comment.
     * @param {string} [params.created_at=''] - Date the comment was published (defaults to current date in YYYY-MM-DD).
     */
    constructor({
                    id = null,
                    author_profile_id = '',
                    target_profile_id = '',
                    content = '',
                    rating = 0,
                    created_at = ''
                }) {
        this.id = id;
        this.author_profile_id = author_profile_id;
        this.target_profile_id = target_profile_id;
        this.content = content;
        this.rating = rating;
        this.created_at = created_at || new Date().toISOString().split('T')[0];
    }
}