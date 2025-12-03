import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../graphql/Post';
import { GET_COMMENTS } from '../../graphql/Comment';
import Loader from 'components/Loader';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_POSTS);
  const { loading: commentsLoading, data: commentsData } = useQuery(GET_COMMENTS);

  if (loading || commentsLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
    return null;
  }

  // Find the specific post by ID
  const post = data?.posts?.find((p) => p.id === parseInt(id));

  // Filter comments for this specific post
  const postComments = commentsData?.comments?.filter(
    (comment) => comment.post?.id === parseInt(id)
  ) || [];

  if (!post) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/posts')}
          sx={{ mb: 2 }}
        >
          Back to Posts
        </Button>
        <Typography variant="h5">Post not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/posts')}
        sx={{ mb: 3 }}
      >
        Back to Posts
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Post Image */}
        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt={post.name}
            sx={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 3
            }}
          />
        )}

        {/* Post Title */}
        <Typography variant="h3" gutterBottom>
          {post.name}
        </Typography>

        {/* Status Badge */}
        <Chip
          label={post.status === 'ACTIVE' ? 'Active' : post.status === 'DRAFT' ? 'Draft' : 'Inactive'}
          color={post.status === 'ACTIVE' ? 'success' : post.status === 'DRAFT' ? 'info' : 'warning'}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Category */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Category
          </Typography>
          <Chip
            label={post.category?.name || 'No Category'}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tags
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Summary */}
        {post.summary && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {post.summary}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8
            }}
          >
            {post.description || 'No description available'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Post Metadata */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Slug
            </Typography>
            <Typography variant="body2">
              {post.slug}
            </Typography>
          </Box>
          {post.createdAt && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          )}
          {post.updatedAt && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Comments Section */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Comments ({postComments.length})
          </Typography>

          {postComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No comments yet.
            </Typography>
          ) : (
            <Stack spacing={3} sx={{ mt: 3 }}>
              {postComments.map((comment) => (
                <Card
                  key={comment.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: comment.status === 'INACTIVE' ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                    borderLeft: comment.status === 'INACTIVE' ? '4px solid #f44336' : 'none'
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.user?.name || 'Anonymous'}
                        </Typography>
                        {comment.status === 'INACTIVE' && (
                          <Chip
                            icon={<WarningOutlined />}
                            label="Spam"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {comment.user?.email}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                      {comment.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
