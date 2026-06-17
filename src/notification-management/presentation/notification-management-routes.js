const notificationList = () => import('./views/notification-list.vue');
const notificationAlert = () => import('./views/notification-alert.vue');

const notificationRoutes = [
    {
        path: '',
        name: 'notifications-list',
        component: notificationList,
        meta: { title: 'Notifications' }
    },
    {
        path: 'alert',
        name: 'notifications-alert',
        component: notificationAlert,
        meta: { title: 'Send Alert' }
    }
];

export default notificationRoutes;