import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ProfileManagementApi } from '../infrastructure/profile-management-api.js';
import { ProfileAssembler } from '../infrastructure/profile.assembler.js';

/**
 * API service instance for profile management.
 * @type {ProfileManagementApi}
 */
const api = new ProfileManagementApi();

/**
 * Reactive store that exposes Profile Management commands and queries.
 *
 * @returns {Object} Store state, computed properties, and actions.
 */
export const useProfileManagementStore = defineStore('profileManagement', () => {
    /**
     * List of profile entities.
     * @type {import('vue').Ref<Array>}
     */
    const profiles = ref([]);

    /**
     * Whether profiles have been successfully loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const profilesLoaded = ref(false);

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Number of loaded profiles.
     * @type {import('vue').ComputedRef<number>}
     */
    const profilesCount = computed(() => {
        return profilesLoaded.value ? profiles.value.length : 0;
    });

    /**
     * Loads profiles from infrastructure and updates the application state.
     * @returns {Promise<void>}
     */
    function fetchProfiles() {
        api.getProfile().then(response => {
            profiles.value = ProfileAssembler.toEntitiesFromResponse(response);
            profilesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            profilesLoaded.value = true;
        });
    }

    /**
     * Finds a profile entity by identifier.
     * @param {number|string} id - Profile identifier.
     * @returns {Profile|undefined} Matching profile, if available.
     */
    function getProfileById(id) {
        return profiles.value.find(p => p.id === id);
    }

    /**
     * Creates a profile through infrastructure and appends it to the local state.
     * @param {Object} profile - Profile data to persist.
     */
    function addProfile(profile) {
        const payload = {
            id: `prof_00${profiles.value.length + 1}`,
            user_id: 'usr_001',
            fundo_name: profile.fundo_name,
            contact_phone: profile.contact_phone,
            moisture_threshold: profile.moisture_threshold,
            temp_threshold: profile.temp_threshold
        };


        return api.createProfile(payload).then(response => {
            const resource = response.data;
            const newProfile = ProfileAssembler.toEntityFromResource(resource);
            profiles.value.push(newProfile);
            return true;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    /**
     * Updates an existing profile and synchronizes local state.
     * @param {Object} profile - Profile entity with updated data.
     */
    function updateProfile(profile) {

        return api.updateProfile(profile.id, profile)
            .then(response => {
                const resource = response.data;
                const updatedProfile = ProfileAssembler.toEntityFromResource(resource);
                const index = profiles.value.findIndex(p => p.id === updatedProfile.id);

                if (index !== -1) {
                    profiles.value[index] = updatedProfile;
                }
                return true;
            })
            .catch(error => {
                errors.value.push(error);
                return false;
            });
    }

    /**
     * Deletes a profile and removes it from the local state.
     * @param {Object} profile - Profile entity to remove.
     */
    function deleteProfile(profile) {
        return api.deleteProfile(profile.id).then(() => {
            const index = profiles.value.findIndex(p => p.id === profile.id);
            if (index !== -1) {
                profiles.value.splice(index, 1);
            }
            return true;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    return {
        profiles,
        profilesLoaded,
        errors,
        profilesCount,
        fetchProfiles,
        getProfileById,
        addProfile,
        updateProfile,
        deleteProfile
    };
});