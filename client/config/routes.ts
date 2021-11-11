export default [
  {
    path: '/',
    // the value redirected to is relative URL, not the relative path of components
    redirect: '/home',
  },
  {
    path: '/home',
    // go to 'index' component
    component: './index',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'Login',
        component: './user/Login',
      },
      {
        path: '/user/register',
        layout: false,
        name: 'Register',
        component: './user/Register',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        component: '@/components/Exceptions/500',
      },
    ],
  },
  {
    path: '/404',
    component: '@/components/Exceptions/500',
  },
];
