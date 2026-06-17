export class Inventory {
    constructor({ id, product_id, stock_quantity, warehouse_location }) {
        this.id = id;
        this.product_id = product_id;
        this.stock_quantity = stock_quantity;
        this.warehouse_location = warehouse_location;
    }
}