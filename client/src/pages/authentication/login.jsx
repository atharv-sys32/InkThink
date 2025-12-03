import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // If user has 'user' role (admin), redirect to dashboard
        if (decoded.role === 'user') {
          navigate('/admin', { replace: true });
        }
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, [navigate]);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography component={Link} to="/admin/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
