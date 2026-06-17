<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue';
import { storeToRefs } from 'pinia';
import useNotificationStore from '../../application/notification-management.store.js';
import { onMounted } from 'vue';

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useNotificationStore();
const { notifications, loading, errors, notificationsLoaded, unreadCount } = storeToRefs(store);
const { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = store;

onMounted(() => {
  if (!notificationsLoaded.value) {
    fetchNotifications();
  }
});

const navigateToAlert = () => {
  router.push({ name: 'notifications-alert' });
};

const handleMarkAsRead = async (notification) => {
  if (!notification.is_read) {
    await markAsRead(notification.id);
  }
};

const handleMarkAllAsRead = async () => {
  confirm.require({
    message: t('notifications.confirm-mark-all-read'),
    header: t('notifications.mark-all-read-title'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await markAllAsRead('prof_001');
    }
  });
};

const handleDelete = (notification) => {
  confirm.require({
    message: t('notifications.confirm-delete'),
    header: t('notifications.delete-title'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteNotification(notification);
    }
  });
};

const getSeverityByType = (isAlert) => {
  return isAlert ? 'danger' : 'info';
};

const getTranslatedType = (isAlert) => {
  return isAlert ? t('notifications.alert-type-critical') : t('notifications.alert-type-info');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<template>
  <div class="notification-list-container">
    <div class="list-header">
      <div class="header-left">
        <h2 class="title">{{ t('notifications.title') }}</h2>
        <pv-tag
            v-if="unreadCount > 0"
            :value="unreadCount + ' ' + t('notifications.unread')"
            severity="danger"
        />
      </div>
      <div class="header-actions">
        <pv-button
            icon="pi pi-bell"
            :label="t('notifications.send-alert')"
            severity="info"
            style="min-width: 130px; white-space: nowrap;"
            @click="navigateToAlert"
        />
        <pv-button
            icon="pi pi-envelope"
            :label="t('notifications.mark-all-read')"
            severity="secondary"
            :disabled="unreadCount === 0"
            style="min-width: 160px; white-space: nowrap;"
            @click="handleMarkAllAsRead"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !notificationsLoaded" class="loading-state">
      <pv-progress-spinner />
      <p>{{ t('notifications.loading') }}</p>
    </div>

    <!-- Data Table -->
    <div v-else-if="notificationsLoaded && notifications.length > 0" class="table-wrapper">
      <pv-data-table
          :value="notifications"
          responsive-layout="scroll"
          paginator
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
          striped-rows
          show-grid-lines
          class="notification-table"
          table-style="min-width: 1000px"
      >
        <pv-column field="is_alert" :header="t('notifications.type')" style="width: 120px">
          <template #body="{ data }">
            <pv-tag
                :value="getTranslatedType(data.is_alert)"
                :severity="getSeverityByType(data.is_alert)"
            />
          </template>
        </pv-column>

        <pv-column field="title" :header="t('notifications.title')" style="width: 200px" sortable>
          <template #body="{ data }">
            <div class="title-cell">{{ data.title }}</div>
          </template>
        </pv-column>

        <pv-column field="message" :header="t('notifications.message')" style="width: 300px">
          <template #body="{ data }">
            <div :class="{ 'unread-message': !data.is_read }" class="message-cell">
              {{ data.message }}
            </div>
          </template>
        </pv-column>

        <pv-column field="created_at" :header="t('notifications.created-at')" style="width: 180px" sortable>
          <template #body="{ data }">
            <div class="date-cell">{{ formatDate(data.created_at) }}</div>
          </template>
        </pv-column>

        <pv-column field="is_read" :header="t('notifications.status')" style="width: 110px" sortable>
          <template #body="{ data }">
            <pv-tag
                :value="data.is_read ? t('notifications.read') : t('notifications.unread')"
                :severity="data.is_read ? 'success' : 'danger'"
            />
          </template>
        </pv-column>

        <pv-column :header="t('notifications.actions')" style="width: 90px">
          <template #body="{ data }">
            <div class="action-buttons">
              <div class="check-button-wrapper">
                <pv-button
                    v-if="!data.is_read"
                    icon="pi pi-check"
                    rounded
                    text
                    severity="success"
                    :title="t('notifications.mark-read')"
                    @click="handleMarkAsRead(data)"
                />
              </div>
              <div class="delete-button-wrapper">
                <pv-button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    :title="t('notifications.delete')"
                    @click="handleDelete(data)"
                />
              </div>
            </div>
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <!-- Empty State -->
    <div v-else-if="notificationsLoaded && notifications.length === 0" class="empty-state">
      <i class="pi pi-bell-slash" style="font-size: 3rem; color: #cbd5e1;"></i>
      <p>{{ t('notifications.no-notifications') }}</p>
    </div>

    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="error-container">
      <div v-for="(error, index) in errors" :key="index" class="error-message">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.title {
  margin: 0;
  color: #1A2B4C;
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.notification-table {
  width: 100%;
}

/* Estilos para mejorar la visibilidad de las filas */
.notification-table :deep(.p-datatable-thead > tr > th) {
  background-color: #1A2B4C !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 1rem !important;
  border-bottom: 2px solid #00BB31 !important;
}

.notification-table :deep(.p-datatable-tbody > tr) {
  transition: background-color 0.2s ease;
}

.notification-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.875rem 1rem !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

.notification-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background-color: #ffffff !important;
}

.notification-table :deep(.p-datatable-tbody > tr:nth-child(odd)) {
  background-color: #f8f9fa !important;
}

.notification-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #e8f5e9 !important;
  cursor: pointer;
}

.notification-table :deep(.p-datatable-tbody > tr:hover > td) {
  background-color: transparent !important;
}

/* Estilos para celdas */
.title-cell {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  color: #1A2B4C;
  font-weight: 500;
}

.message-cell {
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  color: #4a5568;
}

.unread-message {
  font-weight: 600;
  color: #1A2B4C;
}

.date-cell {
  white-space: nowrap;
  font-size: 0.85rem;
  color: #718096;
}

/* ACCIONES: botones en posición fija (check a la izquierda, delete a la derecha) */
.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.check-button-wrapper {
  flex: 0 0 32px;
  display: flex;
  justify-content: flex-start;
}

.delete-button-wrapper {
  flex: 0 0 32px;
  display: flex;
  justify-content: flex-end;
}

/* Estilos para botones de acción */
.action-buttons .p-button {
  width: 32px;
  height: 32px;
  display: inline-flex;
  flex-shrink: 0;
}

.action-buttons .p-button-success {
  color: #00BB31 !important;
}

.action-buttons .p-button-success:hover {
  background-color: rgba(0, 187, 49, 0.1) !important;
}

.action-buttons .p-button-danger {
  color: #FF4757 !important;
}

.action-buttons .p-button-danger:hover {
  background-color: rgba(255, 71, 87, 0.1) !important;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #1A2B4C;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6c757d;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.error-container {
  margin-top: 1rem;
}

.error-message {
  padding: 1rem;
  background-color: #ffe0e0;
  color: #FF4757;
  border-radius: 4px;
  border-left: 4px solid #FF4757;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions .p-button {
    width: 100% !important;
    justify-content: center;
  }

  .title {
    font-size: 1.25rem;
    white-space: normal;
  }

  .notification-table :deep(.p-datatable-thead > tr > th),
  .notification-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem !important;
  }
}
</style>