export default [
  // no layout wrapped
  {
    path: '/login',
    exact: true,
    redirect: '/user/login',
  },
  {
    path: '/signup',
    exact: true,
    redirect: '/user/signup',
  },
  {
    path: '/user',
    routes: [
      {
        path: '/user/login',
        exact: true,
        component: './user/Login',
      },
      {
        path: '/user/signup',
        exact: true,
        component: './user/SignUp',
      },
      {
        // component: './user/Login',
        redirect: '/user/login',
      },
    ],
  },
  // has layout wrapped
  {
    path: '/',
    component: '@/layouts/index',
    // the value redirected to is relative URL, not the relative PATH of components
    // redirect: '/home',
    routes: [
      {
        path: '/',
        exact: true,
        redirect: '/home',
      },
      {
        path: '/home',
        exact: true,
        component: './Home',
      },
      {
        path: '/timetable',
        exact: true,
        component: './MyTimetable',
      },
      {
        path: '/newmeeting',
        exact: true,
        component: './NewMeeting',
      },
      {
        path: '/settings',
        routes: [
          {
            path: '/settings/site',
            exact: true,
            component: './settings/SiteSettings',
          },
          // {
          //   path: '/settings/account',
          //   exact: true,
          //   component: './settings/AccountSettings',
          // },
          // {
          //   redirect: '/home',
          // },
        ],
      },
      {
        path: '/account',
        routes: [
          {
            path: '/account/center',
            component: './Account/Center',
          },
          {
            path: '/account/settings',
            component: './Account/Setting',
          },
          {
            component: '@/components/Exceptions/404',
          },
        ],
      },
      {
        // All illegal routes goes here
        component: '@/components/Exceptions/404',
      },
    ],
  },
];
