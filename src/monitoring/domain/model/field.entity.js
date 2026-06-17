/**
 * Represents an agricultural field in the monitoring system.
 *
 * This class encapsulates field data including its unique identifier,
 * name, size, soil type, and geographic location.
 *
 * @class Field
 * @example
 * const field = new Field({
 *   id: 'field_001',
 *   name: 'Main Field',
 *   size_m2: '5000',
 *   soil_type: 'loamy',
 *   location_lat_long: '10.5°N, 20.3°W'
 * });
 */
export class Field {
    /**
     * Unique field identifier.
     * @type {string|null}
     */
    id;

    profile_id;

    /**
     * Descriptive name of the field.
     * @type {string}
     */
    name;

    /**
     * Size of the field in square meters.
     * @type {string|number}
     */
    size_m2;

    /**
     * Type of soil in the field.
     * Possible values: 'loamy', 'sandy', 'clay', 'silty'
     * @type {string}
     */
    soil_type;

    /**
     * Geographic location of the field in latitude/longitude format.
     * Format: "10.5°N, 20.3°W"
     * @type {string}
     */
    location_lat_long;

    /**
     * Creates a new Field instance.
     *
     * @constructor
     * @param {Object} params - Field parameters
     * @param {string|null} [params.id=null] - Unique field identifier
     * @param {string} [params.name=''] - Field name
     * @param {string} [params.size_m2=''] - Size in square meters
     * @param {string} [params.soil_type=''] - Soil type
     * @param {string} [params.location_lat_long=''] - Geographic location
     */
    constructor({ id = null, profile_id = '', name = '', size_m2 = '', soil_type = '', location_lat_long = ''  }) {
        this.id = id;
        this.profile_id = profile_id;
        this.name = name;
        this.size_m2 = size_m2;
        this.soil_type = soil_type;
        this.location_lat_long = location_lat_long;
    }
}