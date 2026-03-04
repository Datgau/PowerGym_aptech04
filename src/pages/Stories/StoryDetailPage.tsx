import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button,
    TextField,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    ArrowBack,
    Favorite,
    FavoriteBorder,
    Comment as CommentIcon,
    Send,
    Schedule,
    LocalOffer,
    Share,
    Person,
} from '@mui/icons-material';
import { storyService, type StoryItem, type StoryComment } from '../../services/storyService';
import RichTextDisplay from '../../components/Common/RichTextDisplay';
import { useAuth } from '../../hooks/useAuth';

const StoryDetailPage = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const navigate = useNavigate();
    const { user, requireAuth } = useAuth();

    // Story state
    const [story, setStory] = useState<StoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Comments state
    const [comments, setComments] = useState<StoryComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // Like state
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);

    // UI state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [imageLoaded, setImageLoaded] = useState(false);

    // Load story data
    useEffect(() => {
        if (storyId) {
            loadStory();
            loadComments();
        }
    }, [storyId]);

    const loadStory = async () => {
        if (!storyId) return;

        try {
            setLoading(true);
            const response = await storyService.getStoryById(storyId);
            
            if (response.success) {
                setStory(response.data);
                setIsLiked(response.data.isLikedByCurrentUser || false);
                setLikeCount(response.data.likeCount || 0);
            } else {
                setError('Story not found');
            }
        } catch (err: any) {
            console.error('Error loading story:', err);
            setError(err.response?.data?.message || 'Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        if (!storyId) return;

        try {
            setCommentsLoading(true);
            const response = await storyService.getStoryCommentsLegacy(storyId);
            
            if (response.success) {
                setComments(response.data);
            }
        } catch (err: any) {
            console.error('Error loading comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleLikeToggle = useCallback(async () => {
        if (!requireAuth() || !storyId || likeLoading) return;

        try {
            setLikeLoading(true);
            
            if (isLiked) {
                await storyService.unlikeStory(storyId);
                setIsLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                await storyService.likeStory(storyId);
                setIsLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (err: any) {
            console.error('Error toggling like:', err);
            setSnackbar({
                open: true,
                message: 'Failed to update like status',
                severity: 'error'
            });
        } finally {
            setLikeLoading(false);
        }
    }, [isLiked, storyId, requireAuth, likeLoading]);

    const handleCommentSubmit = async () => {
        if (!requireAuth() || !storyId || !newComment.trim() || commentSubmitting) return;

        try {
            setCommentSubmitting(true);
            const response = await storyService.addComment(storyId, newComment.trim());
            
            if (response.success) {
                setComments(prev => [response.data, ...prev]);
                setNewComment('');
                setSnackbar({
                    open: true,
                    message: 'Comment added successfully',
                    severity: 'success'
                });
                
                // Update story comment count
                if (story) {
                    setStory(prev => prev ? {
                        ...prev,
                        commentCount: (prev.commentCount || 0) + 1
                    } : null);
                }
            }
        } catch (err: any) {
            console.error('Error adding comment:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to add comment',
                severity: 'error'
            });
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleShare = useCallback(() => {
        if (navigator.share && story) {
            navigator.share({
                title: story.title,
                text: story.content,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setSnackbar({
                open: true,
                message: 'Link copied to clipboard',
                severity: 'success'
            });
        }
    }, [story]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}mo ago`;
    };

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '50vh' 
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !story) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Story not found'}
                </Alert>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    variant="outlined"
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            {/* Header */}
            <Box 
                sx={{ 
                    bgcolor: 'white', 
                    borderBottom: '1px solid #e0e0e0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                        <IconButton 
                            onClick={() => navigate(-1)}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" fontWeight={600}>
                            Story Details
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ py: 3 }}>
                {/* Story Content */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                    {/* Author Header */}
                    <CardContent sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                src={story.userAvatar}
                                alt={story.userName}
                                sx={{ width: 48, height: 48, bgcolor: '#00b4ff' }}
                                slotProps={{
                                    img: {
                                        referrerPolicy: 'no-referrer',
                                        crossOrigin: 'anonymous',
                                    }
                                }}
                            >
                                <Person />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    {story.userName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Schedule fontSize="small" sx={{ color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {getTimeAgo(story.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        •
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(story.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={handleShare} color="primary">
                                <Share />
                            </IconButton>
                        </Box>

                        {/* Title and Tag */}
                        <Typography 
                            variant="h4" 
                            component="h1"
                            fontWeight={700}
                            sx={{ 
                                mb: 2,
                                color: '#2c3e50',
                                lineHeight: 1.2,
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                            }}
                        >
                            {story.title}
                        </Typography>

                        {story.tag && (
                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    icon={<LocalOffer />}
                                    label={story.tag}
                                    sx={{
                                        background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                        color: 'white',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            color: 'white',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </CardContent>

                    {/* Story Image */}
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: { xs: 300, sm: 400, md: 500 },
                                overflow: 'hidden',
                                background: '#f5f5f5',
                            }}
                        >
                            <img
                                src={story.imageUrl}
                                alt={story.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'opacity 0.3s ease',
                                    opacity: imageLoaded ? 1 : 0,
                                }}
                                onLoad={() => setImageLoaded(true)}
                            />
                            
                            {!imageLoaded && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%)',
                                        backgroundSize: '20px 20px',
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Story Content */}
                    <CardContent>
                        <Box sx={{ mb: 3 }}>
                            <RichTextDisplay content={story.content} />
                        </Box>

                        {/* Action Bar */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pt: 2,
                                borderTop: '1px solid #e0e0e0',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton
                                        onClick={handleLikeToggle}
                                        disabled={likeLoading}
                                        sx={{
                                            color: isLiked ? '#ff4757' : 'text.secondary',
                                            '&:hover': {
                                                color: '#ff4757',
                                                transform: 'scale(1.1)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {isLiked ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>
                                    <Typography variant="body2" color="text.secondary">
                                        {likeCount}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <IconButton color="primary">
                                        <CommentIcon />
                                    </IconButton>
                                    <Typography variant="body2" color="text.secondary">
                                        {story.commentCount || 0}
                                    </Typography>
                                </Box>
                            </Box>

                            {story.readTime && (
                                <Typography variant="caption" color="text.secondary">
                                    {story.readTime} read
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Comments ({story.commentCount || 0})
                        </Typography>

                        {/* Add Comment */}
                        {user && (
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <Avatar
                                        src={user.avatar}
                                        alt={user.fullName}
                                        sx={{ width: 40, height: 40, bgcolor: '#00b4ff' }}
                                    >
                                        <Person />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<Send />}
                                                onClick={handleCommentSubmit}
                                                disabled={!newComment.trim() || commentSubmitting}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #0099e6, #0052cc)',
                                                    },
                                                }}
                                            >
                                                {commentSubmitting ? 'Posting...' : 'Post Comment'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ mb: 3 }} />

                        {/* Comments List */}
                        {commentsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : comments.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    No comments yet. Be the first to comment!
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {comments.map((comment) => (
                                    <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar
                                            src={comment.user.avatar}
                                            alt={comment.user.fullName}
                                            sx={{ width: 40, height: 40, bgcolor: '#00b4ff' }}
                                        >
                                            <Person />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Box 
                                                sx={{ 
                                                    bgcolor: '#f8f9fa', 
                                                    borderRadius: 2, 
                                                    p: 2,
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                                                    {comment.user.fullName}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {comment.content}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {comment.timeAgo || getTimeAgo(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StoryDetailPage;