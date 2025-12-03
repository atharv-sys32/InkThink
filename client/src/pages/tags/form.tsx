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
import { CREATE_TAG, UPDATE_TAG } from 'graphql/Tag';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const TagModal = ({ addTag, setAddTag, refetch, initialData = null, isEdit = false }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [createTag, { loading: creating, error: createError }] = useMutation(CREATE_TAG);
  const [updateTag, { loading: updating, error: updateError }] = useMutation(UPDATE_TAG);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setStatus(initialData.status || 'ACTIVE');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && initialData) {
        const res = await updateTag({
          variables: {
            id: initialData.id,
            updateTagInput: {
              name,
              status
            }
          }
        });
        if (res?.data?.updateTag) {
          toast.success('Tag updated successfully!');
        } else {
          toast.error(res.errors?.[0]?.message || 'Unknown error occurred.');
        }
      } else {
        const res = await createTag({
          variables: {
            createTagInput: {
              name,
              status
            }
          }
        });
        if (res?.data?.createTag) {
          toast.success('Tag created successfully!');
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
    setAddTag(false);
  };

  return (
    <Dialog open={addTag} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Update Tag' : 'Create Tag'}</DialogTitle>
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
          <TextField margin="dense" label="Tag Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />

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
          {creating || updating ? 'saving...' : isEdit ? 'Update Tag' : 'Create Tag'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagModal;
