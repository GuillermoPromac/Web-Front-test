import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StockApi } from '../infrastructure/stock-api.js';
import { InventoryAssembler } from '../infrastructure/inventory.assembler.js';

const stockApi = new StockApi();

export const useStockStore = defineStore('stock', () => {
    const inventory = ref([]);
    const loading = ref(false);

    const fetchInventory = async () => {
        loading.value = true;
        try {
            const response = await stockApi.getInventory();
            inventory.value = InventoryAssembler.toEntitiesFromResponse(response);
        } finally {
            loading.value = false;
        }
    };

    const addProduct = async (productData) => {
        loading.value = true;
        try {
            await stockApi.createInventory(productData);
            await fetchInventory();
        } finally {
            loading.value = false;
        }
    };

    const discountProduct = async (id, quantity) => {
        loading.value = true;
        try {
            const item = inventory.value.find(i => i.id === id);
            if (item) {
                const updatedStock = item.stock_quantity - quantity;
                await stockApi.updateInventory({ id, stock_quantity: updatedStock });
                await fetchInventory();
            }
        } finally {
            loading.value = false;
        }
    };

    return {
        inventory,
        loading,
        fetchInventory,
        addProduct,
        discountProduct
    };
});