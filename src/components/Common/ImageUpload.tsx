import React, { useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  Grid,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface ImageUploadProps {
  images: File[];
  imagePreviews: string[];
  onImagesChange: (files: File[], previews: string[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  imagePreviews,
  onImagesChange,
  maxImages = 5,
  maxSizePerImage = 5,
  disabled = false,
  error,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validate file size
      if (file.size > maxSizePerImage * 1024 * 1024) {
        continue;
      }

      // Check if we haven't exceeded max images
      if (images.length + validFiles.length >= maxImages) {
        break;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...images, ...validFiles];
      const updatedPreviews = [...imagePreviews, ...newPreviews];
      onImagesChange(updatedFiles, updatedPreviews);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    onImagesChange(updatedFiles, updatedPreviews);
  };

  const canAddMore = images.length < maxImages;

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Upload Button */}
      {canAddMore && (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          sx={{
            height: 120,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: error ? 'error.main' : 'divider',
            color: error ? 'error.main' : 'text.secondary',
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: error ? 'error.dark' : 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>
              {images.length === 0 ? 'Click to upload images' : 'Add more images'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max {maxImages} images • Max {maxSizePerImage}MB each
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {images.length}/{maxImages} uploaded
            </Typography>
          </Box>
        </Button>
      )}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {imagePreviews.map((preview, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover .delete-button': {
                      opacity: 1
                    }
                  }}
                >
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    className="delete-button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.9)'
                      }
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
            
            {/* Add More Button */}
            {canAddMore && imagePreviews.length > 0 && (
              <Grid item xs={6} sm={4} md={3}>
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  sx={{
                    width: '100%',
                    height: 120,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <AddIcon />
                  <Typography variant="caption">
                    Add More
                  </Typography>
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Helper Text */}
      {(helperText || error) && (
        <Box sx={{ mt: 1, px: 1 }}>
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
          >
            {error || helperText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;