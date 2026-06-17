const CommunityProfileList = () => import('./views/community-profile-list.vue');
const CommunityProfileForm = () => import('./views/community-profile-form.vue');
const CommunityProfileMural = () => import('./views/community-profile-mural.vue');

const communityRoutes = [
    { path: '/community',          name: 'community-profile-list', component: CommunityProfileList },
    { path: '/community/new',      name: 'community-profile-new',  component: CommunityProfileForm },
    { path: '/community/edit/:id', name: 'community-profile-edit', component: CommunityProfileForm },
    { path: '/community/mural/:id',name: 'community-profile-mural',component: CommunityProfileMural }
];

export default communityRoutes;