import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import type { Role, UserResponse } from '../../../services/adminService.ts';
import {Form} from "antd";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  user?: UserResponse | null;
  roles?: Role[];
  mode: 'create' | 'edit';
  allowedRoles?: string[];
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  roles=[],
  mode,
  allowedRoles
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    roleId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        email: user.email || '',
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        roleId: user.role?.id?.toString() || ''
      });
    } else {
      setFormData({
        email: '',
        fullName: '',
        phoneNumber: '',
        roleId: ''
      });
    }
    setError('');
  }, [user, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (values: typeof formData) => {
    setError('');
    setLoading(true);

    try {
      const submitData = {
        email: values.email,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        roleId: parseInt(values.roleId, 10),
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError((err as any)?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Lọc roles theo allowedRoles
  const filteredRoles = allowedRoles 
    ? roles.filter(role => allowedRoles.includes(role.name))
    : roles;

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
      >
        <Form onFinish={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </DialogTitle>

          <DialogContent>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            {mode === 'create' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  The password will be generated automatically and sent via email
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={mode === 'edit'}
              />

              <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  fullWidth
              />

              <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
              />

              <TextField
                  select
                  label="Role"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={mode === 'edit'}
              >
                {filteredRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #00b4ff, #0066ff)',
                  minWidth: 100
                }}
            >
              {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Add' : 'Save')}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
  );
};

export default UserFormModal;
