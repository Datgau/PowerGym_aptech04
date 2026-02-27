import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { storyService, type CreateStoryRequest } from '../../../services/storyService';

interface ShareStoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STORY_TAGS = [
  { value: 'workout', label: 'Workout' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'progress', label: 'Progress' },
  { value: 'tips', label: 'Tips' }
];

const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!image) {
      setError('Please select an image');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }

    if (content.length > 500) {
      setError('Content must be less than 500 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreateStoryRequest = {
        image,
        title: title.trim(),
        content: content.trim() || undefined,
        tag: tag || undefined
      };

      await storyService.createStory(request);

      // Success
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Failed to create story:', err);
      setError(err.response?.data?.message || 'Failed to share story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    setTitle('');
    setContent('');
    setTag('');
    setImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Share Your Story
        </Typography>
        <IconButton 
          onClick={handleClose} 
          size="small"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Your story will be reviewed by admin before appearing on the home page.
        </Alert>

        {/* Image Upload */}
        <Box sx={{ mb: 3 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            disabled={loading}
          />
          
          {!imagePreview ? (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              sx={{
                height: 200,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2
                }
              }}
            >
              <Box textAlign="center">
                <Typography variant="body1" gutterBottom>
                  Click to upload image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Max size: 5MB | Recommended: 1080x1920
                </Typography>
              </Box>
            </Button>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imagePreview}
                variant="rounded"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                disabled={loading}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Title */}
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Give your story a title..."
          helperText={`${title.length}/100 characters`}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 100 }}
        />

        {/* Tag */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tag (Optional)</InputLabel>
          <Select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            disabled={loading}
            label="Tag (Optional)"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {STORY_TAGS.map((tagOption) => (
              <MenuItem key={tagOption.value} value={tagOption.value}>
                {tagOption.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Content */}
        <TextField
          label="Content (Optional)"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder="Share your experience..."
          helperText={`${content.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !image || !title.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Sharing...' : 'Share Story'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareStoryModal;
