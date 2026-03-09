import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Avatar,
  Stack,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  Schedule as PendingIcon,
  Favorite as HeartIcon,
  ChatBubbleOutline as CommentIcon,
  IosShare as ShareIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import RichTextDisplay from '../../../../../components/Common/RichTextDisplay';
import type { StoryItem } from '../../../../../services/storyService';

interface StoryCardProps {
  story: StoryItem;
  actionLoading: string | null;
  currentUserId?: number;
  onView: (story: StoryItem) => void;
  onApprove: (storyId: string) => void;
  onReject: (storyId: string) => void;
  onUpdateStatus: (storyId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  onEdit?: (story: StoryItem) => void;
  showAlert?: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

const STATUS_CONFIG = {
  APPROVED: {
    label: 'Approved',
    bg: 'linear-gradient(135deg, #00c853 0%, #69f0ae 100%)',
    color: '#fff',
    dot: '#00c853'
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'linear-gradient(135deg, #d32f2f 0%, #ff6659 100%)',
    color: '#fff',
    dot: '#d32f2f'
  },
  PENDING: {
    label: 'Pending',
    bg: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
    color: '#fff',
    dot: '#f57c00'
  }
};

const getStatus = (status?: string) =>
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;

const StoryCard: React.FC<StoryCardProps> = ({
                                               story,
                                               actionLoading,
                                               currentUserId,
                                               onView,
                                               onApprove,
                                               onReject,
                                               onUpdateStatus,
                                               onEdit,
                                             }) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);
  const status = getStatus(story.status);
  const isLoading = actionLoading === story.id;
  const isOwner = currentUserId && story.userId === currentUserId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  const handleStatusUpdate = (newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (newStatus === 'REJECTED') {
      if (confirm('Are you sure? Rejected stories cannot be updated and will be deleted when expired.')) {
        onUpdateStatus(story.id, newStatus);
      }
    } else {
      onUpdateStatus(story.id, newStatus);
    }
    handleMenuClose();
  };

