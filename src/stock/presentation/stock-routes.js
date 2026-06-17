const inventoryForm = () => import('./views/inventory-form.vue');

const stockRoutes = [
    {   path: 'inventory',   name: 'stock-inventory',   component: inventoryForm, meta: {title: 'Inventory'}},
];

export default stockRoutes;