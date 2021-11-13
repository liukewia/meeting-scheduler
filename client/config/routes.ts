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
      { exact: true, path: '/', redirect: '/home' },
      {
        path: '/home',
        exact: true,
        component: './Home',
      },
      {
        path: '/timetable',
        exact: true,
        component: './Timetable',
      },
      {
        path: '/newmeeting',
        exact: true,
        component: './NewMeeting',
      },
      {
        path: '/settings/site',
        exact: true,
        component: './SiteSettings',
      },
      {
        // All illegal routes goes here
        component: '@/components/Exceptions/404',
        // the wrappers here mean that, a user that has not logged in need to log in to see the 404 page, otherwise, it jumps to login page.
        // on the other hand, the 404 page is wrapped with the Main Layout if a user logged in.
      },
    ],
  },
];
