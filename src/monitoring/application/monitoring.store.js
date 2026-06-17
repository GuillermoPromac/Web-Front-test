import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {DeviceAssembler} from "../infrastructure/device.assembler.js";
import {FieldAssembler} from "../infrastructure/field.assembler.js";
import {Device} from "../domain/model/device.entity.js";
import {Field} from "../domain/model/field.entity.js";

const monitoringApi = new MonitoringApi();

/**
 * Monitoring Store - Centralized state management for monitoring module.
 *
 * This Pinia store manages the state for devices and fields (agricultural zones)
 * in the monitoring system. It handles CRUD operations, fetching data from the API,
 * and maintaining reactive state for Vue components.
 *
 * @module stores/monitoring
 * @returns {Object} Store instance with state and actions
 *
 * @example
 * import { useMonitoringStore } from '@/monitoring/application/monitoring.store.js';
 *
 * const store = useMonitoringStore();
 * store.fetchDevices();
 * console.log(store.devices); // Array of Device entities
 */
const useMonitoringStore = defineStore('monitoring', () => {

    /**
     * Array of Device entities currently loaded.
     * @type {import('vue').Ref<Device[]>}
     */
    const devices = ref([]);

    /**
     * Array of Field entities currently loaded.
     * @type {import('vue').Ref<Field[]>}
     */
    const fields = ref([]);

    /**
     * Array of error objects encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Flag indicating whether devices have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const devicesLoaded = ref(false);

    /**
     * Flag indicating whether fields have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const fieldsLoaded = ref(false);

    /**
     * Computed property that returns the count of loaded devices.
     * @type {import('vue').ComputedRef<number>}
     */
    const devicesCount = computed(() => {
        return devicesLoaded ? devices.value.length : 0;
    });

    /**
     * Computed property that returns the count of loaded fields.
     * @type {import('vue').ComputedRef<number>}
     */
    const fieldsCount = computed(() => {
        return fieldsLoaded ? fields.value.length : 0;
    });

    /**
     * Fetches all devices from the API and updates the store state.
     *
     * @async
     * @function fetchDevices
     * @returns {void}
     *
     * @example
     * await store.fetchDevices();
     * console.log(store.devices); // Array of devices loaded from API
     */
    function fetchDevices() {
        monitoringApi.getDevices().then(response => {
            devices.value = DeviceAssembler.toEntitiesFromResponse(response);
            devicesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Fetches all fields from the API and updates the store state.
     *
     * @async
     * @function fetchFields
     * @returns {void}
     *
     * @example
     * await store.fetchFields();
     * console.log(store.fields); // Array of fields loaded from API
     */
    function fetchFields() {
        monitoringApi.getFields().then(response => {
            fields.value = FieldAssembler.toEntitiesFromResponse(response);
            fieldsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Retrieves a device by its ID from the loaded devices.
     *
     * @function getDeviceById
     * @param {string|number} id - The device identifier
     *
     * @returns {Device|undefined} The device entity if found, undefined otherwise
     *
     * @example
     * const device = store.getDeviceById('dev_001');
     * if (device) {
     *   console.log(device.mac_address);
     * }
     */
    function getDeviceById(id) {
        return devices.value.find(device => String(device.id) === String(id));
    }

    /**
     * Generates a unique ID for a new item with a given prefix.
     *
     * This internal helper function creates sequential IDs by finding the highest
     * numeric suffix in existing items and incrementing it.
     *
     * @private
     * @function __generateId
     * @param {import('vue').Ref<Object[]>} collection - Reference to array of items
     * @param {string} prefix - Prefix for the generated ID (e.g., 'dev_', 'field_')
     *
     * @returns {string} Generated ID with format: prefix + zero-padded number
     *
     * @example
     * const id = __generateId(devices, 'dev_');
     * // Returns 'dev_001', 'dev_002', etc.
     */
    function __generateId(collection, prefix) {
        const existingIds = collection.value.map(item => item.id).filter(id => typeof id === 'string' && id.startsWith(prefix));
        let maxNum = 0;
        existingIds.forEach(id => {
            const num = parseInt(id.replace(prefix, ''), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        });
        return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
    }

    /**
     * Creates a new device and adds it to the store.
     *
     * If the device doesn't have an ID, one will be generated automatically.
     * The device is persisted to the API and added to the store state.
     *
     * @async
     * @function addDevice
     * @param {Device|Object} device - Device object to create
     * @param {string} [device.id] - Optional device ID. If not provided, one will be generated
     * @param {string} device.mac_address - MAC address of the device
     * @param {string} device.status - Device status (ONLINE, OFFLINE, LOW_BATTERY)
     * @param {string} device.last_sync - Last synchronization timestamp
     *
     * @returns {void}
     *
     * @example
     * store.addDevice({
     *   mac_address: 'AA:BB:CC:00:11:22',
     *   status: 'ONLINE',
     *   last_sync: new Date().toISOString()
     * });
     */
    function addDevice(device) {
        if (!device.id || String(device.id).trim() === '') {
            device.id = __generateId(devices, 'dev_');
        }
        monitoringApi.createDevice(device).then(response => {
            const resource = response.data;
            const newDevice = DeviceAssembler.toEntityFromResource(resource);
            devices.value.push(newDevice);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing device in the store.
     *
     * The device is updated in the API and the local store state is synchronized.
     *
     * @async
     * @function updateDevice
     * @param {Device|Object} device - Updated device object
     * @param {string} device.id - Device identifier
     * @param {string} device.mac_address - MAC address
     * @param {string} device.status - Device status
     * @param {string} device.last_sync - Last synchronization timestamp
     *
     * @returns {void}
     *
     * @throws {Error} If device update fails on the API
     *
     * @example
     * store.updateDevice({
     *   id: 'dev_001',
     *   mac_address: 'AA:BB:CC:00:11:22',
     *   status: 'OFFLINE',
     *   last_sync: new Date().toISOString()
     * });
     */
    function updateDevice(device) {
        monitoringApi.updateDevice(device).then(response => {
            const resource = response.data;
            const updatedDevice = DeviceAssembler.toEntityFromResource(resource);
            const index = devices.value.findIndex(c => String(c["id"]) === String(updatedDevice.id));
            if (index !== -1) devices.value[index] = updatedDevice;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a device from the store.
     *
     * The device is deleted from the API and removed from the local store state.
     *
     * @async
     * @function deleteDevice
     * @param {Device|Object} device - Device object to delete
     * @param {string} device.id - Device identifier
     *
     * @returns {void}
     *
     * @throws {Error} If device deletion fails on the API
     *
     * @example
     * store.deleteDevice({ id: 'dev_001' });
     */
    function deleteDevice(device) {
        monitoringApi.deleteDevice(device.id).then(() => {
            const index = devices.value.findIndex(c => String(c["id"]) === String(device.id));
            if (index !== -1) devices.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Retrieves a field by its ID from the loaded fields.
     *
     * @function getFieldById
     * @param {string|number} id - The field identifier
     *
     * @returns {Field|undefined} The field entity if found, undefined otherwise
     *
     * @example
     * const field = store.getFieldById('field_001');
     * if (field) {
     *   console.log(field.name);
     * }
     */
    function getFieldById(id) {
        return fields.value.find(field => String(field.id) === String(id));
    }

    /**
     * Creates a new field and adds it to the store.
     *
     * If the field doesn't have an ID, one will be generated automatically.
     * The field is persisted to the API and added to the store state.
     *
     * @async
     * @function addField
     * @param {Field|Object} field - Field object to create
     * @param {string} [field.id] - Optional field ID. If not provided, one will be generated
     * @param {string} field.name - Name of the field
     * @param {string} field.size_m2 - Size in square meters
     * @param {string} field.soil_type - Type of soil (loamy, sandy, clay, silty)
     * @param {string} field.location_lat_long - Geographic location in lat/long format
     *
     * @returns {void}
     *
     * @example
     * store.addField({
     *   name: 'Main Field',
     *   size_m2: '5000',
     *   soil_type: 'loamy',
     *   location_lat_long: '10.5°N, 20.3°W'
     * });
     */
    function addField(field) {
        if (!field.id || String(field.id).trim() === '') {
            field.id = __generateId(fields, 'field_');
        }
        monitoringApi.createField(field).then(response => {
            const resource = response.data;
            const newField = FieldAssembler.toEntityFromResource(resource);
            fields.value.push(newField);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing field in the store.
     *
     * The field is updated in the API and the local store state is synchronized.
     *
     * @async
     * @function updateField
     * @param {Field|Object} field - Updated field object
     * @param {string} field.id - Field identifier
     * @param {string} field.name - Name of the field
     * @param {string} field.size_m2 - Size in square meters
     * @param {string} field.soil_type - Type of soil
     * @param {string} field.location_lat_long - Geographic location
     *
     * @returns {void}
     *
     * @throws {Error} If field update fails on the API
     *
     * @example
     * store.updateField({
     *   id: 'field_001',
     *   name: 'Updated Field',
     *   size_m2: '6000',
     *   soil_type: 'sandy',
     *   location_lat_long: '10.5°N, 20.3°W'
     * });
     */
    function updateField(field) {
        monitoringApi.updateField(field).then(response => {
            const resource = response.data;
            const updatedField = FieldAssembler.toEntityFromResource(resource);
            const index = fields.value.findIndex(t => String(t["id"]) === String(updatedField.id));
            if (index !== -1) fields.value[index] = updatedField;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a field from the store.
     *
     * The field is deleted from the API and removed from the local store state.
     *
     * @async
     * @function deleteField
     * @param {Field|Object} field - Field object to delete
     * @param {string} field.id - Field identifier
     *
     * @returns {void}
     *
     * @throws {Error} If field deletion fails on the API
     *
     * @example
     * store.deleteField({ id: 'field_001' });
     */
    function deleteField(field) {
        monitoringApi.deleteField(field.id).then(() => {
            const index = fields.value.findIndex(t => String(t["id"]) === String(field.id));
            if (index !== -1) fields.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        devices,
        fields,
        errors,
        devicesLoaded,
        fieldsLoaded,
        devicesCount,
        fieldsCount,
        fetchDevices,
        fetchFields,
        getDeviceById,
        addDevice,
        updateDevice,
        deleteDevice,
        addField,
        updateField,
        deleteField,
        getFieldById
    }
});

export { useMonitoringStore };
