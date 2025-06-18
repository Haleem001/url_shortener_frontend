import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Link,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Link as LinkIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { urlAPI } from '../utils/api';
import QRCodeModal from '../components/QRCodeModal';

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await urlAPI.shorten({
        original_url: url,
        custom_code: customCode || undefined,
      });
      setShortenedUrl(response.data.short_url);
      setSuccess('URL shortened successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to shorten URL');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setSuccess('URL copied to clipboard!');
  };

  const features = [
    {
      icon: <HistoryIcon sx={{ fontSize: 40, color: '#2d8659' }} />,
      title: 'URL History',
      description: 'Keep track of all your shortened URLs in one place',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#2d8659' }} />,
      title: 'Analytics',
      description: 'Get detailed insights about your URL clicks and visitors',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#2d8659' }} />,
      title: 'Security',
      description: 'Manage and delete your URLs whenever you want',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a472a 0%, #2d8659 100%)',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1))',
          },
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Shorten Your URLs
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              fontSize: { xs: '1.2rem', md: '1.6rem' },
              opacity: 0.9,
            }}
          >
            Create short, memorable links for your long URLs
          </Typography>
        </Container>
      </Box>

      {/* URL Shortener Section */}
      <Container maxWidth="sm" sx={{ mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter your URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={!!error}
                  helperText={error}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2d8659',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: <LinkIcon sx={{ mr: 1, color: '#2d8659' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Code (optional)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Enter custom code"
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
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    height: '56px',
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
                    boxShadow: '0 3px 12px rgba(45, 134, 89, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
                      boxShadow: '0 6px 20px rgba(45, 134, 89, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Shorten URL
                </Button>
              </Grid>
            </Grid>
          </Box>

          {shortenedUrl && (
            <Box 
              sx={{ 
                mt: 3, 
                p: 3, 
                bgcolor: 'rgba(45, 134, 89, 0.1)', 
                borderRadius: 2, 
                width: '100%',
                border: '1px solid rgba(45, 134, 89, 0.2)',
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a472a', fontWeight: 600 }}>
                Your shortened URL:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  component="a"
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    flexGrow: 1, 
                    color: '#2d8659', 
                    textDecoration: 'none', 
                    wordBreak: 'break-all',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {shortenedUrl}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={handleCopy} size="small" sx={{ color: '#2d8659' }}>
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="QR Code">
                  <IconButton onClick={() => setShowQRCode(true)} size="small" sx={{ color: '#2d8659' }}>
                    <QrCodeIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
          }}
        >
          Why Sign Up?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a472a', fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sign Up CTA */}
      <Box 
        sx={{ 
          py: 8,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              color: 'white',
              fontWeight: 700,
            }}
          >
            Ready to get started?
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 4,
              color: 'white',
              opacity: 0.9,
            }}
          >
            Sign up now to unlock all features and manage your URLs effectively
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
                boxShadow: '0 3px 12px rgba(45, 134, 89, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
                  boxShadow: '0 6px 20px rgba(45, 134, 89, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

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

      {showQRCode && (
        <QRCodeModal
          open={showQRCode}
          onClose={() => setShowQRCode(false)}
          shortUrl={shortenedUrl}
        />
      )}
    </Box>
  );
};

export default LandingPage; 