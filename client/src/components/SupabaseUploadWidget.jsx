import React, { useState } from 'react';
import { Button, Box, IconButton, CircularProgress } from '@mui/material';
import { DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../utils/supabase';
import { toast } from 'react-toastify';

const SupabaseUploadWidget = ({ value, onChange, buttonText = 'Upload Image', folder = '' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP, or SVG)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadFile(file, folder);
      onChange(publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={`upload-button-${folder}`}
      />
      <label htmlFor={`upload-button-${folder}`}>
        <Button
          variant="outlined"
          component="span"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadOutlined />}
          sx={{ mb: 2 }}
        >
          {uploading ? 'Uploading...' : value ? 'Change Image' : buttonText}
        </Button>
      </label>

      {value && (
        <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
          <img
            src={value}
            alt="Uploaded"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              display: 'block',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark'
              },
              width: 32,
              height: 32
            }}
            size="small"
          >
            <DeleteOutlined style={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default SupabaseUploadWidget;
