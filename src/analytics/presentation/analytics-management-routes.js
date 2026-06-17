import ReportList from './views/report-list.vue';

export const analyticsRoutes = [
    {
        path: 'dashboard',
        name: 'dashboard-analytics',
        component: ReportList,
        meta: { title: 'Analytics Dashboard' }
    }
];