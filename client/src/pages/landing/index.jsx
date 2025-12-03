import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { ReadOutlined, LoginOutlined } from '@ant-design/icons';
import { INKTHINK_LOGO_URL } from '../../utils/supabase';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img
              src={INKTHINK_LOGO_URL}
              alt="InkThink"
              style={{ height: '80px', objectFit: 'contain' }}
            />
          </Box>

          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            InkThink
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
            Welcome! Choose how you'd like to continue
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            sx={{ mt: 4 }}
          >
            {/* Viewer Option */}
            <Card
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: 'center', py: 4 }}>
                <ReadOutlined style={{ fontSize: 64, color: '#667eea', marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  View Blogs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Browse and read blog posts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Login to leave comments and interact with content
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/blog')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a4093 100%)'
                    }
                  }}
                >
                  Enter Blog
                </Button>
              </CardActions>
            </Card>

            {/* Admin Option */}
            <Card
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: 'center', py: 4 }}>
                <LoginOutlined style={{ fontSize: 64, color: '#764ba2', marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Admin Panel
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Manage blog content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create, edit, and manage posts, categories, and comments
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/admin/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#6a4093',
                      backgroundColor: 'rgba(118, 75, 162, 0.04)'
                    }
                  }}
                >
                  Admin Login
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
