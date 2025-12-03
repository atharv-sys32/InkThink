import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/admin',
  element: <MinimalLayout />,
  children: [
    {
      path: '/admin/login',
      element: <AuthLogin />
    },
    {
      path: '/admin/register',
      element: <AuthRegister />
    }
  ]
};

export default LoginRoutes;
