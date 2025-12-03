import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS_PUBLIC } from '../../graphql/Post';
import Loader from 'components/Loader';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Box,
  Alert,
  Button,
  CardActionArea,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

export const BlogHomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, data } = useQuery(GET_POSTS_PUBLIC);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <Loader />;

  if (error) {
    toast.error(error.message);
    return null;
  }

  // Filter only ACTIVE posts for public view
  const activePosts = data?.posts?.filter((post) => post.status === 'ACTIVE') || [];

  // Get filter parameters from URL
  const categoryId = searchParams.get('categoryId');
  const tagId = searchParams.get('tagId');

  // Filter posts based on URL parameters and search query
  let filteredPosts = activePosts;

  if (categoryId) {
    filteredPosts = filteredPosts.filter((post) => post.category?.id === parseInt(categoryId));
  }

  if (tagId) {
    filteredPosts = filteredPosts.filter((post) => post.tags?.some((tag) => tag.id === parseInt(tagId)));
  }

  if (searchQuery) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Get filter info for display
  let filterInfo = null;
  if (categoryId) {
    const category = data.posts.find((p) => p.category?.id === parseInt(categoryId))?.category;
    filterInfo = category ? `Viewing posts in: ${category.name}` : 'Filtered by Category';
  } else if (tagId) {
    const tag = data.posts
      .find((p) => p.tags?.some((t) => t.id === parseInt(tagId)))
      ?.tags?.find((t) => t.id === parseInt(tagId));
    filterInfo = tag ? `Posts tagged with: ${tag.name}` : 'Filtered by Tag';
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 3,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" gutterBottom fontWeight="bold">
          Welcome to InkThink
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Discover stories, thinking, and expertise from writers on any topic
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'white',
                borderRadius: 2
              }
            }}
          />
        </Box>
      </Box>

      {/* Filter Alert */}
      {filterInfo && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button size="small" onClick={() => navigate('/blog')} color="inherit">
              Clear Filter
            </Button>
          }
        >
          {filterInfo}
        </Alert>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No posts found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {searchQuery ? 'Try a different search term' : 'Check back later for new content'}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Latest Posts ({filteredPosts.length})
          </Typography>

          <Grid container spacing={4}>
            {filteredPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/blog/${post.id}`)}>
                    {post.image ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.image}
                        alt={post.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="h4" color="white" fontWeight="bold">
                          {post.name.charAt(0)}
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                        {post.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {post.summary || post.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {post.category && (
                          <Chip
                            label={post.category.name}
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/blog?categoryId=${post.category.id}`);
                            }}
                          />
                        )}
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/blog?tagId=${tag.id}`);
                            }}
                          />
                        ))}
                      </Stack>

                      {post.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};
