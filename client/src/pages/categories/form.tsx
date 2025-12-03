import { CloseCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
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
import { CREATE_CATEGORY, UPDATE_CATEGORY } from 'graphql/Category';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SupabaseUploadWidget from 'components/SupabaseUploadWidget';

const CategoryModal = ({ addCategory, setAddCategory, refetch, initialData = null, isEdit = false }) => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [createCategory, { loading: creating, error: createError }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updating, error: updateError }] = useMutation(UPDATE_CATEGORY);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setIconUrl(initialData.icon || '');
      setStatus(initialData.status || 'ACTIVE');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && initialData) {
        const res = await updateCategory({
          variables: {
            id: initialData.id,
            updateCategoryInput: {
              name,
              icon: iconUrl,
              status
            }
          }
        });
        if (res?.data?.updateCategory) {
          toast.success('Category updated successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      } else {
        const res = await createCategory({
          variables: {
            createCategoryInput: {
              name,
              icon: iconUrl,
              status
            }
          }
        });
        if (res?.data?.createCategory) {
          toast.success('Category created successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      }

      await refetch();

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || error);
    }
  };

  const handleClose = () => {
    setAddCategory(false);
  };
  return (
    <Dialog open={addCategory} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Update Category' : 'Create Category'}</DialogTitle>
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
          <TextField margin="dense" label="Category Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>
              Category Icon
            </label>
            <SupabaseUploadWidget
              value={iconUrl}
              onChange={setIconUrl}
              buttonText="Upload Category Icon"
              folder="categories"
            />
          </div>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" type="submit" variant="contained">
          {creating || updating ? 'saving...' : isEdit ? 'Update Category' : 'Create Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
