import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import PageRoutes from './PageRoutes';
import BlogRoutes, { ViewerAuthRoutes } from './BlogRoutes';
import { LandingPage } from 'pages/landing';

// ==============================|| ROUTING RENDER ||============================== //

// Landing page route
const LandingRoute = {
  path: '/',
  element: <LandingPage />
};

const router = createBrowserRouter(
  [
    LandingRoute,
    BlogRoutes,
    ...ViewerAuthRoutes,
    MainRoutes,
    LoginRoutes,
    PageRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
