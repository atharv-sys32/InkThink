import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { CategoriesPage } from 'pages/categories';
import { TagsPage } from 'pages/tags';
import { PostsPage } from 'pages/posts';
import { PostDetailPage } from 'pages/posts/detail';
import { CommentsPage } from 'pages/comments';
import Dashboard from 'layout/Dashboard';
import { ProtectedRoute } from 'components/ProtectedRoute';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const PageRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute allowedRoles={['user']}>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/admin/categories',
      element: <CategoriesPage />
    },
    {
      path: '/admin/tags',
      element: <TagsPage />
    },
    {
      path: '/admin/posts/:id',
      element: <PostDetailPage />
    },
    {
      path: '/admin/posts',
      element: <PostsPage />
    },
    {
      path: '/admin/comments',
      element: <CommentsPage />
    }
  ]
};

export default PageRoutes;
