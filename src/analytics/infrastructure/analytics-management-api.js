import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const reportsEndpointPath = import.meta.env.VITE_REPORTS_ENDPOINT_PATH;

/**
 * API client for the analytics management module.
 *
 * @class AnalyticsManagementApi
 * @extends BaseApi
 */
export class AnalyticsManagementApi extends BaseApi {
    #reportsEndpoint;

    /**
     * Creates a new instance of AnalyticsManagementApi.
     */
    constructor() {
        super();
        this.#reportsEndpoint = new BaseEndpoint(this, reportsEndpointPath);
    }

    /**
     * Retrieves all analytical reports.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getReports() {
        return this.#reportsEndpoint.getAll();
    }

    /**
     * Retrieves a report by its identifier.
     * @param {string|number} id - Report identifier
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getReportById(id) {
        return this.#reportsEndpoint.getById(id);
    }
}