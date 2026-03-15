import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  School,
  Work,
  Person,
  Description,
  Verified,
  Warning,
  Download,
  ContactEmergency
} from '@mui/icons-material';
import {
  getTrainerById,
  verifyTrainerDocument,
  type TrainerResponse,
  type TrainerDocumentResponse
} from '../../../../services/trainerService';

interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  trainerId: number | null;
}

const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({
  open,
  onClose,
  trainerId
}) => {
  const [trainer, setTrainer] = useState<TrainerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && trainerId) {
      loadTrainerDetail();
    }
  }, [open, trainerId]);

  const loadTrainerDetail = async () => {
    if (!trainerId) return;
    
    try {
      setLoading(true);
      const response = await getTrainerById(trainerId);
      
      if (response.success) {
        setTrainer(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: number, isVerified: boolean) => {
    try {
      await verifyTrainerDocument(documentId, isVerified);
      await loadTrainerDetail(); // Reload data
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái document');
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'info' } = {
      'PERSONAL_TRAINER': 'primary',
      'BOXING': 'warning',
      'YOGA': 'success',
      'CARDIO': 'info',
      'GYM': 'secondary'
    };
    return colors[specialty] || 'default';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: 'success' | 'warning' | 'info' | 'error' } = {
      'BEGINNER': 'info',
      'INTERMEDIATE': 'warning',
      'ADVANCED': 'success',
      'EXPERT': 'error'
    };
    return colors[level] || 'default';
  };

  const formatDocumentType = (type: string) => {
    const types: { [key: string]: string } = {
      'ID_CARD': 'CMND/CCCD',
      'PASSPORT': 'Hộ chiếu',
      'CERTIFICATE': 'Chứng chỉ',
      'LICENSE': 'Giấy phép',
      'DIPLOMA': 'Bằng cấp',
      'HEALTH_CERTIFICATE': 'Giấy khám sức khỏe',
      'CRIMINAL_RECORD': 'Lý lịch tư pháp',
      'CV': 'Sơ yếu lý lịch'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!trainer) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">Không tìm thấy thông tin trainer</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Chi tiết Trainer
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={trainer.avatar}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  {trainer.fullName?.charAt(0)}
                </Avatar>
                
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {trainer.fullName}
                </Typography>
                
                <Chip
                  label={trainer.isActive ? 'Active' : 'Inactive'}
                  color={trainer.isActive ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={trainer.email} />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={trainer.phoneNumber || 'Chưa cập nhật'} />
                  </ListItem>
                  
                  {trainer.totalExperienceYears && (
                    <ListItem>
                      <ListItemIcon>
                        <Work color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={`${trainer.totalExperienceYears} năm kinh nghiệm`} />
                    </ListItem>
                  )}
                  
                  {trainer.education && (
                    <ListItem>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={trainer.education} />
                    </ListItem>
                  )}
                </List>
                
                {trainer.emergencyContact && (
                  <Box mt={2}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Liên hệ khẩn cấp
                    </Typography>
                    <Typography variant="body2">
                      {trainer.emergencyContact}
                    </Typography>
                    {trainer.emergencyPhone && (
                      <Typography variant="body2" color="text.secondary">
                        {trainer.emergencyPhone}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Bio & Specialties */}
          <Grid item xs={12} md={8}>
            {/* Bio */}
            {trainer.bio && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    Tiểu sử
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {trainer.bio}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Specialties */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School color="primary" />
                  Chuyên môn ({trainer.specialties?.length || 0})
                </Typography>
                
                {trainer.specialties?.map((specialty, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                        <Chip
                          label={specialty.specialty}
                          color={getSpecialtyColor(specialty.specialty)}
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={specialty.level}
                          color={getLevelColor(specialty.level || 'BEGINNER')}
                          size="small"
                        />
                      </Box>
                      
                      {specialty.description && (
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {specialty.description}
                        </Typography>
                      )}
                      
                      <Grid container spacing={2}>
                        {specialty.experienceYears && (
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Kinh nghiệm
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {specialty.experienceYears} năm
                            </Typography>
                          </Grid>
                        )}
                        
                        {specialty.certifications && (
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Chứng chỉ
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {specialty.certifications}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                
                {(!trainer.specialties || trainer.specialties.length === 0) && (
                  <Alert severity="info">Chưa có thông tin chuyên môn</Alert>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description color="primary" />
                  Tài liệu & Giấy tờ ({trainer.documents?.length || 0})
                </Typography>
                
                {trainer.documents?.map((doc, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {formatDocumentType(doc.documentType)}
                          </Typography>
                          <Badge
                            color={doc.isVerified ? 'success' : 'warning'}
                            variant="dot"
                          >
                            <Chip
                              icon={doc.isVerified ? <Verified /> : <Warning />}
                              label={doc.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                              color={doc.isVerified ? 'success' : 'warning'}
                              size="small"
                            />
                          </Badge>
                        </Box>
                        
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            startIcon={<Download />}
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            Tải xuống
                          </Button>
                          
                          <Button
                            size="small"
                            variant={doc.isVerified ? 'outlined' : 'contained'}
                            color={doc.isVerified ? 'error' : 'success'}
                            onClick={() => handleVerifyDocument(doc.id, !doc.isVerified)}
                          >
                            {doc.isVerified ? 'Hủy xác minh' : 'Xác minh'}
                          </Button>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {doc.fileName}
                      </Typography>
                      
                      {doc.description && (
                        <Typography variant="body2" paragraph>
                          {doc.description}
                        </Typography>
                      )}
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Ngày tải lên
                          </Typography>
                          <Typography variant="body2">
                            {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Grid>
                        
                        {doc.expiryDate && (
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Ngày hết hạn
                            </Typography>
                            <Typography variant="body2">
                              {new Date(doc.expiryDate).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                
                {(!trainer.documents || trainer.documents.length === 0) && (
                  <Alert severity="info">Chưa có tài liệu nào được tải lên</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainerDetailModal;