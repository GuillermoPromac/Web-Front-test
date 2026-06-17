import ProductList from "./views/product-list.vue";
import OrderList from "./views/order-list.vue";

export const commercialRoutes = [
    {
        path: 'catalog',
        name: 'commercial-catalog',
        component: ProductList,
        meta: { title: 'Product Catalog' }
    },
    {
        path: 'order-summary',
        name: 'order-summary',
        component: OrderList,
        meta: { title: 'Order Summary' }
    }
];