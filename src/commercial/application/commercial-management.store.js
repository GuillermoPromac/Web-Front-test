import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CommercialManagementApi } from "../infrastructure/commercial-management-api.js";
import { ProductAssembler } from "../infrastructure/product.assembler.js";
import { OrderAssembler } from "../infrastructure/order.assembler.js";

const apiService = new CommercialManagementApi();

/**
 * Commercial Management Store - Centralized state management.
 *
 * @module stores/commercial-management
 */
export const useCommercialStore = defineStore('commercial-management', () => {
    // State
    const products = ref([]);
    const orders = ref([]);
    const selectedProduct = ref(null);
    const loading = ref(false);
    const errors = ref([]);
    const productsLoaded = ref(false);
    const ordersLoaded = ref(false);

    // Getters
    const productsCount = computed(() => productsLoaded.value ? products.value.length : 0);
    const ordersCount = computed(() => ordersLoaded.value ? orders.value.length : 0);

    // ==================== PRODUCT ACTIONS ====================

    /**
     * Fetches all products from the API.
     */
    async function fetchProducts() {
        loading.value = true;
        try {
            const response = await apiService.getProducts();
            products.value = ProductAssembler.toEntitiesFromResponse(response);
            productsLoaded.value = true;
        } catch (error) {
            console.error('Error fetching products:', error);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Fetches a single product by ID.
     * @param {number|string} id - Product identifier
     */
    async function fetchProductById(id) {
        loading.value = true;
        try {
            const response = await apiService.getProductById(id);
            if (response.data) {
                const product = ProductAssembler.toEntityFromResource(response.data);
                // Update or add to products array
                const index = products.value.findIndex(p => p.id === product.id);
                if (index !== -1) {
                    products.value[index] = product;
                } else {
                    products.value.push(product);
                }
            }
            productsLoaded.value = true;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Selects a product for purchase.
     * @param {Product} product - Product to select
     */
    function selectProduct(product) {
        selectedProduct.value = product;
    }

    /**
     * Clears the selected product.
     */
    function clearSelectedProduct() {
        selectedProduct.value = null;
    }

    // ==================== ORDER ACTIONS ====================

    /**
     * Fetches all orders from the API.
     */
    async function fetchOrders() {
        loading.value = true;
        try {
            const response = await apiService.getOrders();
            orders.value = OrderAssembler.toEntitiesFromResponse(response);
            ordersLoaded.value = true;
        } catch (error) {
            console.error('Error fetching orders:', error);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Fetches orders by profile ID.
     * @param {string} profileId - Profile identifier
     */
    async function fetchOrdersByProfile(profileId) {
        loading.value = true;
        try {
            // Note: This assumes the backend supports this endpoint
            // If not, we filter locally after fetching all orders
            const response = await apiService.getOrders();
            const allOrders = OrderAssembler.toEntitiesFromResponse(response);
            orders.value = allOrders.filter(order => order.profileId === profileId);
            ordersLoaded.value = true;
        } catch (error) {
            console.error(`Error fetching orders for profile ${profileId}:`, error);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Creates a new order.
     * @param {Object} orderData - CreateOrderResource
     * @returns {Promise<boolean>} Success status
     */
    async function createOrder(orderData) {
        loading.value = true;
        try {
            const response = await apiService.createOrder(orderData);
            if (response.data) {
                const newOrder = OrderAssembler.toEntityFromResource(response.data);
                orders.value.unshift(newOrder); // Add to beginning of array
                ordersLoaded.value = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating order:', error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Validates an order (changes status to Validated).
     * @param {number|string} orderId - Order identifier
     * @returns {Promise<boolean>} Success status
     */
    async function validateOrder(orderId) {
        loading.value = true;
        try {
            const response = await apiService.validateOrder(orderId);
            if (response.data) {
                const updatedOrder = OrderAssembler.toEntityFromResource(response.data);
                const index = orders.value.findIndex(o => o.id === updatedOrder.id);
                if (index !== -1) {
                    orders.value[index] = updatedOrder;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error validating order ${orderId}:`, error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Updates order status.
     * @param {number|string} orderId - Order identifier
     * @param {string} status - New status (Pending, Validated, Paid, Completed, Cancelled)
     * @returns {Promise<boolean>} Success status
     */
    async function updateOrderStatus(orderId, status) {
        loading.value = true;
        try {
            const response = await apiService.updateOrderStatus(orderId, { status });
            if (response.data) {
                const updatedOrder = OrderAssembler.toEntityFromResource(response.data);
                const index = orders.value.findIndex(o => o.id === updatedOrder.id);
                if (index !== -1) {
                    orders.value[index] = updatedOrder;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error updating order status for ${orderId}:`, error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        // State
        products,
        orders,
        selectedProduct,
        loading,
        errors,
        productsLoaded,
        ordersLoaded,
        // Getters
        productsCount,
        ordersCount,
        // Product Actions
        fetchProducts,
        fetchProductById,
        selectProduct,
        clearSelectedProduct,
        // Order Actions
        fetchOrders,
        fetchOrdersByProfile,
        createOrder,
        validateOrder,
        updateOrderStatus
    };
});