import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AnalyticsManagementApi } from "../infrastructure/analytics-management-api.js";
import { ReportAssembler } from "../infrastructure/report.assembler.js";

const analyticsApi = new AnalyticsManagementApi();

/**
 * Analytics Management Store - Centralized state management for analytics module.
 *
 * @module stores/analytics
 * @returns {Object} Store instance with state and actions
 */
const useAnalyticsStore = defineStore('analytics', () => {
    const reportsList = ref([]);
    const errors = ref([]);
    const reportsLoaded = ref(false);
    const loading = ref(false);

    const reportsCount = computed(() => {
        return reportsLoaded.value ? reportsList.value.length : 0;
    });

    /**
     * Fetches all analytical reports from the API.
     */
    async function fetchReports() {
        loading.value = true;
        try {
            const response = await analyticsApi.getReports();
            if (response && response.data) {
                reportsList.value = ReportAssembler.toEntitiesFromResponse(response);
            }
            reportsLoaded.value = true;
        } catch (error) {
            console.error('Error fetching reports:', error);
            errors.value.push(error);
            reportsLoaded.value = true;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Gets a report by its ID
     * @param {string|number} id - Report identifier
     * @returns {Report|undefined}
     */
    function getReportById(id) {
        return reportsList.value.find(report => String(report.id) === String(id));
    }

    return {
        reportsList,
        errors,
        reportsLoaded,
        loading,
        reportsCount,
        fetchReports,
        getReportById
    };
});

export { useAnalyticsStore };