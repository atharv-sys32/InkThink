import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, redirect to landing
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // Check if user's role is in allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // User doesn't have permission
      if (userRole === 'viewer') {
        // Viewer trying to access admin, redirect to blog
        return <Navigate to="/blog" replace />;
      } else if (userRole === 'user') {
        // Admin trying to access viewer-only area, redirect to admin
        return <Navigate to="/admin" replace />;
      }
      // Fallback
      return <Navigate to="/" replace />;
    }

    // User has correct role
    return children;
  } catch (error) {
    // Invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    return <Navigate to="/" replace />;
  }
};
