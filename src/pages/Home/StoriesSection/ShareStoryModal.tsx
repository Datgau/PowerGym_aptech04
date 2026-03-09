import React, { useState, useRef, useEffect } from 'react';
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
import { storyService, type CreateStoryRequest, type StoryItem } from '../../../services/storyService.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import RichTextEditor from '../../../components/Common/RichTextEditor';

interface ShareStoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  story?: StoryItem | null; // Add story prop for edit mode
}

const STORY_TAGS = [
  { value: 'workout', label: 'Workout' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'progress', label: 'Progress' },
  { value: 'tips', label: 'Tips' }
];

const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ open, onClose, onSuccess, story }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { requireAuth } = useAuth();
  
  const isEditMode = !!story;

  // Load story data when in edit mode
  useEffect(() => {
    if (story && open) {
      setTitle(story.title || '');
      setContent(story.content || '');
      setTag(story.tag || '');
      setImagePreview(story.imageUrl || null);
      setImage(null); // Don't set file in edit mode unless user uploads new one
    }
  }, [story, open]);

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
    if (!requireAuth()) return;
    
    // In edit mode, image is optional (can keep existing image)
    if (!isEditMode && !image) {
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

    if (content.length > 1000) {
      setError('Content must be less than 1000 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && story) {
        // Update existing story
        const request: CreateStoryRequest = {
          image: image || undefined, // Only include if new image uploaded
          title: title.trim(),
          content: content.trim() || undefined,
          tag: tag || undefined
        };

        await storyService.updateStory(story.id, request);
      } else {
        // Create new story
        const request: CreateStoryRequest = {
          image: image!,
          title: title.trim(),
          content: content.trim() || undefined,
          tag: tag || undefined
        };

        await storyService.createStory(request);
      }

      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} story:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'share'} story. Please try again.`);
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
          {isEditMode ? 'Edit Your Story' : 'Share Your Story'}
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

        {!isEditMode && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Your story will be reviewed by admin before appearing on the home page.
          </Alert>
        )}

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
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Content (Optional)
          </Typography>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Share your experience, tips, or motivation..."
            disabled={loading}
            maxLength={1000}
            minHeight={120}
            helperText="Use rich formatting to make your story more engaging"
          />
        </Box>
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
          disabled={loading || !title.trim() || (!isEditMode && !image)}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? (isEditMode ? 'Updating...' : 'Sharing...') : (isEditMode ? 'Update Story' : 'Share Story')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareStoryModal;
