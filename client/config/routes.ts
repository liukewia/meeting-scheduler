export default [
  {
    path: '/',
    // the value redirected to is RELATIVE URL
    redirect: '/home',
  },
  {
    path: '/home',
    component: './index',
  },
  {
    component: '@/components/Exceptions/404',
  },
];