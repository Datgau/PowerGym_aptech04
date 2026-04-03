import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Avatar,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import type { ImageManagementProps } from '../types';
import { MAX_IMAGES, MAX_IMAGE_SIZE } from '../constants';

const ImageManagement: React.FC<ImageManagementProps> = ({
  images,
  imagePreviews,
  existingImages,
  loading,
  imageError,
  mode,
  onFileSelect,
  onRemoveNewImage,
  onDeleteExistingImage,
  fileInputRef
}) => {
  const getTotalImageCount = () => existingImages.length + images.length;
  const canAddMoreImages = () => getTotalImageCount() < MAX_IMAGES;

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Images {mode === 'create' && '*'}
      </Typography>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileSelect}
        style={{ display: 'none' }}
        disabled={loading}
      />

      {imageError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {imageError}
        </Alert>
      )}

      {/* Existing Images */}
      {mode === 'edit' && existingImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Current Images:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {existingImages.map((imageUrl, index) => (
              <Box 
                key={`existing-${index}`} 
                sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' } }}
              >
                <Paper
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover .delete-button': { opacity: 1 }
                  }}
                >
                  <Avatar
                    src={imageUrl}
                    variant="rounded"
                    sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                  <IconButton
                    className="delete-button"
                    onClick={() => onDeleteExistingImage(imageUrl)}
                    disabled={loading}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* New Images */}
      {imagePreviews.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {mode === 'edit' && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              New Images to Add:
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {imagePreviews.map((preview, index) => (
              <Box 
                key={`new-${index}`} 
                sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(25% - 12px)' } }}
              >
                <Paper
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover .delete-button': { opacity: 1 }
                  }}
                >
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                  <IconButton
                    className="delete-button"
                    onClick={() => onRemoveNewImage(index)}
                    disabled={loading}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Upload Button */}
      {canAddMoreImages() && (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          sx={{
            height: 120,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: imageError ? 'error.main' : 'divider',
            color: imageError ? 'error.main' : 'text.secondary',
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: imageError ? 'error.dark' : 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>
              {getTotalImageCount() === 0 ? 'Click to upload images' : 'Add more images'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max {MAX_IMAGES} images • Max {MAX_IMAGE_SIZE / (1024 * 1024)}MB each
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {getTotalImageCount()}/{MAX_IMAGES} images
            </Typography>
          </Box>
        </Button>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Upload high-quality images to attract customers. You can delete and replace images anytime.
      </Typography>
    </Box>
  );
};

export default ImageManagement;
