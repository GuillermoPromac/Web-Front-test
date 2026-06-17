const ProfileList = () => import('./views/profile-list.vue');
const ProfileForm = () => import('./views/profile-form.vue');

const profileRoutes =[
    {  path: '/settings',          name: 'profile-list', component: ProfileList },
    {  path: '/settings/new',      name: 'profile-new',  component: ProfileForm },
    {  path: '/settings/edit/:id', name: 'profile-edit', component: ProfileForm }
];

export default profileRoutes;