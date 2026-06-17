export class Device {
    id;
    field_id;
    mac_address;
    status;
    last_sync;

    constructor({ id = null, field_id = '', mac_address = '', status = '', last_sync = '' }) {
        this.id = id;
        this.field_id = field_id;
        this.mac_address = mac_address;
        this.status = status;
        this.last_sync = last_sync;
    }
}