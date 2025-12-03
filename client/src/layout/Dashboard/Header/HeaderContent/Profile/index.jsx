import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', email: '', role: '' });

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Decode JWT token to get user info
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || decoded.username || 'User',
          email: decoded.email || '',
          role: decoded.role || 'user'
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');

    toast.success('Logged out successfully!');

    // Navigate to landing page
    navigate('/');
  };

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={avatar1} size="sm" />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {user.name}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                          <Stack>
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Email: {user.email || 'Not available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                      </Typography>
                    </Stack>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
