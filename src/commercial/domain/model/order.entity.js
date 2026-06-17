/**
 * Order entity within the Commercial Management bounded context.
 * Matches the OrderResource from the backend API.
 *
 * @class Order
 */
export class Order {
    /**
     * @param {Object} params - Entity attributes
     * @param {number} [params.id=0] - Order identifier
     * @param {string} [params.profileId=''] - Profile identifier
     * @param {number} [params.productId=0] - Product identifier
     * @param {string} [params.productName=''] - Product name (denormalized)
     * @param {number} [params.quantity=0] - Quantity ordered
     * @param {number} [params.totalAmount=0] - Total amount
     * @param {string} [params.status='Pending'] - Order status (Pending, Validated, Paid, Completed, Cancelled)
     * @param {string} [params.paymentMethod='CreditCard'] - Payment method
     * @param {string} [params.createdAt=''] - Creation timestamp
     * @param {boolean} [params.isSubscription=false] - Whether this is a subscription order
     */
    constructor({
                    id = 0,
                    profileId = '',
                    productId = 0,
                    productName = '',
                    quantity = 0,
                    totalAmount = 0,
                    status = 'Pending',
                    paymentMethod = 'CreditCard',
                    createdAt = '',
                    isSubscription = false
                }) {
        this.id = id;
        this.profileId = profileId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.createdAt = createdAt || new Date().toISOString();
        this.isSubscription = isSubscription;
    }
}