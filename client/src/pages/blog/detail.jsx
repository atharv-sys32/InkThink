import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS_PUBLIC } from '../../graphql/Post';
import { GET_COMMENTS_PUBLIC, CREATE_COMMENT } from '../../graphql/Comment';
import Loader from 'components/Loader';
import {
  Button,
  Typography,
  Chip,
  Box,
  Divider,
  Paper,
  Avatar,
  Stack,
  TextField,
  Card
} from '@mui/material';
import { ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export const BlogPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_POSTS_PUBLIC);
  const { loading: commentsLoading, data: commentsData, refetch: refetchComments } = useQuery(GET_COMMENTS_PUBLIC);
  const [createComment] = useMutation(CREATE_COMMENT);

  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is logged in
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const currentUser = getCurrentUser();

  if (loading || commentsLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
    return null;
  }

  // Find the specific post by ID and ensure it's ACTIVE
  const post = data?.posts?.find((p) => p.id === parseInt(id) && p.status === 'ACTIVE');

  if (!post) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Post not found or not available
        </Typography>
        <Button variant="contained" onClick={() => navigate('/blog')} sx={{ mt: 2 }}>
          Back to Blog
        </Button>
      </Box>
    );
  }

  // Filter comments for this post (only show ACTIVE/APPROVED comments to viewers)
  const postComments = commentsData?.comments?.filter(
    (comment) => comment.post?.id === parseInt(id) && comment.status === 'ACTIVE'
  ) || [];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login to comment');
      navigate('/viewer/login');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createComment({
        variables: {
          createCommentInput: {
            content: commentContent,
            postId: parseInt(id),
            userId: parseInt(currentUser.sub),
            status: 'ACTIVE'
          }
        }
      });

      if (res?.data?.createComment) {
        toast.success('Comment posted successfully!');
        setCommentContent('');
        await refetchComments();
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowLeftOutlined />}
        onClick={() => navigate('/blog')}
        sx={{ mb: 3 }}
      >
        Back to Blog
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 } }}>
        {/* Post Image */}
        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt={post.name}
            sx={{
              width: '100%',
              maxHeight: 500,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4
            }}
          />
        )}

        {/* Post Title */}
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {post.name}
        </Typography>

        {/* Category and Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          {post.category && (
            <Chip
              label={post.category.name}
              color="primary"
              onClick={() => navigate(`/blog?categoryId=${post.category.id}`)}
              sx={{ cursor: 'pointer' }}
            />
          )}
          {post.tags?.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              variant="outlined"
              onClick={() => navigate(`/blog?tagId=${tag.id}`)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        {/* Post Metadata */}
        {post.createdAt && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Published on{' '}
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Summary */}
        {post.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Summary
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              {post.summary}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            {post.description || 'No content available'}
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Comments Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Comments ({postComments.length})
          </Typography>

          {/* Comment Form */}
          {currentUser ? (
            <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Leave a comment
              </Typography>
              <form onSubmit={handleCommentSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write your comment here..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  sx={{ mb: 2, backgroundColor: 'white' }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !commentContent.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a4093 100%)'
                    }
                  }}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </Paper>
          ) : (
            <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50', textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Please login to leave a comment
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/viewer/login')}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a4093 100%)'
                  }
                }}
              >
                Login to Comment
              </Button>
            </Paper>
          )}

          {/* Comments List */}
          {postComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            <Stack spacing={3}>
              {postComments.map((comment) => (
                <Card key={comment.id} variant="outlined" sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.user?.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.createdAt &&
                            new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
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
