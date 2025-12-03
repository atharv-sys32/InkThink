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
  TextField,
  Chip,
  Box,
  OutlinedInput
} from '@mui/material';
import { CREATE_POST, UPDATE_POST } from 'graphql/Post';
import { GET_CATEGORIES } from 'graphql/Category';
import { GET_TAGS } from 'graphql/Tag';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SupabaseUploadWidget from 'components/SupabaseUploadWidget';
import { jwtDecode } from 'jwt-decode';

const PostModal = ({ addPost, setAddPost, refetch, initialData = null, isEdit = false }) => {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [createPost, { loading: creating, error: createError }] = useMutation(CREATE_POST);
  const [updatePost, { loading: updating, error: updateError }] = useMutation(UPDATE_POST);

  // Fetch categories and tags
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: tagsData } = useQuery(GET_TAGS);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSummary(initialData.summary || '');
      setDescription(initialData.description || '');
      setImageUrl(initialData.image || '');
      setCategoryId(initialData.category?.id || '');
      setTagIds(initialData.tags?.map((tag) => tag.id) || []);
      setStatus(initialData.status || 'ACTIVE');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current user ID from token
      const token = localStorage.getItem('token');
      let currentUserId = null;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          currentUserId = parseInt(decoded.sub);
        } catch (error) {
          toast.error('Invalid token. Please login again.');
          return;
        }
      }

      if (isEdit && initialData) {
        const res = await updatePost({
          variables: {
            updatePostInput: {
              id: initialData.id,
              name,
              summary,
              description,
              image: imageUrl,
              categoryId: parseInt(categoryId),
              tagIds: tagIds.map((id) => parseInt(id)),
              status
            }
          }
        });
        if (res?.data?.updatePost) {
          toast.success('Post updated successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      } else {
        const res = await createPost({
          variables: {
            createPostInput: {
              name,
              summary,
              description,
              image: imageUrl,
              authorId: currentUserId,
              categoryId: parseInt(categoryId),
              tagIds: tagIds.map((id) => parseInt(id)),
              status
            }
          }
        });
        if (res?.data?.createPost) {
          toast.success('Post created successfully!');
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
    setAddPost(false);
  };

  return (
    <Dialog open={addPost} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Update Post' : 'Create Post'}</DialogTitle>
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
          <TextField margin="dense" label="Post Title" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />

          <TextField margin="dense" label="Summary" fullWidth value={summary} onChange={(e) => setSummary(e.target.value)} required />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>
              Post Featured Image
            </label>
            <SupabaseUploadWidget
              value={imageUrl}
              onChange={setImageUrl}
              buttonText="Upload Post Image"
              folder="posts"
            />
          </div>

          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categoriesData?.categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tagIds}
              onChange={(e) => setTagIds(e.target.value)}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tag = tagsData?.tags?.find((t) => t.id === value);
                    return <Chip key={value} label={tag?.name || value} size="small" />;
                  })}
                </Box>
              )}
            >
              {tagsData?.tags?.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" type="submit" variant="contained">
          {creating || updating ? 'saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostModal;
