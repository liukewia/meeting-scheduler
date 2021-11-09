export default [
  // routes at the front have higher priorities than the latter.
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Home',
    path: '/home',
    icon: 'home',
    component: './Home',
  },
  {
    icon: 'table',
    name: 'list',
    path: '/list',
    component: './TableList',
  },
  {
    icon: 'setting',
    name: 'Settings',
    routes: [
      {
        name: 'Personal Settings',
        path: '/settings/personal',
        // access: 'isLoggedIn',
        component: './PersonalSetting',
      },
      {
        name: 'Site Settings',
        path: '/settings/site',
        // access: 'isLoggedIn',
        component: './SiteSetting',
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        icon: 'smile',
        component: './Home',
      },
      {
        component: './404',
      },
    ],
  },
  // if 'name' is not presented, it will not be added to header.
  { component: './404' },
];
