// https://umijs.org/zh-CN/docs/routing#wrappers

const wrappers = ['@/wrappers/auth'];
export default [
  {
    path: '/',
    exact: true,
    // the value redirected to is relative URL, not the relative PATH of components
    redirect: '/home',
  },
  {
    path: '/home',
    exact: true,
    component: './Home',
    wrappers,
  },
  {
    path: '/timetable',
    exact: true,
    component: './Timetable',
    wrappers,
  },
  {
    path: '/newmeeting',
    exact: true,
    component: './NewMeeting',
    wrappers,
  },
  {
    path: '/settings/site',
    exact: true,
    component: './SiteSettings',
    wrappers,
  },
  {
    path: '/user',
    exact: false,
    // layout: false,
    routes: [
      {
        path: '/user/login',
        // layout: false,
        // name: 'Login',
        component: './user/Login',
      },
      {
        path: '/user/signup',
        // layout: false,
        // name: 'Sign Up',
        component: './user/SignUp',
      },
      {
        component: './user/Login',
      },
    ],
  },
  {
    // All illegal routes goes here
    component: '@/components/Exceptions/404',
    // the wrappers here mean that, a user that has not logged in need to log in to see the 404 page, otherwise, it jumps to login page.
    // on the other hand, the 404 page is wrapped with the Main Layout if a user logged in.
    wrappers,
  },
];
