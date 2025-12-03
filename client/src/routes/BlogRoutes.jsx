import BlogLayout from 'layout/Blog';
import { BlogHomePage } from 'pages/blog';
import { BlogPostDetailPage } from 'pages/blog/detail';
import { ViewerLogin } from 'pages/viewer-auth/login';
import { ViewerRegister } from 'pages/viewer-auth/register';

// ==============================|| BLOG ROUTING ||============================== //

const BlogRoutes = {
  path: '/blog',
  element: <BlogLayout />,
  children: [
    {
      path: '/blog',
      element: <BlogHomePage />
    },
    {
      path: '/blog/:id',
      element: <BlogPostDetailPage />
    }
  ]
};

// Separate routes for viewer auth (no layout)
export const ViewerAuthRoutes = [
  {
    path: '/viewer/login',
    element: <ViewerLogin />
  },
  {
    path: '/viewer/register',
    element: <ViewerRegister />
  }
];

export default BlogRoutes;
