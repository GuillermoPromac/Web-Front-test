<template>
  <div class="order-summary">
    <pv-card class="order-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-credit-card"></i>
          <span>{{ $t('commercial.order-summary') }}</span>
        </div>
      </template>

      <template #content>
        <div v-if="store.selectedProduct" class="order-content">
          <!-- Product Summary -->
          <div class="product-summary">
            <p class="product-name"><strong>{{ getProductName(store.selectedProduct) }}</strong></p>
            <p class="product-total">
              {{ $t('commercial.total-pay') }}:
              <span class="total-amount">${{ formatPrice(store.selectedProduct.price) }}</span>
            </p>
          </div>

          <!-- Payment Method Selection -->
          <div class="payment-section">
            <h3 class="section-title">{{ $t('commercial.payment-method') }}</h3>
            <div class="payment-options">
              <div class="payment-option">
                <pv-radiobutton
                    v-model="paymentMethod"
                    inputId="creditCard"
                    name="method"
                    value="CreditCard"
                />
                <label for="creditCard" class="ml-2">{{ $t('commercial.payment-credit-card') }}</label>
              </div>
              <div class="payment-option">
                <pv-radiobutton
                    v-model="paymentMethod"
                    inputId="debitCard"
                    name="method"
                    value="DebitCard"
                />
                <label for="debitCard" class="ml-2">{{ $t('commercial.payment-debit-card') }}</label>
              </div>
              <div class="payment-option">
                <pv-radiobutton
                    v-model="paymentMethod"
                    inputId="paypal"
                    name="method"
                    value="PayPal"
                />
                <label for="paypal" class="ml-2">{{ $t('commercial.payment-paypal') }}</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <pv-button
                :label="$t('commercial.cancel')"
                icon="pi pi-arrow-left"
                severity="secondary"
                class="cancel-button"
                @click="router.back()"
            />
            <pv-button
                :label="$t('commercial.confirm')"
                icon="pi pi-check"
                severity="success"
                class="confirm-button"
                :loading="isSubmitting"
                @click="confirmOrder"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-shopping-cart"></i>
          <p>{{ $t('commercial.no-products') }}</p>
          <pv-button
              :label="$t('commercial.buy')"
              @click="router.push('/commercial/catalog')"
          />
        </div>
      </template>
    </pv-card>

    <!-- Success Dialog -->
    <pv-dialog
        v-model:visible="showSuccess"
        modal
        :header="$t('commercial.success-title')"
        :style="{ width: '90%', maxWidth: '450px' }"
        class="success-dialog"
    >
      <div class="success-content">
        <i class="pi pi-check-circle success-icon"></i>
        <h2>{{ $t('commercial.success-title') }}</h2>
        <p>{{ $t('commercial.success-msg') }}</p>
        <pv-button
            :label="$t('commercial.finish')"
            severity="success"
            class="finish-button"
            @click="finishOrder"
        />
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCommercialStore } from '../../application/commercial-management.store.js';

const { t } = useI18n();
const store = useCommercialStore();
const router = useRouter();

const paymentMethod = ref('CreditCard');
const showSuccess = ref(false);
const isSubmitting = ref(false);

// Map de IDs de producto a claves de traducción (mismo que en product-list)
const productTranslationMap = {
  'prod_001': 'lora-moisture-sensor',
  'prod_002': 'terratech-plus',
  'prod_003': 'terratech-premium',
  'prod_004': 'terratech-freemium',
  'prod_005': 'smart-valve',
  'LoRa Moisture Sensor': 'lora-moisture-sensor',
  'TerraTech Plus': 'terratech-plus',
  'TerraTech Premium': 'terratech-premium',
  'TerraTech Freemium': 'terratech-freemium',
  'Smart Valve': 'smart-valve'
};

const getProductTranslationKey = (product) => {
  if (productTranslationMap[product.id]) {
    return productTranslationMap[product.id];
  }
  if (productTranslationMap[product.name]) {
    return productTranslationMap[product.name];
  }
  return null;
};

const getProductName = (product) => {
  const key = getProductTranslationKey(product);
  if (key) {
    return t(`commercial.products.${key}.name`);
  }
  return product.name;
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const confirmOrder = async () => {
  if (!store.selectedProduct) return;

  isSubmitting.value = true;

  const profileId = 'prof_001';

  const orderData = {
    profileId: profileId,
    productId: store.selectedProduct.id,
    quantity: 1,
    paymentMethod: paymentMethod.value,
    isSubscription: store.selectedProduct.type === 'SUBSCRIPTION'
  };

  const success = await store.createOrder(orderData);

  if (success) {
    showSuccess.value = true;
  }

  isSubmitting.value = false;
};

const finishOrder = () => {
  showSuccess.value = false;
  store.clearSelectedProduct();
  router.push('/home');
};
</script>

<style scoped>
.order-summary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.order-card {
  width: 100%;
  max-width: 600px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-title i {
  font-size: 1.5rem;
}

.product-summary {
  background: #f0fdf4;
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.product-name {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.product-total {
  font-size: 1rem;
  margin: 0;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
}

.payment-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button,
.confirm-button {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state i {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 1rem;
  color: #6c757d;
}

.success-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.success-content {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #22c55e;
  margin-bottom: 1rem;
}

.success-content h2 {
  margin: 0 0 0.5rem 0;
}

.success-content p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.finish-button {
  width: 100%;
}

@media (max-width: 640px) {
  .order-summary {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>