  return (
      <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'rgba(0,0,0,0.07)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: '#fff',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              borderColor: 'transparent',
            }
          }}
      >
        {/* Image Section with gradient overlay */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
              component="img"
              height="180"
              image={imgError ? 'https://placehold.co/400x180/f5f5f5/bbb?text=No+Image' : story.imageUrl}
              alt={story.title}
              onError={() => setImgError(true)}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '.MuiCard-root:hover &': {
                  transform: 'scale(1.04)'
                }
              }}
          />
          {/* Gradient overlay */}
          <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
                pointerEvents: 'none'
              }}
          />

          {/* Status Badge */}
          <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                background: status.bg,
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
          >
            <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)',
                  animation: story.status === 'PENDING' ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 }
                  }
                }}
            />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {status.label}
            </Typography>
          </Box>

          {/* Tag badge */}
          {story.tag && (
              <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(8px)',
                  }}
              >
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#1565c0', letterSpacing: '0.04em' }}>
                  #{story.tag}
                </Typography>
              </Box>
          )}

          {/* Author on image bottom */}
          <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
          >
            <Avatar
                src={story.userAvatar}
                alt={story.userName}
                sx={{
                  width: 28,
                  height: 28,
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
            />
            <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
            >
              {story.userName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
              {story.timeAgo || 'Just now'}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, p: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
              variant="h6"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#1a1a2e',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
          >
            {story.title}
          </Typography>

          {story.content && (
              <Box
                  sx={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: '#666',
                    fontSize: '0.82rem',
                    lineHeight: 1.5
                  }}
              >
                <RichTextDisplay
                    content={story.content}
                    maxLines={2}
                    variant="body2"
                />
              </Box>
          )}

          {/* Stats row */}
          <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 'auto',
                pt: 1.5,
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}
          >
            {[
              { icon: <HeartIcon sx={{ fontSize: 13, color: '#e53935' }} />, count: story.likeCount || 0 },
              { icon: <CommentIcon sx={{ fontSize: 13, color: '#1e88e5' }} />, count: story.commentCount || 0 },
              { icon: <ShareIcon sx={{ fontSize: 13, color: '#43a047' }} />, count: story.shareCount || 0 }
            ].map((stat, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={0.4}>
                  {stat.icon}
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#888' }}>
                    {stat.count}
                  </Typography>
                </Stack>
            ))}
          </Stack>
        </CardContent>

        {/* Action footer */}
        <Box
            sx={{
              px: 2,
              pb: 2,
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}
        >
          <Button
              size="small"
              variant="outlined"
              startIcon={<ViewIcon sx={{ fontSize: '14px !important' }} />}
              onClick={() => onView(story)}
              sx={{
                flex: 1,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#444',
                py: 0.7,
                '&:hover': {
                  borderColor: '#1565c0',
                  color: '#1565c0',
                  background: 'rgba(21,101,192,0.05)'
                }
              }}
          >
            View
          </Button>

          {isOwner && onEdit && (
              <Tooltip title="Edit your story">
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
                    onClick={() => onEdit(story)}
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderColor: 'rgba(0,0,0,0.15)',
                      color: '#444',
                      py: 0.7,
                      '&:hover': {
                        borderColor: '#f57c00',
                        color: '#f57c00',
                        background: 'rgba(245,124,0,0.05)'
                      }
                    }}
                >
                  Edit
                </Button>
              </Tooltip>
          )}

          {story.status === 'PENDING' && (
              <>
                <Tooltip title="Approve">
                  <Button
                      size="small"
                      variant="contained"
                      onClick={() => onApprove(story.id)}
                      disabled={isLoading}
                      sx={{
                        flex: 1,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        py: 0.7,
                        background: 'linear-gradient(135deg, #00c853, #69f0ae)',
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00a844, #50e09a)',
                          boxShadow: '0 4px 12px rgba(0,200,83,0.3)'
                        }
                      }}
                  >
                    {isLoading ? '...' : <><ApproveIcon sx={{ fontSize: 14, mr: 0.5 }} />Approve</>}
                  </Button>
                </Tooltip>
                <Tooltip title="Reject">
                  <Button
                      size="small"
                      variant="contained"
                      onClick={() => onReject(story.id)}
                      disabled={isLoading}
                      sx={{
                        flex: 1,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        py: 0.7,
                        background: 'linear-gradient(135deg, #d32f2f, #ff6659)',
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #b71c1c, #e53935)',
                          boxShadow: '0 4px 12px rgba(211,47,47,0.3)'
                        }
                      }}
                  >
                    <RejectIcon sx={{ fontSize: 14, mr: 0.5 }} />Reject
                  </Button>
                </Tooltip>
              </>
          )}

          {story.status !== 'REJECTED' && (
              <Tooltip title="Change status">
                <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    disabled={isLoading}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                        borderColor: 'rgba(0,0,0,0.2)'
                      }
                    }}
                >
                  <MoreIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
          )}
        </Box>

        <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  minWidth: 180,
                  overflow: 'hidden'
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {story.status !== 'PENDING' && (
              <MenuItem
                  onClick={() => handleStatusUpdate('PENDING')}
                  disabled={isLoading}
                  sx={{ py: 1.2, fontSize: '0.85rem', '&:hover': { background: 'rgba(245,124,0,0.08)' } }}
              >
                <ListItemIcon><PendingIcon fontSize="small" sx={{ color: '#f57c00' }} /></ListItemIcon>
                <ListItemText slotProps={{ primary: { fontSize: '0.85rem', fontWeight: 500 } }}>Set to Pending</ListItemText>
              </MenuItem>
          )}
          {story.status !== 'APPROVED' && (
              <MenuItem
                  onClick={() => handleStatusUpdate('APPROVED')}
                  disabled={isLoading}
                  sx={{ py: 1.2, '&:hover': { background: 'rgba(0,200,83,0.08)' } }}
              >
                <ListItemIcon><ApproveIcon fontSize="small" sx={{ color: '#00c853' }} /></ListItemIcon>
                <ListItemText slotProps={{ primary: { fontSize: '0.85rem', fontWeight: 500 } }}>Set to Approved</ListItemText>
              </MenuItem>
          )}
          {story.status !== 'REJECTED' && (
              <MenuItem
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isLoading}
                  sx={{ py: 1.2, '&:hover': { background: 'rgba(211,47,47,0.08)' } }}
              >
                <ListItemIcon><RejectIcon fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText slotProps={{ primary: { fontSize: '0.85rem', fontWeight: 500 } }}>Set to Rejected</ListItemText>
              </MenuItem>
          )}
        </Menu>
      </Card>
  );
};

export default StoryCard;