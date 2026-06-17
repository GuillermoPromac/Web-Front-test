<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useProfileManagementStore } from "../../application/profile-management.store.js";
import { onMounted, toRefs } from "vue";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useProfileManagementStore();

const { profiles, errors, profilesLoaded } = toRefs(store);
const { fetchProfiles, deleteProfile } = store;

onMounted(() => {
  if (!store.profilesLoaded) {
    fetchProfiles();
    profilesLoaded.value = store.profilesLoaded;
  }
});

/**
 * Navigate to the new profile creation page.
 */
const navigateToNew = () => {
  router.push({ name: "profile-new" });
};

/**
 * Navigate to the profile editing page.
 * @param {string} id - The ID of the profile to edit.
 */
const navigateToEdit = (id) => {
  router.push({ name: "profile-edit", params: { id } });
};

/**
 * Confirm deletion of a profile and execute deletion if confirmed.
 * @param {Object} profile - The profile object to delete.
 */
const confirmDelete = (profile) => {
  confirm.require({
    message: t("profiles.confirm-delete", { name: profile.fundo_name }),
    header: t("profiles.delete-header"),
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      store.deleteProfile(profile);
    },
  });
};
</script>

<template>
  <div class="list-container">
    <h1>{{ t("profiles.title") }}</h1>

    <div class="button-container">
      <pv-button
          :label="t('profiles.new')"
          class="add-button"
          icon="pi pi-plus"
          @click="navigateToNew"
      />
    </div>

    <pv-data-table
        :loading="!profilesLoaded"
        :rows="5"
        :value="profiles"
        paginator
        class="profiles-table"
    >
      <pv-column :header="t('profiles.id')" field="id" sortable />

      <pv-column :header="t('profiles.fundoName')" field="fundo_name" sortable />
      <pv-column :header="t('profiles.contactPhone')" field="contact_phone" sortable />
      <pv-column
          :header="t('profiles.moistureThreshold')"
          field="moisture_threshold"
          sortable
      />
      <pv-column
          :header="t('profiles.tempThreshold')"
          field="temp_threshold"
          sortable
      />

      <pv-column :header="t('profiles.actions')">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-pencil"
              rounded
              text
              @click="navigateToEdit(slotProps.data.id)"
          />
          <pv-button
              icon="pi pi-trash"
              rounded
              severity="danger"
              text
              @click="confirmDelete(slotProps.data)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>
.list-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

/* Contenedor que mantiene el espacio reservado */
.button-container {
  display: inline-block;
  width: fit-content;
  min-height: 42px;
  margin-bottom: 0.5rem;
}

.add-button {
  background-color: #4fd1c5;
  border: none;
  transition: background-color 0.2s ease;
  /* Fijar dimensiones constantes */
  min-width: 120px;
  height: 42px;
  padding: 0.75rem 1.25rem;
}

/* Mantener las mismas dimensiones en hover */
.add-button:hover {
  background-color: #38b2ac;
}

/* Forzar que no haya cambios de padding, margin, border o box-shadow */
.add-button:hover,
.add-button:focus,
.add-button:active {
  padding: 0.75rem 1.25rem !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
  transform: none !important;
  outline: none !important;
}

/* Prevenir cambios en el ícono y texto */
.add-button :deep(.p-button-label),
.add-button :deep(.p-icon),
.add-button :deep(.pi) {
  transition: none !important;
  transform: none !important;
}

.profiles-table {
  min-width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  /* Fijar la tabla para que no se mueva */
  position: relative;
  top: 0;
  margin-top: 0;
  transition: none;
}

/* Asegurar que la tabla nunca cambie su posición */
.profiles-table :deep(.p-datatable-wrapper) {
  transition: none !important;
  transform: none !important;
}

/* Forzar que los botones de acciones no afecten el layout */
.profiles-table :deep(.p-button) {
  transition: none !important;
  box-shadow: none !important;
  transform: none !important;
}

.profiles-table :deep(.p-button:hover) {
  transform: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

/* Prevenir cualquier reflow en las filas */
.profiles-table :deep(.p-datatable-tbody > tr) {
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: none;
}

@media (max-width: 768px) {
  .list-container {
    padding: 1rem;
  }

  .profiles-table {
    font-size: 0.875rem;
  }

  .add-button {
    min-width: 100px;
    height: 38px;
    padding: 0.5rem 1rem;
  }

  .add-button:hover {
    padding: 0.5rem 1rem !important;
  }
}
</style>