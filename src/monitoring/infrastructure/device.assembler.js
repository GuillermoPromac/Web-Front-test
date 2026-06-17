import {Device} from "../domain/model/device.entity.js";

/**
 * Assembler for converting API resources into Device entities.
 *
 * This design pattern (Assembler) handles the transformation of data coming
 * from the API into domain objects (Device), decoupling the infrastructure
 * layer from the domain layer.
 *
 * @class DeviceAssembler
 * @example
 * // Convert an individual resource
 * const deviceData = { id: 'dev_001', mac_address: 'AA:BB:CC:00:11:22', ... };
 * const device = DeviceAssembler.toEntityFromResource(deviceData);
 *
 * // Convert an API response
 * const response = await fetch('/api/devices');
 * const devices = DeviceAssembler.toEntitiesFromResponse(response);
 */
export class DeviceAssembler {

    /**
     * Converts a resource (plain object) into a Device entity.
     *
     * @static
     * @param {Object} resource - Object with device data
     * @param {string} resource.id - Device identifier
     * @param {string} resource.mac_address - MAC address
     * @param {string} resource.status - Device status
     * @param {string} resource.last_sync - Last synchronization timestamp
     *
     * @returns {Device} Device instance with resource data
     *
     * @example
     * const device = DeviceAssembler.toEntityFromResource({
     *   id: 'dev_001',
     *   mac_address: 'AA:BB:CC:00:11:22',
     *   status: 'ONLINE',
     *   last_sync: '2026-05-13T10:00:00Z'
     * });
     */
    static toEntityFromResource(resource) {
        return new Device({...resource});
    }

    /**
     * Converts an API response into an array of Device entities.
     *
     * This method validates that the response has a 200 status code,
     * extracts data in array format or from the 'device' field, and converts
     * each resource into a Device entity.
     *
     * @static
     * @param {import('axios').AxiosResponse} response - API response
     * @param {number} response.status - HTTP status code
     * @param {Array|Object} response.data - Response data
     *
     * @returns {Device[]} Array of Device entities. Returns empty array if response is invalid.
     *
     * @example
     * const response = {
     *   status: 200,
     *   data: [
     *     { id: 'dev_001', mac_address: 'AA:BB:CC:00:11:22', ... },
     *     { id: 'dev_002', mac_address: 'BB:CC:DD:11:22:33', ... }
     *   ]
     * };
     * const devices = DeviceAssembler.toEntitiesFromResponse(response);
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = response.data instanceof Array ? response.data
            : response.data['device'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}