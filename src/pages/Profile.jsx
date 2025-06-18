import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userAPI.getProfile().then((res) => res.data),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setSuccess('Profile updated successfully!');
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to update profile');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data) => userAPI.updatePassword(data),
    onSuccess: () => {
      setSuccess('Password updated successfully!');
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to update password');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => userAPI.deleteAccount(),
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to delete account');
    },
  });

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      // You would typically upload this to your server here
    }
  };

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      bio: formData.get('bio'),
    };
    updateProfileMutation.mutate(data);
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      current_password: formData.get('current_password'),
      new_password: formData.get('new_password'),
      confirm_password: formData.get('confirm_password'),
    };
    updatePasswordMutation.mutate(data);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccountMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a472a 0%, #2d8659 100%)',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a472a 0%, #2d8659 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontWeight: 700,
              color: '#1a472a',
            }}
          >
            Profile Settings
          </Typography>

          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={profileImage ? URL.createObjectURL(profileImage) : profile?.avatar_url}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      border: '4px solid #2d8659',
                    }}
                  />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleProfileImageChange}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: '#2d8659',
                        '&:hover': {
                          backgroundColor: '#1a472a',
                        },
                      }}
                    >
                      <PhotoCameraIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </label>
                </Box>
                <Typography variant="h6" sx={{ mt: 2, color: '#1a472a' }}>
                  {profile?.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profile?.email}
                </Typography>
              </Box>
            </Grid>

            {/* Profile Form */}
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  name="username"
                  defaultValue={profile?.username}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2d8659',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={profile?.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2d8659',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  defaultValue={profile?.bio}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2d8659',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
            </Grid>

            {/* Password Update */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Settings
              </Typography>
              <Box component="form" onSubmit={handlePasswordUpdate}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="current_password"
                      type="password"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#2d8659',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="new_password"
                      type="password"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#2d8659',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirm_password"
                      type="password"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#2d8659',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
                    },
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={profile?.email_notifications}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={profile?.marketing_emails}
                        color="primary"
                      />
                    }
                    label="Marketing Emails"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
            </Grid>

            {/* Delete Account */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Danger Zone
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
                sx={{ 
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  },
                }}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccess('')}
            sx={{
              borderRadius: 2,
              backgroundColor: '#2d8659',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile; 