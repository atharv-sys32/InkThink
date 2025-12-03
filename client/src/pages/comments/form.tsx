import { CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { CREATE_COMMENT, UPDATE_COMMENT } from 'graphql/Comment';
import { GET_POSTS } from 'graphql/Post';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const CommentModal = ({ addComment, setAddComment, refetch, initialData = null, isEdit = false }) => {
  const [content, setContent] = useState('');
  const [postId, setPostId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [createComment, { loading: creating, error: createError }] = useMutation(CREATE_COMMENT);
  const [updateComment, { loading: updating, error: updateError }] = useMutation(UPDATE_COMMENT);

  // Fetch posts for dropdown
  const { data: postsData } = useQuery(GET_POSTS);

  // Get current user ID from JWT token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub; // 'sub' contains the user ID
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
      setPostId(initialData.post?.id || '');
      setStatus(initialData.status || 'ACTIVE');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user ID automatically
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      toast.error('You must be logged in to comment.');
      return;
    }

    try {
      if (isEdit && initialData) {
        // When editing, keep the original author - don't change to current user
        const res = await updateComment({
          variables: {
            updateCommentInput: {
              id: initialData.id,
              content,
              postId: parseInt(postId),
              status
            }
          }
        });
        if (res?.data?.updateComment) {
          toast.success('Comment updated successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      } else {
        const res = await createComment({
          variables: {
            createCommentInput: {
              content,
              postId: parseInt(postId),
              userId: parseInt(currentUserId),
              status
            }
          }
        });
        if (res?.data?.createComment) {
          toast.success('Comment created successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      }

      await refetch();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setAddComment(false);
  };

  return (
    <Dialog open={addComment} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Update Comment' : 'Create Comment'}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseCircleOutlined />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Post</InputLabel>
            <Select value={postId} onChange={(e) => setPostId(e.target.value)} required>
              <MenuItem value="">
                <em>Select a post</em>
              </MenuItem>
              {postsData?.posts?.map((post) => (
                <MenuItem key={post.id} value={post.id}>
                  {post.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <MenuItem value="ACTIVE">Not Spam</MenuItem>
              <MenuItem value="INACTIVE">Spam</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" type="submit" variant="contained">
          {creating || updating ? 'saving...' : isEdit ? 'Update Comment' : 'Create Comment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;
