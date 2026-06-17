<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import useNotificationStore from '../../application/notification-management.store.js';
import { Notification } from '../../domain/model/notification.entity.js';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const store = useNotificationStore();
const { loading } = storeToRefs(store);
const { addNotification } = store;

const alertForm = ref({
  profile_id: 'prof_001',
  title: '',
  message: '',
  is_alert: true,
  is_read: false
});

const alertTypes = [
  { value: true, labelKey: 'alert-type-critical', severity: 'danger', icon: 'pi pi-exclamation-circle' },
  { value: false, labelKey: 'alert-type-info', severity: 'info', icon: 'pi pi-info-circle' }
];

const generateAlertMessage = () => {
  const defaultMessage = alertForm.value.is_alert
      ? t('notifications.urgent-action-required', { field: 'the field' })
      : t('notifications.info-update', { field: 'the field' });
  return defaultMessage + ' ' + t('notifications.check-thresholds') + ' ' + t('notifications.take-action');
};

const updateMessage = () => {
  alertForm.value.message = generateAlertMessage();
};

const handleAlertTypeChange = () => {
  updateMessage();
};

// Ejecutar al montar el componente para que el mensaje inicial se genere
onMounted(() => {
  updateMessage();
});

async function submitAlert() {
  if (!alertForm.value.title) {
    toast.add({
      severity: 'error',
      summary: t('notifications.error'),
      detail: t('notifications.title-required'),
      life: 3000
    });
    return;
  }

  const notification = new Notification({
    profile_id: alertForm.value.profile_id,
    title: alertForm.value.title,
    message: alertForm.value.message,
    is_alert: alertForm.value.is_alert,
    is_read: false,
    created_at: new Date().toISOString()
  });

  const success = await addNotification(notification);

  if (success) {
    toast.add({
      severity: 'success',
      summary: t('notifications.success'),
      detail: t('notifications.alert-created'),
      life: 3000
    });

    alertForm.value = {
      profile_id: 'prof_001',
      title: '',
      message: '',
      is_alert: true,
      is_read: false
    };

    // Regenerar mensaje después de limpiar el formulario
    updateMessage();

    setTimeout(() => {
      router.push({ name: 'notifications-list' });
    }, 2000);
  } else {
    toast.add({
      severity: 'error',
      summary: t('notifications.error'),
      detail: t('notifications.alert-error'),
      life: 3000
    });
  }
}

function cancel() {
  router.push({ name: 'notifications-list' });
}
</script>

<template>
  <div class="alert-container">
    <div class="alert-header">
      <div class="title-icon">
        <i class="pi pi-bell"></i>
      </div>
      <div class="title-text">
        <h2>{{ t('notifications.send-alert') }}</h2>
        <p>{{ t('notifications.alert-description') }}</p>
      </div>
    </div>

    <div class="form-card">
      <div class="form-content">
        <!-- Alert Type Selection -->
        <div class="field-group">
          <label class="field-label">
            {{ t('notifications.alert-type') }} <span class="required">*</span>
          </label>
          <div class="type-buttons">
            <pv-button
                v-for="type in alertTypes"
                :key="type.value"
                :label="t(`notifications.${type.labelKey}`)"
                :severity="type.severity"
                :outlined="alertForm.is_alert !== type.value"
                :icon="type.icon"
                class="type-button"
                @click="alertForm.is_alert = type.value; handleAlertTypeChange()"
            />
          </div>
        </div>

        <!-- Live Preview Card -->
        <div class="preview-section">
          <div class="preview-card" :class="{ 'preview-critical': alertForm.is_alert, 'preview-info': !alertForm.is_alert }">
            <div class="preview-header">
              <div class="preview-badge">
                <i :class="alertForm.is_alert ? 'pi pi-exclamation-triangle' : 'pi pi-info-circle'"></i>
                <span>{{ alertForm.is_alert ? t('notifications.alert-type-critical') : t('notifications.alert-type-info') }}</span>
              </div>
              <span class="preview-label">{{ t('notifications.preview') }}</span>
            </div>
            <div class="preview-body">
              <h4 class="preview-title">{{ alertForm.title || t('notifications.sample-title') }}</h4>
              <p class="preview-message">{{ alertForm.message || t('notifications.sample-message') }}</p>
            </div>
          </div>
        </div>

        <!-- Alert Title Input -->
        <div class="field-group">
          <label class="field-label">
            {{ t('notifications.alert-title') }} <span class="required">*</span>
          </label>
          <pv-input-text
              v-model="alertForm.title"
              :placeholder="t('notifications.title-placeholder')"
              class="full-width"
              :class="{ 'input-filled': alertForm.title }"
              @input="updateMessage"
          />
        </div>

        <!-- Message Preview (Readonly) -->
        <div class="field-group">
          <label class="field-label">{{ t('notifications.message-preview') }}</label>
          <pv-textarea
              v-model="alertForm.message"
              readonly
              rows="4"
              class="full-width message-preview"
              :class="{ 'preview-critical-text': alertForm.is_alert, 'preview-info-text': !alertForm.is_alert }"
          />
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <pv-button
              :label="t('notifications.send')"
              icon="pi pi-send"
              severity="success"
              :loading="loading"
              class="send-button"
              @click="submitAlert"
          />
          <pv-button
              :label="t('notifications.cancel')"
              icon="pi pi-times"
              severity="secondary"
              class="cancel-button"
              @click="cancel"
          />
        </div>
      </div>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-icon">
        <i class="pi pi-question-circle"></i>
      </div>
      <div class="info-content">
        <h4>{{ t('notifications.alert-info-title') }}</h4>
        <ul>
          <li><i class="pi pi-circle-fill"></i> {{ t('notifications.alert-info-1') }}</li>
          <li><i class="pi pi-circle-fill"></i> {{ t('notifications.alert-info-2') }}</li>
          <li><i class="pi pi-circle-fill"></i> {{ t('notifications.alert-info-3') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Styles */
.alert-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
}

.title-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00BB31 0%, #009628 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon i {
  font-size: 1.8rem;
  color: white;
}

