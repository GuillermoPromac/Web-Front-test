<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStockStore } from '../../application/stock.store.js';

const { t } = useI18n();
const stockStore = useStockStore();
const selectedProduct = ref(null);
const showDiscountModal = ref(false);

const productForm = ref({
  product_id: '',
  stock_quantity: '',
  warehouse_location: ''
});

const success = ref(false);
const error = ref('');
const discountQuantity = ref(0);

const openDiscountModal = (product) => {
  selectedProduct.value = product;
  discountQuantity.value = 0;
  showDiscountModal.value = true;
};

const closeDiscountModal = () => {
  showDiscountModal.value = false;
  selectedProduct.value = null;
  discountQuantity.value = 0;
};

const submitProduct = async () => {
  error.value = '';

  if (!productForm.value.product_id.trim()) {
    error.value = t('stock.error_name');
    return;
  }

  if (!productForm.value.stock_quantity || productForm.value.stock_quantity <= 0) {
    error.value = t('stock.error_quantity');
    return;
  }

  try {
    await stockStore.addProduct({
      product_id: productForm.value.product_id,
      stock_quantity: Number(productForm.value.stock_quantity),
      warehouse_location: productForm.value.warehouse_location || ''
    });

    productForm.value = { product_id: '', stock_quantity: '', warehouse_location: '' };
    success.value = true;

    setTimeout(() => {
      success.value = false;
    }, 2000);
  } catch (err) {
    error.value = t('stock.error_general');
  }
};

const submitDiscount = async () => {
  if (selectedProduct.value && discountQuantity.value > 0) {
    await stockStore.discountProduct(selectedProduct.value.id, discountQuantity.value);
    closeDiscountModal();
  }
};

onMounted(() => {
  stockStore.fetchInventory();
});
</script>

<template>
  <div class="stock-page">
    <div class="stock-header">
      <h1>{{ t('stock.title') }}</h1>
    </div>

    <!-- Formulario para agregar producto -->
    <div class="stock-form">
      <div class="form-title">
        <i class="pi pi-plus title-icon"></i>
        <h3>{{ t('stock.add_title') }}</h3>
      </div>

      <div v-if="success" class="alert-success">
        <i class="pi pi-check-circle"></i> {{ t('stock.success') }}
      </div>

      <div v-if="error" class="alert-error">
        <i class="pi pi-exclamation-triangle"></i> {{ error }}
      </div>

      <form @submit.prevent="submitProduct">
        <div class="form-row">
          <div class="form-field">
            <label>{{ t('stock.product_id') }}</label>
            <input
                v-model="productForm.product_id"
                type="text"
                :placeholder="t('stock.product_placeholder')"
                autocomplete="off"
            />
          </div>

          <div class="form-field">
            <label>{{ t('stock.quantity') }}</label>
            <input
                v-model.number="productForm.stock_quantity"
                type="number"
                step="0.01"
                placeholder="0"
            />
          </div>

          <div class="form-field">
            <label>{{ t('stock.warehouse') }}</label>
            <input
                v-model="productForm.warehouse_location"
                type="text"
                :placeholder="t('stock.warehouse_placeholder')"
            />
          </div>

          <div class="form-field form-action">
            <button type="submit" :disabled="stockStore.loading">
              <i class="pi pi-save"></i>
              {{ stockStore.loading ? t('stock.adding') : t('stock.add_button') }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Lista de productos -->
    <div class="product-list">
      <div class="list-header">
        <i class="pi pi-box header-icon"></i>
        <h3>{{ t('stock.product_list') }}</h3>
        <span class="badge">{{ stockStore.inventory.length }}</span>
      </div>

      <div v-if="stockStore.loading" class="loading">
        <i class="pi pi-spin pi-spinner"></i> {{ t('stock.loading') }}
      </div>

      <div v-else-if="stockStore.inventory.length === 0" class="empty">
        <i class="pi pi-inbox"></i> {{ t('stock.empty') }}
      </div>

      <div v-else class="table-wrapper">
        <table class="product-table">
          <thead>
          <tr>
            <th>{{ t('stock.product_id') }}</th>
            <th>{{ t('stock.quantity') }}</th>
            <th>{{ t('stock.warehouse') }}</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in stockStore.inventory"
              :key="item.id"
          >
            <td class="product-id">{{ item.product_id }}</td>
            <td class="quantity">{{ item.stock_quantity }}</td>
            <td class="warehouse">{{ item.warehouse_location || '---' }}</td>
            <td class="actions">
              <button class="btn-discount" @click="openDiscountModal(item)">
                <i class="pi pi-minus-circle"></i> {{ t('stock.discount') }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para descontar producto -->
    <div v-if="showDiscountModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <i class="pi pi-exclamation-triangle modal-icon"></i>
          <h3>{{ t('stock.discount_title') }}</h3>
        </div>
        <p class="product-id">{{ selectedProduct?.product_id }}</p>
        <p class="current-stock">
          <i class="pi pi-box"></i> {{ t('stock.current_stock') }}: {{ selectedProduct?.stock_quantity }}
        </p>
        <input
            v-model.number="discountQuantity"
            type="number"
            :placeholder="t('stock.discount_placeholder')"
            autofocus
        />
        <div class="modal-actions">
          <button class="btn-submit" @click="submitDiscount" :disabled="stockStore.loading">
            <i class="pi pi-check"></i> {{ t('stock.discount') }}
          </button>
          <button class="btn-cancel" @click="closeDiscountModal">
            <i class="pi pi-times"></i> {{ t('stock.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-page {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
}

.stock-header {
  margin-bottom: 1.5rem;
}

.stock-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.stock-form {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.title-icon {
  font-size: 1.125rem;
  color: #10b981;
}

.form-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.alert-success, .alert-error {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.form-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-field {
  flex: 1;
  min-width: 100px;
}

.form-field label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-field input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1e293b;
  box-sizing: border-box;
}

.form-field input::placeholder {
  color: #94a3b8;
}

.form-field input:focus {
  outline: none;
  border-color: #00BB31;
  box-shadow: 0 0 0 2px rgba(0, 187, 49, 0.1);
}

.form-action {
  flex: 0 0 auto;
}

.form-action button {
  background: #00BB31;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-action button:hover {
  background: #009628;
}

.form-action button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.product-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-icon {
  font-size: 1rem;
  color: #10b981;
}

.list-header h3 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.badge {
  background: #e2e8f0;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  margin-left: auto;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.product-table th {
  text-align: left;
  padding: 0.75rem 1.25rem;
  background: white;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.product-table td {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.product-table tr:last-child td {
  border-bottom: none;
}

.product-table tr:hover {
  background: #f8fafc;
}

.product-id {
  font-weight: 500;
  color: #0f172a;
}

.quantity {
  font-weight: 600;
  color: #0f172a;
}

.warehouse {
  color: #64748b;
}

.actions {
  text-align: right;
}

.btn-discount {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-discount:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  min-width: 320px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.modal-icon {
  color: #ef4444;
  font-size: 1.25rem;
}

.modal-content h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1e293b;
}

.current-stock {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-content input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1e293b;
  box-sizing: border-box;
}

.modal-content input:focus {
  outline: none;
  border-color: #00BB31;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-submit {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover {
  background: #dc2626;
}

.btn-cancel {
  flex: 1;
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel:hover {
  background: #cbd5e1;
}

@media (max-width: 768px) {
  .stock-page {
    padding: 1rem;
  }

  .stock-form {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .form-field {
    min-width: auto;
  }

  .form-action button {
    width: 100%;
  }
}
</style>