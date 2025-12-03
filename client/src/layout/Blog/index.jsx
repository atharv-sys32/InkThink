import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { INKTHINK_LOGO_URL } from '../../utils/supabase';

const BlogLayout = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || 'User',
          email: decoded.email || '',
          role: decoded.role || 'viewer'
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    toast.success('Logged out successfully!');
    navigate('/blog');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
            onClick={() => navigate('/')}
          >
            <img
              src={INKTHINK_LOGO_URL}
              alt="InkThink"
              style={{ height: '40px', objectFit: 'contain' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700 }}
            >
              InkThink
            </Typography>
          </Box>

          <Button color="inherit" onClick={() => navigate('/blog')} sx={{ mr: 2 }}>
            Home
          </Button>

          <Button color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            Back to Landing
          </Button>

          {user ? (
            <>
              <IconButton onClick={handleMenu} sx={{ ml: 2 }}>
                <Avatar sx={{ bgcolor: 'white', color: '#764ba2', width: 36, height: 36 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" fontWeight="bold">
                    {user.name}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/viewer/login')} sx={{ mr: 1 }}>
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onClick={() => navigate('/viewer/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100]
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 InkThink. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogLayout;
