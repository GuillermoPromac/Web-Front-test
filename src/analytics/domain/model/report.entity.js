/**
 * Represents an analytical report in the system.
 * @class Report
 */
export class Report {
    id;
    device_id;
    generated_at;
    mean_value;
    variance;
    standard_deviation;
    technical_interpretation;

    /**
     * @constructor
     * @param {Object} params
     */
    constructor({ id = null, device_id = '', generated_at = '', mean_value = 0, variance = 0, standard_deviation = 0, technical_interpretation = '' }) {
        this.id = id;
        this.device_id = device_id;
        this.generated_at = generated_at;
        this.mean_value = mean_value;
        this.variance = variance;
        this.standard_deviation = standard_deviation;
        this.technical_interpretation = technical_interpretation;
    }
}