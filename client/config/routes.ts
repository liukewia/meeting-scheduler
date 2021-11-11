// https://umijs.org/docs/convention-routing#custom-global-layout

export default [
  {
    path: '/',
    // the value redirected to is relative URL, not the relative PATH of components
    redirect: '/home',
  },
  {
    path: '/home',
    component: '@/pages/Home/index',
  },
  {
    path: '/settings',
    component: '@/pages/Settings/index',
  },
  {
    path: '/user',
    // layout: false,
    routes: [
      {
        path: '/user/login',
        // layout: false,
        // name: 'Login',
        component: '@/pages/user/Login/index',
      },
      {
        path: '/user/signup',
        // layout: false,
        // name: 'Sign Up',
        component: '@/pages/user/SignUp/index',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        component: '@/components/Exceptions/404',
      },
    ],
  },
  {
    path: '/404',
    component: '@/components/Exceptions/404',
  },
];
