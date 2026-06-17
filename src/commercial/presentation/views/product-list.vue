<template>
  <div class="product-catalog">
    <h1 class="catalog-title">{{ $t('commercial.catalog-title') }}</h1>

    <div v-if="store.loading" class="loading-state">
      <pv-progress-spinner />
      <p>{{ $t('commercial.loading-products') }}</p>
    </div>

    <div v-else-if="store.products.length === 0" class="empty-state">
      <i class="pi pi-box"></i>
      <p>{{ $t('commercial.empty-catalog') }}</p>
    </div>

    <div v-else class="products-grid">
      <div v-for="product in store.products" :key="product.id" class="product-card">
        <div class="product-image">
          <img
              :src="product.imageUrl || defaultImage"
              :alt="getProductName(product)"
              @error="handleImageError"
          />
          <pv-tag
              :value="getProductTypeLabel(product.type)"
              :severity="getProductTypeSeverity(product.type)"
              class="product-type-tag"
          />
        </div>

        <div class="product-info">
          <h3 class="product-name">{{ getProductName(product) }}</h3>
          <p class="product-description">{{ getProductDescription(product) }}</p>
          <div class="product-price">
            <span class="price-amount">${{ formatPrice(product.price) }}</span>
            <span class="price-label">{{ $t('commercial.price-label') }}</span>
          </div>
        </div>

        <div class="product-actions">
          <pv-button
              :label="$t('commercial.buy')"
              icon="pi pi-shopping-cart"
              class="buy-button"
              @click="handleSelect(product)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCommercialStore } from '../../application/commercial-management.store.js';

const { t } = useI18n();
const store = useCommercialStore();
const router = useRouter();

const defaultImage = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400';

// Map de IDs de producto a claves de traducción
const productTranslationMap = {
  // IDs reales del API - ajusta según tu backend
  'prod_001': 'lora-moisture-sensor',
  'prod_002': 'terratech-plus',
  'prod_003': 'terratech-premium',
  'prod_004': 'terratech-freemium',
  'prod_005': 'smart-valve',
  // Fallbacks por nombre (para productos que vienen del mock)
  'LoRa Moisture Sensor': 'lora-moisture-sensor',
  'TerraTech Plus': 'terratech-plus',
  'TerraTech Premium': 'terratech-premium',
  'TerraTech Freemium': 'terratech-freemium',
  'Smart Valve': 'smart-valve'
};

const getProductTranslationKey = (product) => {
  // Primero intentar por ID
  if (productTranslationMap[product.id]) {
    return productTranslationMap[product.id];
  }
  // Luego intentar por nombre
  if (productTranslationMap[product.name]) {
    return productTranslationMap[product.name];
  }
  // Si no hay traducción, devolver null
  return null;
};

const getProductName = (product) => {
  const key = getProductTranslationKey(product);
  if (key) {
    return t(`commercial.products.${key}.name`);
  }
  // Fallback al nombre del API
  return product.name;
};

const getProductDescription = (product) => {
  const key = getProductTranslationKey(product);
  if (key) {
    return t(`commercial.products.${key}.description`);
  }
  // Fallback a la descripción del API
  return product.description;
};

onMounted(async () => {
  if (!store.productsLoaded.value) {
    await store.fetchProducts();
  }
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const handleImageError = (event) => {
  event.target.src = defaultImage;
};

const getProductTypeLabel = (type) => {
  const upperType = (type || '').toUpperCase();
  const typeMap = {
    'IOT': t('commercial.product-type-iot'),
    'SUBSCRIPTION': t('commercial.product-type-subscription'),
    'PHYSICAL': t('commercial.product-type-physical')
  };
  return typeMap[upperType] || type || t('commercial.product-type-physical');
};

const getProductTypeSeverity = (type) => {
  const upperType = (type || '').toUpperCase();
  const severityMap = {
    'IOT': 'warning',
    'SUBSCRIPTION': 'success',
    'PHYSICAL': 'info'
  };
  return severityMap[upperType] || 'secondary';
};

const handleSelect = (product) => {
  store.selectProduct(product);
  router.push('/commercial/order-summary');
};
</script>

<style scoped>
.product-catalog {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.catalog-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1a2b4c;
  margin-bottom: 2rem;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  color: #cbd5e1;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: #4ade80;
}

.product-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-type-tag {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
}

.product-description {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  min-height: 3rem;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2d2d2d;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4ade80;
}

.price-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}

.product-actions {
  padding: 0 1.25rem 1.25rem 1.25rem;
}

.buy-button {
  width: 100%;
  background: #4ade80;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
}

.buy-button:hover {
  background: #22c55e;
}

@media (max-width: 768px) {
  .product-catalog {
    padding: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .catalog-title {
    font-size: 1.5rem;
  }
}
</style>