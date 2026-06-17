<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useCommunityManagementStore } from "../../application/community-management.store.js";
import { onMounted, toRefs, ref, computed } from "vue";
import InputText from 'primevue/inputtext';

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useCommunityManagementStore();

const { profiles, profilesLoaded } = toRefs(store);
const { fetchProfiles, deleteProfile } = store;

const searchQuery = ref('');

/**
 * Computed property that filters profiles based on the search query.
 * Represents the "Buscar usuario" command.
 */
const filteredProfiles = computed(() => {
  if (!searchQuery.value) return profiles.value;
  return profiles.value.filter(p =>
      p.nickname.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  if (!store.profilesLoaded) {
    fetchProfiles();
  }
});

const navigateToNew = () => router.push({ name: 'community-profile-new' });
const navigateToEdit = (id) => router.push({ name: 'community-profile-edit', params: { id } });
const navigateToMural = (id) => router.push({ name: 'community-profile-mural', params: { id } });

const confirmDelete = (profile) => {
  confirm.require({
    message: t('community.profiles.confirm-delete', { name: profile.nickname }),
    header: t('community.profiles.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => store.deleteProfile(profile),
  });
};
</script>

<template>
  <div class="list-container">
    <h1>{{ t('community.profiles.title') }}</h1>

    <div class="toolbar">
      <div class="button-container">
        <pv-button
            :label="t('community.profiles.new')"
            class="add-button"
            icon="pi pi-plus"
            @click="navigateToNew"
        />
      </div>

      <div class="search-container">
        <i class="pi pi-search search-icon"></i>
        <InputText
            v-model="searchQuery"
            :placeholder="t('community.profiles.search')"
            class="search-input"
        />
      </div>
    </div>

    <div v-if="searchQuery && filteredProfiles.length === 0" class="not-found-message">
      <i class="pi pi-info-circle"></i> No se encontraron usuarios con ese nickname.
    </div>

    <pv-data-table v-else :loading="!profilesLoaded" :rows="5" :value="filteredProfiles" paginator class="profiles-table">
      <pv-column :header="t('community.profiles.nickname')" field="nickname" sortable/>
      <pv-column :header="t('community.profiles.reputationScore')" field="reputation_score" sortable/>

      <pv-column :header="t('community.profiles.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-user" rounded severity="info" text @click="navigateToMural(slotProps.data.id)" v-tooltip="'Ver Mural'"/>
          <pv-button icon="pi pi-pencil" rounded text @click="navigateToEdit(slotProps.data.id)"/>
          <pv-button icon="pi pi-trash" rounded severity="danger" text @click="confirmDelete(slotProps.data)"/>
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Contenedor que mantiene el espacio reservado y evita cambios de layout */
.button-container {
  display: inline-block;
  width: fit-content;
  min-height: 42px;
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

/* Mantener las mismas dimensiones en hover y eliminar efectos */
.add-button:hover {
  background-color: #38b2ac;
}

/* Forzar que no haya cambios de padding, margin, border, box-shadow o transform */
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

/* Eliminar el efecto ripple que causa cambios de tamaño */
.add-button :deep(.p-ink) {
  display: none !important;
}

/* Prevenir cambios en el ícono y texto */
.add-button :deep(.p-button-label),
.add-button :deep(.p-icon),
.add-button :deep(.pi) {
  transition: none !important;
  transform: none !important;
}

/* Prevenir cualquier efecto de escala o transformación */
.add-button :deep(.p-button-icon),
.add-button :deep(.p-button-label) {
  transform: none !important;
}

/* Contenedor de búsqueda personalizado */
.search-container {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem !important;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4fd1c5;
  box-shadow: 0 0 0 2px rgba(79, 209, 197, 0.2);
}

.search-input:hover {
  border-color: #94a3b8;
}

.not-found-message {
  padding: 1rem;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 4px;
  text-align: center;
}

.profiles-table {
  min-width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

/* Forzar que los botones de acciones no afecten el layout y eliminar doble hover */
.profiles-table :deep(.p-button) {
  transition: none !important;
  box-shadow: none !important;
  transform: none !important;
}

.profiles-table :deep(.p-button:hover) {
  transform: none !important;
  box-shadow: none !important;
}

/* Eliminar el ripple de los botones de la tabla */
.profiles-table :deep(.p-ink) {
  display: none !important;
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

  .toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
  }

  .button-container {
    align-self: flex-start;
  }
}
</style>