.title-text h2 {
  margin: 0 0 0.25rem 0;
  color: #1A2B4C;
  font-size: 1.5rem;
  font-weight: 600;
}

.title-text p {
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Field Group */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #1A2B4C;
  font-size: 0.9rem;
}

.required {
  color: #FF4757;
}

/* Type Buttons */
.type-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.type-button {
  min-width: 130px;
  justify-content: center;
  padding: 0.6rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.type-button:hover {
  transform: translateY(-2px);
}

/* Preview Section */
.preview-section {
  margin: 0.5rem 0;
}

.preview-card {
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.preview-critical {
  background: linear-gradient(135deg, #FFF5F5 0%, #FFEBEE 100%);
  border-left: 4px solid #FF4757;
}

.preview-info {
  background: linear-gradient(135deg, #F0F9FF 0%, #E3F2FD 100%);
  border-left: 4px solid #42A5F5;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preview-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preview-critical .preview-badge {
  color: #FF4757;
}

.preview-info .preview-badge {
  color: #42A5F5;
}

.preview-label {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.preview-body {
  margin-top: 0.5rem;
}

.preview-title {
  margin: 0 0 0.5rem 0;
  color: #1A2B4C;
  font-size: 1rem;
  font-weight: 600;
}

.preview-message {
  margin: 0;
  color: #1A2B4C;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Input Fields */
.full-width {
  width: 100%;
}

.input-filled {
  border-color: #00BB31;
}

/* Message Preview Textarea */
.message-preview {
  background-color: #f8f9fa;
  border: 1px solid #e8e8e8;
  font-family: inherit;
  color: #1A2B4C !important;
  font-weight: 500;
}

.preview-critical-text {
  border-left: 3px solid #FF4757 !important;
  background-color: #FFF5F5 !important;
  color: #1A2B4C !important;
}

.preview-info-text {
  border-left: 3px solid #42A5F5 !important;
  background-color: #F0F9FF !important;
  color: #1A2B4C !important;
}

/* Forzar color de texto en textarea */
.message-preview:read-only {
  color: #1A2B4C !important;
  -webkit-text-fill-color: #1A2B4C !important;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.send-button,
.cancel-button {
  flex: 1;
  justify-content: center;
  padding: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 187, 49, 0.3);
}

.cancel-button:hover {
  transform: translateY(-1px);
}

/* Info Card */
.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  transition: all 0.2s ease;
}

.info-card:hover {
  background: #f0f2f5;
}

.info-icon {
  width: 36px;
  height: 36px;
  background: #e8ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.1rem;
  color: #00BB31;
}

.info-content {
  flex: 1;
}

.info-content h4 {
  margin: 0 0 0.75rem 0;
  color: #1A2B4C;
  font-size: 0.9rem;
  font-weight: 600;
}

.info-content ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.info-content li {
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-content li i {
  font-size: 0.4rem;
  color: #00BB31;
}

.info-content li:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .alert-container {
    padding: 0 1rem;
  }

  .form-card {
    padding: 1.25rem;
  }

  .alert-header {
    flex-direction: column;
    text-align: center;
  }

  .title-text h2 {
    font-size: 1.25rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .type-buttons {
    flex-direction: column;
  }

  .type-button {
    width: 100%;
  }

  .info-card {
    flex-direction: column;
    text-align: center;
  }

  .info-content ul li {
    justify-content: center;
  }
}
</style>